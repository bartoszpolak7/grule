"use client";

import { useState, useMemo } from "react";
import type { SearchFilters } from "@/components/GameSearch";
import type { Game } from "@/generated/prisma/client";

export const defaultFilters: SearchFilters = {
  query: "",
  sort: "az",
  genre: "all",
  maxPrice: null,
};

export function useGameFilters(games: Game[]) {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const genres = useMemo(
    () => Array.from(new Set(games.map((g) => g.genre))).sort(),
    [games],
  );

  const filtered = useMemo(() => {
    let result = [...games];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter((g) => g.title.toLowerCase().includes(q));
    }

    if (filters.genre !== "all") {
      result = result.filter((g) => g.genre === filters.genre);
    }

    if (filters.maxPrice !== null) {
      result = result.filter((g) => g.price <= filters.maxPrice!);
    }

    switch (filters.sort) {
      case "az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "za":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
    }

    return result;
  }, [games, filters]);

  return { filters, setFilters, filtered, genres };
}
