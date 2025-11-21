import { useState, useMemo, useCallback } from "react";
import { TrendingData } from "../types";
import { SortOption } from "../components/SearchBar";

export interface UseTrendingTokensReturn {
  /** 过滤和排序后的列表 */
  tokenList: TrendingData[];
  /** 更新原始token列表 */
  updateTokens: (tokens: TrendingData[]) => void;
  /** 搜索内容 */
  searchTerm: string;
  /** 修改搜索内容 */
  setSearchTerm: (term: string) => void;
  /** 排序选项 */
  sortOption: SortOption;
  /** 修改排序选项 */
  setSortOption: (option: SortOption) => void;
}

/**
 * 管理trending token列表的状态管理Hook
 * 负责维护原始token列表、搜索和排序逻辑
 *
 * @returns token列表和状态管理方法
 */
export const useTrendingTokens = (): UseTrendingTokensReturn => {
  const [rawTokens, setRawTokens] = useState<TrendingData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("none");

  // 更新原始token列表
  const updateTokens = useCallback((tokens: TrendingData[]) => {
    setRawTokens(tokens);
  }, []);

  // 搜索和排序逻辑
  const tokenList = useMemo(() => {
    let filtered = [...rawTokens];

    // 搜索过滤
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (token) =>
          token.baseName.toLowerCase().includes(term) ||
          token.baseToken.toLowerCase().includes(term) ||
          token.baseSymbol.toLowerCase().includes(term)
      );
    }

    // 排序
    if (sortOption !== "none") {
      filtered.sort((a, b) => {
        let aValue: number;
        let bValue: number;

        switch (sortOption) {
          case "price-asc":
            aValue = a.price;
            bValue = b.price;
            return aValue - bValue;
          case "price-desc":
            aValue = a.price;
            bValue = b.price;
            return bValue - aValue;
          case "change24h-asc":
            aValue = a.priceChange24h;
            bValue = b.priceChange24h;
            return aValue - bValue;
          case "change24h-desc":
            aValue = a.priceChange24h;
            bValue = b.priceChange24h;
            return bValue - aValue;
          case "volume24h-asc":
            aValue = a.volumeUsd24h;
            bValue = b.volumeUsd24h;
            return aValue - bValue;
          case "volume24h-desc":
            aValue = a.volumeUsd24h;
            bValue = b.volumeUsd24h;
            return bValue - aValue;
          case "liquidity-asc":
            aValue = a.liquidity;
            bValue = b.liquidity;
            return aValue - bValue;
          case "liquidity-desc":
            aValue = a.liquidity;
            bValue = b.liquidity;
            return bValue - aValue;
          default:
            return 0;
        }
      });
    }

    return filtered;
  }, [rawTokens, searchTerm, sortOption]);

  return {
    tokenList,
    updateTokens,
    searchTerm,
    setSearchTerm,
    sortOption,
    setSortOption,
  };
};
