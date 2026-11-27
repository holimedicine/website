import { collection, fields, singleton } from '@keystatic/core';
import { eyebrowField, headingField, orderField, slugTitle } from './fields';

export const wspolpraca = singleton({
  label: 'Współpraca',
  path: 'src/content/wspolpraca/',
  format: { data: 'json' },
  schema: {
    eyebrow: eyebrowField('Współpraca'),
    heading: headingField('Razem zrobimy więcej dla zdrowia'),
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
});

export const professions = collection({
  label: 'Z nimi współpracujemy',
  slugField: 'title',
  path: 'src/content/professions/*',
  format: { data: 'json' },
  columns: ['title', 'order'],
  schema: {
    title: slugTitle('Nazwa zawodu'),
    order: orderField('Kolejność', 'Im mniejsza liczba, tym wyżej pojawia się grupa na stronie.'),
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
});
