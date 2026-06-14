"use client";

export type SortOption = "az" | "za" | "price-asc" | "price-desc";
export type GenreOption = string | "all";

export interface SearchFilters {
  query: string;
  sort: SortOption;
  genre: GenreOption;
  maxPrice: number | null;
}

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
}: Props) {
  const update = (partial: Partial<SearchFilters>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className="nes-container is-dark with-title mb-6">
      <p className="title text-xs">Wypatrz bulwę</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Text search */}
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

        {/* Genre filter */}
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

        {/* Sort */}
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
              {filters.maxPrice !== null ? `$${filters.maxPrice}` : "ANY"}
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
      </div>
    </div>
  );
}
