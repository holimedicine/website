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
 * Creates a stable, URL-safe slug from a content entry ID.
 * Content entry IDs come from file names and may contain spaces or Polish
 * characters, which are invalid in HTML IDs and URLs.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (char) => PL_DIACRITICS[char] ?? char)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
