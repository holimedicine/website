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
      Współpraca: ['wspolpraca', 'professions'],
      Moduły: ['edukacja', 'przepisy', 'kategoriePrzepisow', 'produkty', 'sekcjeProduktow'],
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
        visitQuestion: fields.text({
          label: 'Pytanie o przebieg wizyty',
          defaultValue: 'Jak wygląda wizyta?',
        }),
        visitAnswer: fields.text({
          label: 'Odpowiedź o przebiegu wizyty',
          multiline: true,
          defaultValue:
            'Standardowa wizyta trwa około 45 minut. W tym czasie z pełną starannością wsłuchujemy się w Twoją historię, zbieramy dokładny wywiad lekarski i przeprowadzamy badanie fizykalne. Jeśli stan zdrowia i sytuacja tego wymagają, od razu włączamy do planu wizyty terapię manualną, dbając o to, by odnaleźć źródło problemu, a nie tylko łagodzić objawy.',
        }),
        pricingHeading: fields.text({
          label: 'Nagłówek cennika',
          defaultValue: 'Cennik',
        }),
        pricingItems: fields.array(
          fields.object({
            name: fields.text({
              label: 'Nazwa usługi',
              validation: { isRequired: true },
            }),
            price: fields.text({
              label: 'Cena',
              description: 'Możesz wpisać dowolny tekst, np. „od 250 zł”.',
              validation: { isRequired: true },
            }),
          }),
          {
            label: 'Pozycje cennika',
            description:
              'Przeciągnij, aby zmienić kolejność; dodaj lub usuń pozycję. Cennik pojawia się pod pytaniem o przebieg wizyty.',
            itemLabel: (props) => props.fields.name.value,
          }
        ),
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
    wspolpraca: singleton({
      label: 'Współpraca',
      path: 'src/content/wspolpraca/',
      format: { data: 'json' },
      schema: {
        eyebrow: fields.text({
          label: 'Nadtytuł',
          defaultValue: 'Współpraca',
        }),
        heading: fields.text({
          label: 'Nagłówek',
          defaultValue: 'Razem zrobimy więcej dla zdrowia',
        }),
        lead: fields.text({
          label: 'Wstęp',
          description: 'Krótki opis pod nagłówkiem strony.',
          multiline: true,
        }),
        areasHeading: fields.text({
          label: 'Nagłówek sekcji „Obszary współpracy”',
          defaultValue: 'Obszary współpracy - kliknij i sprawdź!',
        }),
        areas: fields.array(
          fields.object({
            title: fields.text({
              label: 'Tytuł',
              validation: { isRequired: true },
            }),
            summary: fields.text({
              label: 'Krótki opis na kafelku',
              multiline: true,
            }),
            body: fields.text({
              label: 'Pełny opis w oknie popup',
              multiline: true,
            }),
          }),
          {
            label: 'Obszary współpracy',
            description:
              'Kafelki na stronie. Przeciągnij, aby zmienić kolejność; dodaj lub usuń kafelek dowolną liczbą.',
            itemLabel: (props) => props.fields.title.value,
          }
        ),
        principlesHeading: fields.text({
          label: 'Nagłówek sekcji „Zasady”',
          defaultValue: 'Zasady, na jakich współpracujemy',
        }),
        principles: fields.array(
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
            label: 'Zasady współpracy',
            description:
              'Przeciągnij, aby zmienić kolejność; dodaj lub usuń kafelek dowolną liczbą.',
            itemLabel: (props) => props.fields.title.value,
          }
        ),
        stepsHeading: fields.text({
          label: 'Nagłówek sekcji „Jak zaczynamy”',
          defaultValue: 'Jak zaczynamy',
        }),
        steps: fields.array(
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
            label: 'Kroki',
            description:
              'Przeciągnij, aby zmienić kolejność; dodaj lub usuń kafelek dowolną liczbą.',
            itemLabel: (props) => props.fields.title.value,
          }
        ),
        contactHeading: fields.text({
          label: 'Nagłówek boxu kontaktowego',
          defaultValue: 'Masz pomysł na wspólny projekt?',
        }),
        contactLead: fields.text({
          label: 'Opis w boxie kontaktowym',
          multiline: true,
        }),
        contactDetails: fields.array(
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
            label: 'Dane kontaktowe',
            description: 'Np. e-mail, adres gabinetu. Możesz zmienić je w dowolnym momencie.',
            itemLabel: (props) => props.fields.label.value,
          }
        ),
        contactCtaLabel: fields.text({
          label: 'Etykieta przycisku',
          defaultValue: 'Napisz do nas',
        }),
        contactCtaHref: fields.text({
          label: 'Link przycisku',
          defaultValue: 'mailto:gabinet.holimedicine@gmail.com?subject=Wsp%C3%B3%C5%82praca',
        }),
        partnersCtaLabel: fields.text({
          label: 'Etykieta przycisku „Z nimi współpracujemy”',
          defaultValue: 'Z nimi współpracujemy - kliknij i sprawdź!',
        }),
        partnersEyebrow: fields.text({
          label: 'Nadtytuł strony „Z nimi współpracujemy”',
          defaultValue: 'Z nimi współpracujemy',
        }),
        partnersHeading: fields.text({
          label: 'Nagłówek strony „Z nimi współpracujemy”',
          defaultValue: 'Specjaliści, z którymi współpracujemy',
        }),
        partnersLead: fields.text({
          label: 'Wstęp strony „Z nimi współpracujemy”',
          multiline: true,
        }),
      },
    }),
  },
  collections: {
    professions: collection({
      label: 'Z nimi współpracujemy',
      slugField: 'title',
      path: 'src/content/professions/*',
      format: { data: 'json' },
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({
          name: { label: 'Nazwa zawodu', validation: { isRequired: true } },
        }),
        order: fields.integer({
          label: 'Kolejność',
          description: 'Im mniejsza liczba, tym wyżej pojawia się grupa na stronie.',
          defaultValue: 0,
        }),
        summary: fields.text({
          label: 'Krótki opis grupy',
          description: 'Widoczny pod nazwą zawodu po rozwinięciu sekcji.',
          multiline: true,
        }),
        members: fields.array(
          fields.object({
            name: fields.text({
              label: 'Imię i nazwisko',
              validation: { isRequired: true },
            }),
            role: fields.text({
              label: 'Specjalizacja / rola',
            }),
            workplace: fields.text({
              label: 'Miejsce pracy',
              multiline: true,
            }),
            photo: fields.image({
              label: 'Zdjęcie',
              directory: 'public/images/collaborators',
              publicPath: '/images/collaborators/',
            }),
            photoAlt: fields.text({
              label: 'Opis zdjęcia (alt)',
            }),
            bio: fields.text({
              label: 'Krótki opis osoby',
              multiline: true,
            }),
            link: fields.url({
              label: 'Link do profilu (opcjonalnie)',
            }),
            linkLabel: fields.text({
              label: 'Etykieta linku',
              description: 'Np. „Profil na ZnanyLekarz”.',
            }),
          }),
          {
            label: 'Osoby',
            description:
              'Przeciągnij, aby zmienić kolejność; dodaj lub usuń osobę. Bez zdjęcia wyświetli się awatar z inicjałami.',
            itemLabel: (props) => props.fields.name.value,
          }
        ),
      },
    }),
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
    produkty: collection({
      label: 'Polecane produkty',
      slugField: 'title',
      path: 'src/content/produkty/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'examples'],
      schema: {
        title: fields.slug({
          name: { label: 'Nazwa', validation: { isRequired: true } },
        }),
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
    }),
    sekcjeProduktow: collection({
      label: 'Sekcje polecanych produktów',
      slugField: 'title',
      path: 'src/content/sekcje-produktow/*',
      format: { data: 'json' },
      columns: ['title', 'order', 'display'],
      schema: {
        title: fields.slug({
          name: { label: 'Nagłówek sekcji', validation: { isRequired: true } },
        }),
        description: fields.text({
          label: 'Wstęp',
          description: 'Opcjonalny tekst pod nagłówkiem sekcji.',
          multiline: true,
        }),
        order: fields.integer({
          label: 'Kolejność',
          description: 'Im mniejsza liczba, tym wcześniej pojawia się sekcja.',
          defaultValue: 0,
        }),
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
    }),
  },
});
