/** 订阅的消息 */
export type TrendingMessage = {
  compression: number;
  data: TrendingData[];
  topic: string;
  pair: string;
  msg?: string;
  code?: string;
  t?: number;
  chainId?: string;
  interval?: string;
  event?: string;
};

/** 趋势数据 */
export type TrendingData = {
  baseDecimals: number;
  baseName: string;
  baseSupply: number;
  baseSymbol: string;
  baseToken: string;
  buyCount24h: number;
  chainId: string;
  count24h: number;
  dex: string;
  info: string;
  lastTimeDiff: string;
  liquidity: number;
  marketCap: number;
  pair: string;
  price: number;
  priceChange1h: number;
  priceChange1m: number;
  priceChange24h: number;
  priceChange4h: number;
  priceChange5m: number;
  priceNative: number;
  priceUsd: number;
  quoteName: string;
  quoteSymbol: string;
  quoteToken: string;
  sellCount24h: number;
  timeDiff: string;
  volumeUsd24h: number;
};

/** 代币信息 */
export type TokenInfo = {
  quoteLogo: string;
  twitter: string;
  website: string;
  telegram: string;
  baseLogo: string;
};

/** 趋势消息回调 */
export interface TrendingMessageCallback {
  trending: {
    (data: TrendingMessage): void;
  };
}
