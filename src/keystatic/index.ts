import { about, contact, podejscie, zakres } from './site';
import {
  bazaWiedzyPage,
  edukacja,
  sekcjeBazyWiedzy,
  tematyBazyWiedzy,
} from './baza-wiedzy';
import { kategoriePrzepisow, przepisy } from './przepisy';
import { produkty, produktyPage, sekcjeProduktow } from './produkty';
import { professions, wspolpraca } from './wspolpraca';

export const singletons = {
  about,
  podejscie,
  zakres,
  contact,
  wspolpraca,
  produktyPage,
  bazaWiedzyPage,
};

export const collections = {
  edukacja,
  kategoriePrzepisow,
  przepisy,
  produkty,
  sekcjeProduktow,
  professions,
  sekcjeBazyWiedzy,
  tematyBazyWiedzy,
};

export { navigation } from './navigation';
