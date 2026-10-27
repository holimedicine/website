import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'holimedicine/website',
  },
  ui: {
    brand: { name: 'Holimedicine' },
    navigation: {
      'Strona główna': ['about', 'podejscie', 'zakres'],
      Moduły: ['edukacja', 'przepisy'],
    },
  },
  singletons: {
    about: singleton({
      label: 'O nas',
      path: 'src/content/about/',
      format: { contentField: 'mission' },
      entryLayout: 'content',
      schema: {
        eyebrow: fields.text({
          label: 'Nadtytuł',
          defaultValue: 'O nas',
        }),
        heading: fields.text({
          label: 'Nagłówek',
          defaultValue: 'Dwoje lekarzy, jedna misja',
        }),
        mission: fields.mdx({
          label: 'Misja',
        }),
        photo: fields.image({
          label: 'Zdjęcie pary',
          directory: 'public/images',
          publicPath: '/images/',
        }),
        photoAlt: fields.text({
          label: 'Opis zdjęcia (alt)',
        }),
        profiles: fields.array(
          fields.object({
            name: fields.text({
              label: 'Imię i nazwisko',
              validation: { isRequired: true },
            }),
            role: fields.text({
              label: 'Rola',
            }),
            bio: fields.text({
              label: 'Biogram',
              multiline: true,
            }),
          }),
          {
            label: 'Profile',
            itemLabel: (props) => props.fields.name.value,
          }
        ),
      },
    }),
    podejscie: singleton({
      label: 'Podejście',
      path: 'src/content/podejscie/',
      format: { contentField: 'intro' },
      entryLayout: 'content',
      schema: {
        eyebrow: fields.text({
          label: 'Nadtytuł',
          defaultValue: 'Filozofia pracy',
        }),
        heading: fields.text({
          label: 'Nagłówek',
          defaultValue: 'Trzy filary, jedna osoba',
        }),
        intro: fields.mdx({
          label: 'Wstęp',
        }),
        pillars: fields.array(
          fields.object({
            title: fields.text({
              label: 'Tytuł',
              validation: { isRequired: true },
            }),
            body: fields.text({
              label: 'Opis',
              multiline: true,
            }),
          }),
          {
            label: 'Filary',
            itemLabel: (props) => props.fields.title.value,
          }
        ),
      },
    }),
    zakres: singleton({
      label: 'Zakres opieki',
      path: 'src/content/zakres/',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({
          label: 'Nadtytuł',
          defaultValue: 'Zakres opieki',
        }),
        heading: fields.text({
          label: 'Nagłówek',
          defaultValue: 'W czym możemy pomóc',
        }),
        items: fields.array(
          fields.object({
            title: fields.text({
              label: 'Tytuł',
              validation: { isRequired: true },
            }),
            body: fields.text({
              label: 'Opis',
              multiline: true,
            }),
          }),
          {
            label: 'Usługi',
            itemLabel: (props) => props.fields.title.value,
          }
        ),
      },
    }),
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
