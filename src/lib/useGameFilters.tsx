"use client";

import { useState, useMemo } from "react";
import type { Game } from "@/generated/prisma/client";

export type SortOption = "az" | "za" | "price-asc" | "price-desc";

export interface SearchFilters {
  query: string;
  sort: SortOption;
  selectedGenres: string[];
  maxPrice: number | null;
  maxRamGb: number | null;
  maxStorageGb: number | null;
  potatoOnly: boolean;
}

export const defaultFilters: SearchFilters = {
  query: "",
  sort: "az",
  selectedGenres: [],
  maxPrice: null,
  maxRamGb: null,
  maxStorageGb: null,
  potatoOnly: false,
};

export function useGameFilters(games: Game[]) {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  const genres = useMemo(
    () => Array.from(new Set(games.flatMap((g) => g.genres ?? []))).sort(),
    [games],
  );

  const filtered = useMemo(() => {
    let result = [...games];

    if (filters.query) {
      const q = filters.query.toLowerCase();
      result = result.filter((g) => g.title.toLowerCase().includes(q));
    }

    if (filters.selectedGenres.length > 0) {
      result = result.filter((g) =>
        g.genres.some((genre) => filters.selectedGenres.includes(genre)),
      );
    }

    if (filters.maxPrice !== null) {
      result = result.filter((g) => g.price <= filters.maxPrice!);
    }

    if (filters.maxRamGb !== null) {
      result = result.filter(
        (g) => g.minRamGb === null || g.minRamGb <= filters.maxRamGb!,
      );
    }

    if (filters.maxStorageGb !== null) {
      result = result.filter(
        (g) =>
          g.minStorageGb === null || g.minStorageGb <= filters.maxStorageGb!,
      );
    }

    if (filters.potatoOnly) {
      result = result.filter((g) => !g.requiresGpu);
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
