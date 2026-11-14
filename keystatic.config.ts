import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'github',
    repo: 'holimedicine/website',
  },
  ui: {
    brand: { name: 'Holimedicine' },
    navigation: {
      'Strona główna': ['about', 'podejscie', 'zakres', 'contact'],
      Moduły: ['edukacja', 'przepisy', 'kategoriePrzepisow'],
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
    contact: singleton({
      label: 'Kontakt',
      path: 'src/content/contact/',
      format: { data: 'json' },
      schema: {
        heading: fields.text({
          label: 'Nagłówek',
          defaultValue: 'Porozmawiajmy o Twoim zdrowiu',
        }),
        lead: fields.text({
          label: 'Opis',
          multiline: true,
          defaultValue:
            'Umów wizytę w gabinecie lub napisz, jeśli chcesz najpierw zapytać, czy możemy pomóc.',
        }),
        phone: fields.text({
          label: 'Telefon',
          defaultValue: '+48 000 000 000',
        }),
        email: fields.text({
          label: 'E-mail',
          defaultValue: 'dscupial@gmail.com',
        }),
        address: fields.text({
          label: 'Adres gabinetu',
          multiline: true,
          defaultValue: 'ul. Paderewskiego 25, 42-400 Zawiercie',
        }),
        primaryCtaLabel: fields.text({
          label: 'Etykieta przycisku e-mail',
          defaultValue: 'Napisz e-mail',
        }),
        primaryCtaHref: fields.text({
          label: 'Link przycisku e-mail',
          defaultValue: 'mailto:kontakt@holimedicine.eu.org',
        }),
        secondaryCtaLabel: fields.text({
          label: 'Etykieta przycisku telefonu',
          defaultValue: 'Zadzwoń',
        }),
        secondaryCtaHref: fields.text({
          label: 'Link przycisku telefonu',
          defaultValue: 'tel:+48000000000',
        }),
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
    kategoriePrzepisow: collection({
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
        order: fields.integer({
          label: 'Kolejność',
          description: 'Im mniejsza liczba, tym wcześniej pojawia się zakładka.',
          defaultValue: 0,
        }),
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
    }),
    przepisy: collection({
      label: 'Przepisy',
      slugField: 'title',
      path: 'src/content/przepisy/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'tag'],
      schema: {
        title: fields.slug({
          name: { label: 'Tytuł', validation: { isRequired: true } },
        }),
        tag: fields.text({
          label: 'Tag',
          description: 'np. „niskowęglowodanowe”',
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
    }),
  },
});
