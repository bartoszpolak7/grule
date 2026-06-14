import { parseSpecs, type ParsedSpecs } from "./parseSpecs";

export type RawgGame = {
  id: number;
  name: string;
  description_raw: string;
  background_image: string | null;
  rating: number;
  metacritic: number | null;
  genres: { name: string }[];
  short_screenshots: { image: string }[];
  platforms: {
    platform: { name: string };
    requirements?: {
      minimum?: string;
      recommended?: string;
    };
  }[];
};

export type RawgEnrichedData = {
  imageUrl: string | null;
  rating: number;
  description: string;
  metacritic: number | null;
  screenshots: string[];
  specs: ParsedSpecs;
  genres: string[];
};

export async function getRawgGame(
  rawgId: number,
): Promise<RawgEnrichedData | null> {
  try {
    const res = await fetch(
      `https://api.rawg.io/api/games/${rawgId}?key=${process.env.RAWG_API_KEY}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;
    const data: RawgGame = await res.json();

    const pcPlatform = data.platforms?.find((p) => p.platform.name === "PC");
    const specs = parseSpecs(pcPlatform?.requirements?.minimum);

    return {
      imageUrl: data.background_image,
      rating: data.rating,
      description: data.description_raw,
      metacritic: data.metacritic,
      screenshots: data.short_screenshots?.map((s) => s.image) ?? [],
      specs,
      genres: data.genres?.map((g) => g.name) ?? [],
    };
  } catch {
    return null;
  }
}
