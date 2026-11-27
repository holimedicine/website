import { collection, fields, singleton } from '@keystatic/core';
import { authorField, eyebrowField, headingField, orderField, slugTitle } from './fields';

export const bazaWiedzyPage = singleton({
  label: 'Strona Bazy wiedzy',
  path: 'src/content/baza-wiedzy-page/',
  format: { data: 'json' },
  schema: {
    eyebrow: eyebrowField('Baza wiedzy'),
    title: headingField('Baza wiedzy', 'Tytuł strony'),
    lead: fields.text({
      label: 'Wstęp',
      description: 'Tekst pod nagłówkiem strony głównej Bazy wiedzy.',
      multiline: true,
    }),
    allArticlesLabel: fields.text({
      label: 'Etykieta linku „Wszystkie artykuły”',
      defaultValue: 'Zobacz wszystkie artykuły',
    }),
    disclaimer: fields.text({
      label: 'Zastrzeżenie edukacyjne',
      description: 'Widoczne na stronie głównej Bazy wiedzy i przy artykułach.',
      multiline: true,
    }),
  },
});

export const sekcjeBazyWiedzy = collection({
  label: 'Sekcje bazy wiedzy',
  slugField: 'title',
  path: 'src/content/sekcje-bazy-wiedzy/*',
  format: { data: 'json' },
  columns: ['title', 'order', 'kind'],
  schema: {
    title: slugTitle(
      'Nazwa sekcji',
      'Identyfikator jest częścią adresu sekcji. Zmiana może wymagać poprawienia przypisań artykułów.'
    ),
    order: orderField('Kolejność sekcji', 'Im mniejsza liczba, tym wcześniej sekcja pojawia się na hubie i w menu.'),
    summary: fields.text({
      label: 'Krótki opis',
      description: 'Widoczny na kafelku sekcji na stronie głównej Bazy wiedzy.',
      multiline: true,
    }),
    kind: fields.select({
      label: 'Typ sekcji',
      description:
        '„Artykuły” to zwykła sekcja z artykułami. „Suplementy” prowadzi do istniejącej strony suplementów.',
      options: [
        { label: 'Artykuły', value: 'articles' },
        { label: 'Suplementy', value: 'supplements' },
      ],
      defaultValue: 'articles',
    }),
    href: fields.text({
      label: 'Link docelowy (opcjonalnie)',
      description:
        'Wypełnij tylko wtedy, gdy sekcja ma prowadzić do istniejącej strony wewnętrznej, np. /produkty/. Podaj ścieżkę zaczynającą się od /. Pozostaw puste dla zwykłej sekcji.',
    }),
  },
});

export const tematyBazyWiedzy = collection({
  label: 'Tematy w sekcjach',
  slugField: 'title',
  path: 'src/content/tematy-bazy-wiedzy/*',
  format: { data: 'json' },
  columns: ['title', 'section', 'order'],
  schema: {
    title: slugTitle(
      'Nazwa tematu',
      'Identyfikator jest częścią adresu tematu. Zmiana może wymagać poprawienia przypisań artykułów.'
    ),
    section: fields.relationship({
      label: 'Sekcja',
      description: 'Sekcja, do której należy temat.',
      collection: 'sekcjeBazyWiedzy',
      validation: { isRequired: true },
    }),
    order: orderField('Kolejność tematu', 'Im mniejsza liczba, tym wcześniej temat pojawia się na stronie sekcji.'),
    summary: fields.text({
      label: 'Krótki opis',
      description: 'Widoczny na kafelku tematu i pod nagłówkiem strony tematu.',
      multiline: true,
    }),
  },
});

export const edukacja = collection({
  label: 'Artykuły',
  slugField: 'title',
  path: 'src/content/edukacja/*',
  format: { contentField: 'content' },
  entryLayout: 'content',
  columns: ['title', 'section', 'topic', 'status', 'order'],
  schema: {
    title: slugTitle(
      'Tytuł',
      'Identyfikator jest częścią adresu artykułu. Zmiana zmienia link do artykułu.'
    ),
    section: fields.relationship({
      label: 'Sekcja',
      description: 'Sekcja Bazy wiedzy, w której ma się pojawić artykuł.',
      collection: 'sekcjeBazyWiedzy',
      validation: { isRequired: true },
    }),
    topic: fields.relationship({
      label: 'Temat (opcjonalnie)',
      description:
        'Tylko dla sekcji z tematami, np. Zdrowie według układów. Dla pozostałych sekcji pozostaw puste.',
      collection: 'tematyBazyWiedzy',
    }),
    order: orderField('Kolejność', 'Im mniejsza liczba, tym wyżej artykuł w sekcji lub temacie.'),
    status: fields.select({
      label: 'Status',
      description:
        'Szkic jest widoczny w panelu i na liście sekcji jako „Wkrótce”, ale nie ma własnej strony, nie trafia do wyszukiwarki ani sitemapy.',
      options: [
        { label: 'Opublikowany', value: 'published' },
        { label: 'Szkic', value: 'draft' },
      ],
      defaultValue: 'published',
    }),
    author: authorField('Donat Cupiał', 'Podpis widoczny pod tytułem artykułu.'),
    teaser: fields.text({
      label: 'Zajawka',
      description: 'Krótki opis widoczny na karcie artykułu i pod tytułem.',
      multiline: true,
    }),
    content: fields.mdx({
      label: 'Treść',
    }),
  },
});
