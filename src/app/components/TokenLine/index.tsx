import { memo, FC } from "react";
import { TrendingData, TokenInfo } from "../../types";
import {
  formatPrice,
  formatNumber,
  formatPercentage,
  getChangeColorClass,
} from "@/src/app/utils/format";

interface Props {
  data: TrendingData;
}

const TokenLine: FC<Props> = (props) => {
  const { data } = props;

  const renderToken = (data: TrendingData) => {
    const { baseName, baseToken, info } = data;
    const tokenInfo = JSON.parse(info) as TokenInfo;

    const formatToken = (token: string) => {
      if (token.length <= 8) return token;
      return `${token.slice(0, 5)}...${token.slice(-3)}`;
    };

    const firstChar = baseName ? baseName.charAt(0) : "";

    return (
      <div className="flex items-center gap-2 pl-4 pr-4 border-r border-[var(--color-border)]">
        <div className="w-[30px] h-[30px] rounded-[4px] flex items-center justify-center flex-shrink-0">
          {tokenInfo.baseLogo ? (
            <img
              src={tokenInfo.baseLogo}
              alt={baseName}
              className="w-full h-full object-cover rounded-[4px]"
            />
          ) : (
            <span className="text-[var(--color-primary-text)] text-sm font-medium">
              {firstChar}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-0">
          <div className="flex items-center gap-1">
            <span className="text-sm text-[var(--color-primary-text)]">
              {baseName}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const url =
                  tokenInfo.website || tokenInfo.twitter || tokenInfo.telegram;
                if (url) {
                  window.open(url, "_blank");
                } else {
                  window.open(
                    `https://x.com/search?q=($${baseName} OR ${baseToken})`,
                    "_blank"
                  );
                }
              }}
              className="flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0"
            >
              <img src="/search-icon.svg" className="w-[11px] h-[11px]" />
            </button>
          </div>
          {/* 第二行：baseToken */}
          <span className="text-sm text-[var(--color-secondary-text)]">
            {formatToken(baseToken)}
          </span>
        </div>
      </div>
    );
  };

  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-row-hovered)] transition-colors cursor-pointer">
      <td className="py-2 text-sm text-[var(--color-primary-text)] text-left">
        {renderToken(data)}
      </td>
      <td className="py-2 text-sm text-[var(--color-primary-text)] text-center">
        <div className="flex items-center justify-center border-r border-[var(--color-border)]">
          <span className="text-sm text-[var(--color-primary-text)]">
            {data.lastTimeDiff}
          </span>
        </div>
      </td>
      <td className="py-2 text-sm text-[var(--color-primary-text)] text-center">
        <div className="flex flex-col items-center justify-center border-r border-[var(--color-border)]">
          <span className="text-sm text-[var(--color-primary-text)]">
            {formatNumber(data.liquidity)}
          </span>
          <span className="text-sm text-[var(--color-secondary-text)]">
            {formatNumber(data.marketCap)}
          </span>
        </div>
      </td>
      <td className="py-2 text-sm text-[var(--color-primary-text)] text-center">
        <div className="flex items-center justify-center border-r border-[var(--color-border)]">
          <span className="text-sm text-[var(--color-primary-text)]">
            {formatPrice(data.priceUsd)}
          </span>
        </div>
      </td>
      <td className="py-2 text-sm text-[var(--color-primary-text)] text-center">
        <div className="flex items-center justify-center border-r border-[var(--color-border)]">
          <span
            className={`text-sm ${getChangeColorClass(data.priceChange24h)}`}
          >
            {formatPercentage(data.priceChange24h)}
          </span>
        </div>
      </td>
      <td className="py-2 text-sm text-[var(--color-primary-text)] text-center">
        <div className="flex flex-col items-center justify-center border-r border-[var(--color-border)]">
          <span className="text-sm text-[var(--color-primary-text)]">
            {data.buyCount24h + data.sellCount24h}
          </span>
          <span className="text-sm">
            <span className="text-sm text-[var(--color-primary-text)] text-green-500">
              {data.buyCount24h}
            </span>
            /
            <span className="text-sm text-[var(--color-primary-text)] text-red-500">
              {data.sellCount24h}
            </span>
          </span>
        </div>
      </td>
      <td className="py-2 text-sm text-[var(--color-primary-text)] text-center">
        <div className="flex items-center justify-center border-r border-[var(--color-border)]">
          <span className="text-sm text-[var(--color-primary-text)]">
            {formatNumber(data.volumeUsd24h)}
          </span>
        </div>
      </td>
      <td className="py-2 text-sm text-[var(--color-primary-text)] text-center">
        <div className="flex items-center justify-center border-r border-[var(--color-border)]">
          <span
            className={`text-sm ${getChangeColorClass(data.priceChange1m)}`}
          >
            {formatPercentage(data.priceChange1m)}
          </span>
        </div>
      </td>
      <td className="py-2 text-sm text-[var(--color-primary-text)] text-center">
        <div className="flex items-center justify-center border-r border-[var(--color-border)]">
          <span
            className={`text-sm ${getChangeColorClass(data.priceChange5m)}`}
          >
            {formatPercentage(data.priceChange5m)}
          </span>
        </div>
      </td>
      <td className="py-2 text-sm text-[var(--color-primary-text)] text-center">
        <div className="flex items-center justify-center">
          <span
            className={`text-sm ${getChangeColorClass(data.priceChange1h)}`}
          >
            {formatPercentage(data.priceChange1h)}
          </span>
        </div>
      </td>
    </tr>
  );
};

export default memo(TokenLine);
