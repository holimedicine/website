import { collection, fields, singleton } from '@keystatic/core';
import { authorField, eyebrowField, headingField, orderField, slugTitle } from './fields';

export const produktyPage = singleton({
  label: 'Strona suplementów',
  path: 'src/content/produkty-page/',
  format: { data: 'json' },
  schema: {
    eyebrow: eyebrowField('Suplementy i probiotyki – co mówią badania'),
    heading: headingField('Suplementy i probiotyki – co mówią badania'),
    lead: fields.text({
      label: 'Wstęp w nagłówku (opcjonalnie)',
      description: 'Krótki tekst pod nagłówkiem strony. Pozostaw puste, aby go ukryć.',
      multiline: true,
    }),
    intro: fields.text({
      label: 'Wstęp w ramce',
      description:
        'Tekst w ramce pod nagłówkiem. Zdanie z linkiem do zakładki „Współpraca” dodawane jest automatycznie.',
      multiline: true,
      validation: { isRequired: true },
    }),
  },
});

export const produkty = collection({
  label: 'Suplementy i składniki',
  slugField: 'title',
  path: 'src/content/produkty/*',
  format: { contentField: 'content' },
  entryLayout: 'content',
  columns: ['title', 'author', 'examples'],
  schema: {
    title: slugTitle('Nazwa'),
    author: authorField('Donat Cupiał', 'Podpis widoczny pod tytułem w szczegółach produktu.'),
    examples: fields.text({
      label: 'Przykładowe preparaty',
      description: 'Krótka lista preparatów lub dawek widoczna na kafelku.',
    }),
    summary: fields.text({
      label: 'Krótki opis',
      description: 'Opis widoczny na kafelku.',
      multiline: true,
    }),
    image: fields.image({
      label: 'Zdjęcie, grafika lub ikona (opcjonalnie)',
      directory: 'public/images/produkty',
      publicPath: '/images/produkty/',
    }),
    imageAlt: fields.text({
      label: 'Opis zdjęcia (alt)',
    }),
    link: fields.url({
      label: 'Link do sklepu lub źródła (opcjonalnie)',
    }),
    linkLabel: fields.text({
      label: 'Etykieta linku',
      defaultValue: 'Zobacz produkt',
    }),
    details: fields.array(
      fields.object({
        label: fields.text({
          label: 'Etykieta',
          validation: { isRequired: true },
        }),
        value: fields.text({
          label: 'Wartość',
          multiline: true,
        }),
      }),
      {
        label: 'Dodatkowe informacje',
        description: 'Np. dawka, sposób przyjmowania, czas kuracji.',
        itemLabel: (props) => props.fields.label.value,
      }
    ),
    content: fields.mdx({
      label: 'Pełny opis',
    }),
  },
});

export const sekcjeProduktow = collection({
  label: 'Sekcje suplementów',
  slugField: 'title',
  path: 'src/content/sekcje-produktow/*',
  format: { data: 'json' },
  columns: ['title', 'order', 'display'],
  schema: {
    title: slugTitle('Nagłówek sekcji'),
    description: fields.text({
      label: 'Wstęp',
      description: 'Opcjonalny tekst pod nagłówkiem sekcji.',
      multiline: true,
    }),
    order: orderField('Kolejność sekcji', 'Im mniejsza liczba, tym wcześniej pojawia się sekcja.'),
    display: fields.select({
      label: 'Wygląd',
      options: [
        { label: 'Kafelki', value: 'cards' },
        { label: 'Tabela', value: 'table' },
      ],
      defaultValue: 'cards',
    }),
    items: fields.array(
      fields.relationship({
        label: 'Produkt',
        collection: 'produkty',
        validation: { isRequired: true },
      }),
      {
        label: 'Kafelki',
        description:
          'Kolejność na stronie. Przeciągnij, aby zmienić kolejność; lista pokazuje slugi produktów. Wypełnij dla sekcji typu „Kafelki”.',
        itemLabel: (props) => props.value ?? 'Wybierz produkt',
      }
    ),
    columns: fields.array(fields.text({ label: 'Kolumna' }), {
      label: 'Kolumny tabeli',
      description: 'Nagłówki kolumn w kolejności. Wypełnij dla sekcji typu „Tabela”.',
      itemLabel: (props) => props.value ?? 'Kolumna',
    }),
    rows: fields.array(
      fields.object({
        cells: fields.array(fields.text({ label: 'Wartość' }), {
          label: 'Komórki',
          description: 'Wartości w kolejności kolumn.',
        }),
      }),
      {
        label: 'Wiersze tabeli',
        description: 'Wypełnij dla sekcji typu „Tabela”.',
        itemLabel: (props) => props.fields.cells.elements[0]?.value ?? 'Wiersz',
      }
    ),
  },
});
