"use client";

import { SearchFilters } from "@/lib/useGameFilters";

export type SortOption = "az" | "za" | "price-asc" | "price-desc";
export type GenreOption = string | "all";

interface Props {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  genres: string[]; // od rodzica, żeby działało biblioteka i sklep
  showPriceFilter?: boolean; // tylko sklep pokazuje cenę
}

export default function GameSearch({
  filters,
  onChange,
  genres,
  showPriceFilter = true,
}: Readonly<Props>) {
  const update = (partial: Partial<SearchFilters>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className="nes-container is-dark with-title mb-6">
      <p className="title text-xs">Wypatrz bulwę</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TEKSTOWE - TYTUŁ */}
        <div className="nes-field">
          <label htmlFor="search">Szukaj...</label>
          <input
            id="search"
            type="text"
            className="nes-input is-dark"
            placeholder="Tytuł gry..."
            value={filters.query}
            onChange={(e) => update({ query: e.target.value })}
          />
        </div>

        {/* GATUNEK */}
        <div className="nes-field">
          <label htmlFor="genre">GATUNEK</label>
          <div className="nes-select is-dark">
            <select
              id="genre"
              value={filters.genre}
              onChange={(e) => update({ genre: e.target.value })}
            >
              <option value="all">WSZYSTKIE GATUNKI</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* SORTOWANIE */}
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

        {/* Maksymalna cena - tylko sklep */}
        {showPriceFilter && (
          <div className="nes-field">
            <label htmlFor="maxPrice">
              MAKSYMALNA CENA{" "}
              {filters.maxPrice === null ? "DOWOLNA" : `$${filters.maxPrice}`}
            </label>
            <input
              id="maxPrice"
              type="range"
              min={0}
              max={100}
              step={1}
              value={filters.maxPrice ?? 100}
              onChange={(e) => {
                const val = Number(e.target.value);
                update({ maxPrice: val === 100 ? null : val });
              }}
              className="nes-progress"
              style={{ width: "100%", marginTop: "0.5rem" }}
            />
          </div>
        )}

        {/* POTATO ONLY */}
        <div className="flex items-center gap-2 mt-2">
          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              className="nes-checkbox"
              checked={filters.potatoOnly}
              onChange={(e) => update({ potatoOnly: e.target.checked })}
            />
            <span>🥔 POTATO PC ONLY (brak dedykowanej karty graficznej)</span>
          </label>
        </div>

        {/* MAX RAM */}
        <div className="nes-field">
          <label htmlFor="maxRam">
            MAKS. RAM:{" "}
            {filters.maxRamGb === null ? "DOWOLNY" : `${filters.maxRamGb}GB`}
          </label>
          <input
            id="maxRam"
            type="range"
            min={1}
            max={33} // 33 = sentinel for "any"
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

        <div className="nes-field">
          <label htmlFor="maxStorage">
            MAKS. DYSK:{" "}
            {filters.maxStorageGb === null
              ? "DOWOLNY"
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
            <span>DOWOLNY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
