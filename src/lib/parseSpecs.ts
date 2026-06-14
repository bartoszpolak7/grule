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

  // RAM: "2 gb ram", "memory: 2 gb", "2gb memory", "2048 mb"
  const ramGbMatch =
    lower.match(/(\d+)\s*gb[\s,]*(ram|memory)?/i) ??
    lower.match(/memory[:\s]+(\d+)\s*gb/i);
  const ramMbMatch =
    lower.match(/(\d+)\s*mb[\s,]*(ram|memory)/i) ??
    lower.match(/memory[:\s]+(\d+)\s*mb/i);

  let minRamGb: number | null = null;
  if (ramGbMatch) minRamGb = parseInt(ramGbMatch[1]);
  else if (ramMbMatch) minRamGb = Math.ceil(parseInt(ramMbMatch[1]) / 1024);

  // Storage: "hard disk space: 1 gb", "storage: 20 gb", "1gb hdd"
  const storageMatch =
    lower.match(/hard\s*disk\s*space[:\s]+(\d+)\s*gb/i) ??
    lower.match(/(\d+)\s*gb[\s,]*(available|storage|space|hdd|ssd)/i);
  const minStorageGb = storageMatch ? parseInt(storageMatch[1]) : null;

  // GPU: słowa związane z dedykowanymi kartami
  const gpuKeywords = [
    "nvidia",
    "geforce",
    "gtx",
    "rtx",
    "radeon",
    "rx ",
    "dedicated",
    "shader model 2",
    "shader model 3",
  ];
  const requiresGpu = gpuKeywords.some((k) => lower.includes(k));

  // OS
  const osMatch = minimum.match(
    /(?:os[:\s]+|^)([^\n,]+(?:windows|xp|vista|ubuntu|os x)[^\n,]*)/i,
  );
  const minOs = osMatch ? osMatch[1].trim() : null;

  return { minRamGb, minStorageGb, requiresGpu, minOs };
}
