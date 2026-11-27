import { collection, fields } from '@keystatic/core';
import { authorField, orderField, slugTitle } from './fields';

export const przepisy = collection({
  label: 'Przepisy',
  slugField: 'title',
  path: 'src/content/przepisy/*',
  format: { contentField: 'content' },
  entryLayout: 'content',
  columns: ['title', 'author', 'tag'],
  schema: {
    title: slugTitle('Tytuł'),
    author: authorField('Natalia Cupiał', 'Podpis widoczny pod tytułem w oknie przepisu.'),
    tag: fields.text({
      label: 'Tag',
      description: 'Np. „niskowęglowodanowe”.',
    }),
    summary: fields.text({
      label: 'Krótki opis',
      description: 'Opis widoczny na karcie przepisu.',
      multiline: true,
    }),
    coverImage: fields.image({
      label: 'Zdjęcie',
      directory: 'public/images/przepisy',
      publicPath: '/images/przepisy/',
    }),
    alt: fields.text({
      label: 'Opis zdjęcia (alt)',
    }),
    content: fields.mdx({
      label: 'Pełny przepis (opcjonalnie)',
    }),
  },
});

export const kategoriePrzepisow = collection({
  label: 'Kategorie przepisów',
  slugField: 'title',
  path: 'src/content/kategorie-przepisow/*',
  format: { data: 'json' },
  columns: ['title', 'order'],
  schema: {
    title: fields.slug({
      name: { label: 'Nazwa', validation: { isRequired: true } },
      slug: {
        label: 'Identyfikator (slug)',
        validation: {
          pattern: {
            regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
            message: 'Używaj małych liter, cyfr i myślników.',
          },
        },
      },
    }),
    order: orderField('Kolejność zakładki', 'Im mniejsza liczba, tym wcześniej pojawia się zakładka.'),
    recipes: fields.array(
      fields.relationship({
        label: 'Przepis',
        collection: 'przepisy',
        validation: { isRequired: true },
      }),
      {
        label: 'Przepisy',
        description:
          'Kolejność na stronie. Przeciągnij, aby zmienić kolejność; lista pokazuje slugi przepisów.',
        itemLabel: (props) => props.value ?? 'Wybierz przepis',
      }
    ),
  },
});
