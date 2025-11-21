"use client";
import { useState, useRef, useEffect } from "react";

export type SortOption =
  | "none"
  | "price-asc"
  | "price-desc"
  | "change24h-asc"
  | "change24h-desc"
  | "volume24h-asc"
  | "volume24h-desc"
  | "liquidity-asc"
  | "liquidity-desc";

interface Props {
  onSearchChange?: (searchTerm: string) => void;
  onSortChange?: (sortOption: SortOption) => void;
}

const SearchBar: React.FC<Props> = (props) => {
  const { onSearchChange, onSortChange } = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("none");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "none", label: "Sort by" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "change24h-desc", label: "24h Change: High to Low" },
    { value: "change24h-asc", label: "24h Change: Low to High" },
    { value: "volume24h-desc", label: "24h Volume: High to Low" },
    { value: "volume24h-asc", label: "24h Volume: Low to High" },
    { value: "liquidity-desc", label: "Liquidity: High to Low" },
    { value: "liquidity-asc", label: "Liquidity: Low to High" },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    setIsDropdownOpen(false);
    onSortChange?.(option);
  };

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex gap-4 mb-4">
      {/* 搜索输入框 */}
      <div className="flex-1 relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <img
            src="/search-icon.svg"
            alt="search"
            className="w-4 h-4 opacity-60"
          />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search tokens..."
          className="w-full pl-10 pr-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary-text)] placeholder:text-[var(--color-secondary-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-border)] transition-all"
        />
      </div>

      {/* 排序下拉框 */}
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 px-4 py-3 bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg text-[var(--color-primary-text)] hover:bg-[var(--color-row-hovered)] transition-colors min-w-[240px] justify-between cursor-pointer"
        >
          <span className="text-[var(--color-secondary-text)]">Sort by</span>
          <img src="/sort-icon.svg" alt="sort" className="w-4 h-4 opacity-60" />
        </button>

        {/* 下拉菜单 */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-full min-w-[240px] bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-[350px] overflow-y-auto">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSortChange(option.value)}
                className={`w-full px-4 py-2 text-left text-sm transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer ${
                  sortOption === option.value
                    ? "bg-[var(--color-row-hovered)] text-[var(--color-primary-text)]"
                    : "text-[var(--color-secondary-text)] hover:bg-[var(--color-row-hovered)] hover:text-[var(--color-primary-text)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
