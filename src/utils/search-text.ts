/**
 * Pure search helpers shared by the build-time index and the browser search UI.
 *
 * The site is static, so matching happens entirely on the client. This module
 * intentionally has no Astro/browser imports so it can be used from both sides.
 */

export type SearchEntryType = 'artykul' | 'przepis' | 'produkt';

/** One searchable item: a knowledge-base article, a recipe, or a product. */
export type SearchEntry = {
  type: SearchEntryType;
  title: string;
  /** Short description shown under the title (teaser/summary/examples). */
  summary: string;
  /** Full plain-text body and metadata, searched after the title and summary. */
  text: string;
  /** Deep link that opens the matching modal on its page. */
  url: string;
};

/** A prepared entry with normalized haystacks, created once after fetching. */
export type PreparedSearchEntry = SearchEntry & {
  titleNormalized: string;
  summaryNormalized: string;
  textNormalized: string;
};

export type SnippetPart = {
  text: string;
  match: boolean;
};

const PL_DIACRITICS: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l',
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

/**
 * Lowercases, strips Polish diacritics and other accents, and collapses
 * punctuation so that "witaminą" and "witamina" share the same haystack.
 */
export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => PL_DIACRITICS[char] ?? char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// Longest first: "witaminach" -> "witamin", "witaminy" -> "witamin".
const SUFFIXES = [
  'owie',
  'ami',
  'ach',
  'ego',
  'emu',
  'owej',
  'owych',
  'ow',
  'om',
  'em',
  'ie',
  'ej',
  'ym',
  'im',
  'y',
  'i',
  'a',
  'e',
  'u',
  'o',
];

/** Cheap Polish-ish stem used to match inflected forms ("witamina" → "witaminy"). */
export function stemToken(token: string): string {
  for (const suffix of SUFFIXES) {
    if (token.endsWith(suffix) && token.length - suffix.length >= 4) {
      return token.slice(0, -suffix.length);
    }
  }
  return token;
}

/** Splits a query into unique normalized tokens, ignoring an empty query. */
export function queryTokens(query: string): string[] {
  return Array.from(new Set(normalizeText(query).split(' ').filter(Boolean)));
}

function containsWordPrefix(haystack: string, token: string): boolean {
  if (!token) return false;

  let index = haystack.indexOf(token);
  while (index !== -1) {
    if (index === 0 || haystack[index - 1] === ' ') return true;
    index = haystack.indexOf(token, index + 1);
  }

  return false;
}

function tokenMatches(haystack: string, token: string): boolean {
  if (containsWordPrefix(haystack, token)) return true;

  const stem = stemToken(token);
  return stem !== token && containsWordPrefix(haystack, stem);
}

function matchesAllTokens(haystack: string, tokens: string[]): boolean {
  return tokens.every((token) => tokenMatches(haystack, token));
}

export function prepareSearchEntries(entries: SearchEntry[]): PreparedSearchEntry[] {
  return entries.map((entry) => ({
    ...entry,
    titleNormalized: normalizeText(entry.title),
    summaryNormalized: normalizeText(entry.summary),
    textNormalized: normalizeText(entry.text),
  }));
}

function scoreEntry(entry: PreparedSearchEntry, tokens: string[]): number | null {
  const haystack = `${entry.titleNormalized} ${entry.summaryNormalized} ${entry.textNormalized}`;
  if (!matchesAllTokens(haystack, tokens)) return null;

  let score = 0;
  for (const token of tokens) {
    if (tokenMatches(entry.titleNormalized, token)) {
      score += 60;
    } else if (tokenMatches(entry.summaryNormalized, token)) {
      score += 12;
    } else {
      score += 2;
    }
  }

  const phrase = tokens.join(' ');
  if (entry.titleNormalized === phrase) score += 100;
  else if (entry.titleNormalized.includes(phrase)) score += 80;
  else if (entry.summaryNormalized.includes(phrase)) score += 20;

  return score;
}

export function searchEntries(
  entries: PreparedSearchEntry[],
  query: string,
  limit = 30
): PreparedSearchEntry[] {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return [];

  const ranked: { entry: PreparedSearchEntry; score: number }[] = [];
  for (const entry of entries) {
    const score = scoreEntry(entry, tokens);
    if (score !== null) ranked.push({ entry, score });
  }

  ranked.sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'pl'));
  return ranked.slice(0, limit).map((item) => item.entry);
}

type SnippetOptions = {
  /** Words shown before and after the first match. */
  radius?: number;
};

/**
 * Returns the matched fragment as text parts, flagging words that should be
 * highlighted. Falls back to the opening words when nothing matches (for
 * example when only the title matched).
 */
export function buildSnippet(
  text: string,
  tokens: string[],
  { radius = 8 }: SnippetOptions = {}
): SnippetPart[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const normalizedWords = words.map(normalizeText);
  const matches = normalizedWords.map((word) =>
    word ? tokens.some((token) => tokenMatches(` ${word} `, token)) : false
  );

  const firstMatch = matches.findIndex(Boolean);
  const center = firstMatch === -1 ? 0 : firstMatch;
  const start = Math.max(0, center - radius);
  const end = Math.min(words.length, center + radius + 1);

  const parts: SnippetPart[] = [];
  const push = (part: SnippetPart) => {
    const previous = parts[parts.length - 1];
    if (previous && previous.match === part.match) {
      previous.text += part.text;
    } else {
      parts.push({ ...part });
    }
  };

  if (start > 0) push({ text: '… ', match: false });

  for (let index = start; index < end; index += 1) {
    const isLast = index === end - 1;
    push({ text: words[index] + (isLast ? '' : ' '), match: matches[index] ?? false });
  }

  if (end < words.length) push({ text: ' …', match: false });

  return parts;
}
