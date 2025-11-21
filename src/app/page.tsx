"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import TokenLine from "./components/TokenLine";
import SearchBar from "./components/SearchBar";
import { useTrendingTokens } from "./hooks/useTrendingTokens";
import { trendingTokenService } from "./services";
import { TrendingMessage } from "./types";

const Home = () => {
  const [listStatus, setListStatus] = useState<"error" | "loading" | "normal">(
    "loading"
  );

  const reconnectCount = useRef(0);

  const { tokenList, updateTokens, setSearchTerm, setSortOption } =
    useTrendingTokens();

  const handleMessage = useCallback(
    (data: TrendingMessage) => {
      console.warn("handleMessage", data);
      setListStatus("normal");
      updateTokens(data.data);
      reconnectCount.current = 0;
    },
    [updateTokens]
  );

  const handleDisconnected = useCallback(() => {
    reconnectCount.current++;
    if (reconnectCount.current > 5) {
      setListStatus("error");
      trendingTokenService.disconnect();
    }
  }, []);

  const handleConnected = useCallback(() => {
    trendingTokenService.send({
      topic: "trending",
      event: "sub",
      interval: "",
      pair: "",
      chainId: "56",
      compression: 1,
    });
  }, []);

  useEffect(() => {
    trendingTokenService.onDisconnect(handleDisconnected);
    trendingTokenService.onConnected(handleConnected);
    trendingTokenService.subscribe("trending", handleMessage);
    return () => {
      trendingTokenService.unsubscribe("trending", handleMessage);
      trendingTokenService.offDisconnect(handleDisconnected);
      trendingTokenService.offConnected(handleConnected);
    };
  }, [handleMessage, handleDisconnected, handleConnected]);

  // 表头配置
  const tableHeaders = [
    { label: "Token", className: "text-left w-[240px] max-w-[360px]" },
    { label: "Age", className: "text-center" },
    { label: "Liq/MC", className: "text-center" },
    { label: "Price", className: "text-center" },
    { label: "24h chg %", className: "text-center" },
    { label: "24h TXs", className: "text-center" },
    { label: "24h Vol", className: "text-center" },
    { label: "1m%", className: "text-center" },
    { label: "5m%", className: "text-center" },
    { label: "1h%", className: "text-center" },
  ];

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-8">
        <SearchBar
          onSearchChange={setSearchTerm}
          onSortChange={setSortOption}
        />
        <div className="overflow-x-auto rounded-lg border border-[var(--color-border)]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-background)]">
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    className={`px-4 py-4 text-xs font-medium text-[var(--color-secondary-text)] tracking-wider whitespace-nowrap${
                      header.className ? ` ${header.className}` : ""
                    }`}
                  >
                    {header.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listStatus === "loading" ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center">
                    <div className="animate-pulse flex items-center justify-center h-100">
                      <span className="text-sm text-[var(--color-secondary-text)]">
                        Loading...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : listStatus === "error" ? (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center">
                    <div className="flex items-center justify-center h-100">
                      <span className="text-sm text-red-500">
                        Error loading data
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                tokenList.map((token) => (
                  <TokenLine key={token.baseToken} data={token} />
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Home;
