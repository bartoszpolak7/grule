import type { Game } from "@/generated/prisma/client";

// informacje o grze wbogacone o dane z rawgio
export type EnrichedGame = Game & {
  rawgRating?: number;
  rawgDescription?: string;
  rawgScreenshots?: string[];
  rawgMetacritic?: number | null;
};
