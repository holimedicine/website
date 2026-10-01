import { config, fields, collection } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'holimedicine/website',
  },
  ui: {
    brand: { name: 'Holimedicine' },
    navigation: {
      Moduły: ['edukacja', 'przepisy'],
    },
  },
  collections: {
    edukacja: collection({
      label: 'Edukacja',
      slugField: 'title',
      path: 'src/content/edukacja/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({
          name: { label: 'Tytuł', validation: { isRequired: true } },
        }),
        teaser: fields.text({
          label: 'Zajawka',
          description: 'Krótki opis widoczny pod tytułem na liście.',
          multiline: true,
        }),
        order: fields.integer({
          label: 'Kolejność',
          description: 'Im mniejsza liczba, tym wyżej na liście.',
          defaultValue: 0,
        }),
        content: fields.mdx({
          label: 'Treść',
        }),
      },
    }),
    przepisy: collection({
      label: 'Przepisy',
      slugField: 'title',
      path: 'src/content/przepisy/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'category', 'order'],
      schema: {
        title: fields.slug({
          name: { label: 'Tytuł', validation: { isRequired: true } },
        }),
        category: fields.select({
          label: 'Kategoria',
          options: [
            { label: 'Na wynos', value: 'na-wynos' },
            { label: 'Dania', value: 'dania' },
          ],
          defaultValue: 'dania',
        }),
        tag: fields.text({
          label: 'Tag',
          description: 'np. „Na wynos · niskowęglowodanowe”',
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
        order: fields.integer({
          label: 'Kolejność',
          defaultValue: 0,
        }),
        content: fields.mdx({
          label: 'Pełny przepis (opcjonalnie)',
        }),
      },
    }),
  },
});
