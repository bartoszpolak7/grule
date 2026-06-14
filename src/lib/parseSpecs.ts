export type ParsedSpecs = {
  minRamGb: number | null;
  minStorageGb: number | null;
  requiresGpu: boolean;
  minOs: string | null;
};

export function parseSpecs(minimum: string | undefined): ParsedSpecs {
  if (!minimum) {
    return {
      minRamGb: null,
      minStorageGb: null,
      requiresGpu: false,
      minOs: null,
    };
  }

  const lower = minimum.toLowerCase();

  // RAM
  const ramGbMatch = lower.match(/(\d+)\s*gb\s*(ram|memory)/i);
  const ramMbMatch = lower.match(/(\d+)\s*mb\s*(ram|memory)/i);
  let minRamGb: number | null = null;
  if (ramGbMatch) minRamGb = parseInt(ramGbMatch[1]);
  else if (ramMbMatch) minRamGb = Math.ceil(parseInt(ramMbMatch[1]) / 1024);

  // STORAGE
  const storageMatch = lower.match(
    /(\d+)\s*gb\s*(available|storage|space|hdd|ssd)/i,
  );
  const minStorageGb = storageMatch ? parseInt(storageMatch[1]) : null;

  // GPU
  const gpuKeywords = [
    "nvidia",
    "geforce",
    "gtx",
    "rtx",
    "radeon",
    "rx ",
    "amd gpu",
    "dedicated",
  ];
  const requiresGpu = gpuKeywords.some((k) => lower.includes(k));

  // SYSTEM
  const osMatch = minimum.match(/os[:\s]+([^\n,]+)/i);
  const minOs = osMatch ? osMatch[1].trim() : null;

  return { minRamGb, minStorageGb, requiresGpu, minOs };
}
