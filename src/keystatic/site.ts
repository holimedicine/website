import { fields, singleton } from '@keystatic/core';
import { eyebrowField, headingField } from './fields';

export const about = singleton({
  label: 'O nas',
  path: 'src/content/about/',
  format: { contentField: 'mission' },
  entryLayout: 'content',
  schema: {
    eyebrow: eyebrowField('O nas'),
    heading: headingField('Dwoje lekarzy, jedna misja'),
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
        photo: fields.image({
          label: 'Zdjęcie profilowe',
          description: 'Portret widoczny w popupie, między nazwiskiem a biogramem.',
          directory: 'public/images/o-nas',
          publicPath: '/images/o-nas/',
        }),
        photoAlt: fields.text({
          label: 'Opis zdjęcia profilowego (alt)',
        }),
        bio: fields.text({
          label: 'Biogram',
          multiline: true,
        }),
        gallery: fields.array(
          fields.object({
            image: fields.image({
              label: 'Grafika',
              description: 'Zdjęcie lub skan dokumentu widoczny w popupie profilu.',
              directory: 'public/images/o-nas',
              publicPath: '/images/o-nas/',
              validation: { isRequired: true },
            }),
            alt: fields.text({
              label: 'Opis grafiki (alt)',
            }),
            caption: fields.text({
              label: 'Podpis',
              multiline: true,
            }),
            document: fields.file({
              label: 'Dokument (opcjonalnie)',
              description: 'Np. oryginał PDF otwierany z poziomu podpisu.',
              directory: 'public/dokumenty',
              publicPath: '/dokumenty/',
            }),
          }),
          {
            label: 'Grafiki i dokumenty',
            itemLabel: (props) => props.fields.caption.value || 'Grafika',
          }
        ),
      }),
      {
        label: 'Profile',
        itemLabel: (props) => props.fields.name.value,
      }
    ),
  },
});

export const podejscie = singleton({
  label: 'Podejście',
  path: 'src/content/podejscie/',
  format: { contentField: 'intro' },
  entryLayout: 'content',
  schema: {
    eyebrow: eyebrowField('Filozofia pracy'),
    heading: headingField('Trzy filary, jedna osoba'),
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
});

export const zakres = singleton({
  label: 'Zakres opieki',
  path: 'src/content/zakres/',
  format: { data: 'json' },
  schema: {
    eyebrow: eyebrowField('Zakres opieki'),
    heading: headingField('W czym możemy pomóc'),
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
});

export const contact = singleton({
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
      defaultValue: 'mailto:kontakt@holimedicine.eu',
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
});
