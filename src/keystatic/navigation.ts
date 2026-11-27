/**
 * Keystatic admin sidebar groups. Every key must match a singleton or
 * collection key exported from `src/keystatic/index.ts`.
 */
const group = <K extends string>(keys: K[]) => keys;

export const navigation = {
  'Strona główna': group(['about', 'podejscie', 'zakres', 'contact']),
  'Baza wiedzy': group([
    'bazaWiedzyPage',
    'sekcjeBazyWiedzy',
    'tematyBazyWiedzy',
    'edukacja',
    'produktyPage',
    'produkty',
    'sekcjeProduktow',
  ]),
  Przepisy: group(['przepisy', 'kategoriePrzepisow']),
  Współpraca: group(['wspolpraca', 'professions']),
};
