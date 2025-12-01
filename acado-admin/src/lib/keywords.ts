export const parseKeywords = (value?: string | null): string[] => {
  if (!value) return [];
  return value
    .split(',')
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean);
};

export const formatKeywords = (keywords: string[]): string | undefined => {
  if (!keywords.length) return undefined;
  const uniqueKeywords = Array.from(new Set(keywords.map((keyword) => keyword.trim().toLowerCase()))).filter(
    Boolean
  );
  return uniqueKeywords.length ? uniqueKeywords.join(',') : undefined;
};


