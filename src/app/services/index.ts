import {
  TrendingData,
  TrendingMessage,
  TrendingMessageCallback,
} from "../types";
import { decompressData } from "@/src/app/utils";

/**
 * WebSocket消息类型定义
 */
export interface WebSocketMessage {
  ping?: string;
  msg?: string;
  code?: string;
  t?: number;
  data?: TrendingData[];
  topic?: string;
  compression?: number;
  event?: string;
  interval?: string;
  pair?: string;
  chainId?: string;
  pong?: string;
}

class TrendingTokenService {
  private ws: WebSocket | null = null;
  private sendQueue: object[] = [];
  private isConnected = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectIntervalSeconds = 1;
  private allowReconnect = true;
  private listeners = {} as {
    [key in keyof TrendingMessageCallback]: TrendingMessageCallback[key][];
  };
  private eventListeners = {
    disconnected: [] as (() => void)[],
    connected: [] as (() => void)[],
  };
  private url = "wss://web-t.pinkpunk.io/ws";

  constructor() {
    this.connect();
  }

  /** 重新连接 */
  private reconnect = () => {
    if (!this.allowReconnect) return;
    this.ws?.close();
    this.reconnectIntervalSeconds *= 2;
    this.connect();
  };

  /** 连接关闭 */
  private onClose = () => {
    this.isConnected = false;
    if (!this.reconnectTimer && this.allowReconnect) {
      this.reconnectTimer = setTimeout(
        this.reconnect,
        this.reconnectIntervalSeconds * 1000
      );
    }
    this.eventListeners.disconnected.forEach((cb) => cb());
  };

  /** 连接成功 */
  private onOpen = () => {
    this.isConnected = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    while (this.sendQueue.length > 0) {
      this.send(this.sendQueue.shift()!);
    }
    this.eventListeners.connected.forEach((cb) => cb());
  };

  /** 连接错误 */
  private onError = (event: Event) => {
    console.warn("WebSocket error:", event);
    this.isConnected = false;
    if (!this.reconnectTimer && this.allowReconnect) {
      this.reconnectTimer = setTimeout(
        this.reconnect,
        this.reconnectIntervalSeconds * 1000
      );
    }
    this.eventListeners.disconnected.forEach((cb) => cb());
  };

  /** 收到消息 */
  private onMessage = (event: MessageEvent) => {
    this.reconnectIntervalSeconds = 1;
    let data: WebSocketMessage;
    try {
      data = JSON.parse(event.data);
    } catch (error) {
      data = JSON.parse(decompressData(event.data as string));
    }

    if (data.ping) {
      this.pong();
    } else {
      const topic = data.topic;
      const listener = this.listeners[topic as keyof TrendingMessageCallback];
      if (listener) {
        listener.forEach((cb) => cb(data as TrendingMessage));
      }
    }
  };

  /** 心跳 */
  private pong = () => {
    const currentTime = Date.now();
    this.ws?.send(
      JSON.stringify({
        topic: "pong",
        event: "sub",
        pong: String(currentTime),
        interval: "",
        pair: "",
        chainId: "",
        compression: 0,
      })
    );
  };

  /** 监听连接断开 */
  public onDisconnect(callback: () => void) {
    this.eventListeners.disconnected.push(callback);
  }

  /** 取消监听连接断开 */
  public offDisconnect(callback: () => void) {
    this.eventListeners.disconnected = this.eventListeners.disconnected.filter(
      (cb) => cb !== callback
    );
  }

  /** 监听连接成功 */
  public onConnected(callback: () => void) {
    this.eventListeners.connected.push(callback);
  }

  /** 取消监听连接成功 */
  public offConnected(callback: () => void) {
    this.eventListeners.connected = this.eventListeners.connected.filter(
      (cb) => cb !== callback
    );
  }

  /** 发送数据 */
  public send(data: object) {
    if (this.isConnected) {
      this.ws?.send(JSON.stringify(data));
    } else {
      this.sendQueue.push(data);
    }
  }

  /** 订阅消息 */
  public subscribe<K extends keyof TrendingMessageCallback>(
    topic: K,
    callback: TrendingMessageCallback[K]
  ) {
    if (!this.listeners[topic]) {
      this.listeners[topic] = [];
    }
    this.listeners[topic].push(callback);
  }

  /** 取消订阅消息 */
  public unsubscribe<K extends keyof TrendingMessageCallback>(
    topic: K,
    callback: TrendingMessageCallback[K]
  ) {
    if (this.listeners[topic]) {
      this.listeners[topic] = this.listeners[topic].filter(
        (cb) => cb !== callback
      );
    }
  }

  /** 主动断开连接 */
  public disconnect() {
    this.allowReconnect = false;
    this.ws?.close();
  }

  /** 主动连接 */
  public connect() {
    this.allowReconnect = true;
    this.ws = new WebSocket(this.url);
    this.ws.onerror = this.onError;
    this.ws.onmessage = this.onMessage;
    this.ws.onclose = this.onClose;
    this.ws.onopen = this.onOpen;
  }
}

export const trendingTokenService = new TrendingTokenService();
