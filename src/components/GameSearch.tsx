"use client";

import type { SearchFilters, SortOption } from "@/lib/useGameFilters";

interface Props {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  genres: string[];
  showPriceFilter?: boolean;
}

export default function GameSearch({
  filters,
  onChange,
  genres = [],
  showPriceFilter = true,
}: Readonly<Props>) {
  const update = (partial: Partial<SearchFilters>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className="nes-container is-dark with-title mb-6">
      <p className="title text-xs">Wypatrz bulwę</p>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* Col 1: Wyszukiwanie */}
        <div className="nes-field">
          <label htmlFor="search">SZUKAJ</label>
          <input
            id="search"
            type="text"
            className="nes-input is-dark"
            placeholder="Tytuł gry..."
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
          />
        </div>

        {/* Col 2: Sortowanie */}
        <div className="nes-field">
          <label htmlFor="sort">SORTUJ</label>
          <div className="nes-select is-dark">
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => update({ sort: e.target.value as SortOption })}
            >
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
              <option value="price-asc">OD NAJTAŃSZYCH</option>
              <option value="price-desc">OD NAJDROŻSZYCH</option>
            </select>
          </div>
        </div>

        {/* Col 3: Cena — zajmuje miejsce nawet ukryta */}
        <div
          className="nes-field"
          style={{ visibility: showPriceFilter ? "visible" : "hidden" }}
        >
          <label htmlFor="maxPrice">
            CENA MAX:{" "}
            {filters.maxPrice === null ? "DOWOLNA" : `$${filters.maxPrice}`}
          </label>
          <input
            id="maxPrice"
            type="range"
            min={1}
            max={101}
            step={1}
            value={filters.maxPrice ?? 101}
            onChange={(e) => {
              const val = Number(e.target.value);
              update({ maxPrice: val === 101 ? null : val });
            }}
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
          <div className="flex justify-between text-xs mt-1">
            <span>$1</span>
            <span>$50</span>
            <span>DOWOLNA</span>
          </div>
        </div>

        {/* Col 4: Potato */}
        <div className="flex flex-col justify-center gap-3">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              className="nes-checkbox"
              checked={filters.potatoOnly}
              onChange={(e) => update({ potatoOnly: e.target.checked })}
            />
            <span>🥔 POTATO ONLY</span>
          </label>
        </div>

        {/* Row 2: RAM */}
        <div className="nes-field">
          <label htmlFor="maxRam">
            RAM MAX:{" "}
            {filters.maxRamGb === null ? "DOWOLNY" : `${filters.maxRamGb}GB`}
          </label>
          <input
            id="maxRam"
            type="range"
            min={1}
            max={33}
            step={1}
            value={filters.maxRamGb ?? 33}
            onChange={(e) => {
              const val = Number(e.target.value);
              update({ maxRamGb: val === 33 ? null : val });
            }}
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
          <div className="flex justify-between text-xs mt-1">
            <span>1GB</span>
            <span>16GB</span>
            <span>DOWOLNY</span>
          </div>
        </div>

        {/* Row 2: Dysk */}
        <div className="nes-field">
          <label htmlFor="maxStorage">
            DYSK MAX:{" "}
            {filters.maxStorageGb === null
              ? "DOWOLNA"
              : `${filters.maxStorageGb}GB`}
          </label>
          <input
            id="maxStorage"
            type="range"
            min={1}
            max={129}
            step={1}
            value={filters.maxStorageGb ?? 129}
            onChange={(e) => {
              const val = Number(e.target.value);
              update({ maxStorageGb: val === 129 ? null : val });
            }}
            style={{ width: "100%", marginTop: "0.5rem" }}
          />
          <div className="flex justify-between text-xs mt-1">
            <span>1GB</span>
            <span>64GB</span>
            <span>DOWOLNA</span>
          </div>
        </div>
      </div>
    </div>
  );
}
