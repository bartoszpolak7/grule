// informacje o grze wbogacone o dane z rawgio
import type { Game } from "@/generated/prisma/client";
import type { ParsedSpecs } from "./parseSpecs";

export type EnrichedGame = Game & {
  rawgRating?: number;
  rawgDescription?: string;
  rawgScreenshots?: string[];
  rawgMetacritic?: number | null;
  rawgSpecs?: ParsedSpecs;
};
