import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const edukacja = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/edukacja' }),
  schema: z.object({
    title: z.string(),
    teaser: z.string().optional(),
    order: z.number().default(0),
  }),
});

const kategoriePrzepisow = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/kategorie-przepisow' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    recipes: z.array(z.string()).default([]),
  }),
});

const przepisy = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/przepisy' }),
  schema: z.object({
    title: z.string(),
    tag: z.string().optional(),
    summary: z.string().optional(),
    coverImage: z.string().optional(),
    alt: z.string().optional(),
  }),
});

const produkty = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/produkty' }),
  schema: z.object({
    title: z.string(),
    examples: z.string().optional(),
    summary: z.string().optional(),
    image: z.string().nullish(),
    imageAlt: z.string().optional(),
    link: z.string().nullish(),
    linkLabel: z.string().default('Zobacz produkt'),
    details: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .default([]),
  }),
});

const sekcjeProduktow = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/sekcje-produktow' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().default(0),
    display: z.enum(['cards', 'table']).default('cards'),
    items: z.array(z.string()).default([]),
    columns: z.array(z.string()).default([]),
    rows: z
      .array(
        z.object({
          cells: z.array(z.string()).default([]),
        })
      )
      .default([]),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/about' }),
  schema: z.object({
    eyebrow: z.string().default('O nas'),
    heading: z.string(),
    photo: z.string().optional(),
    photoAlt: z.string().optional(),
    profiles: z
      .array(
        z.object({
          name: z.string(),
          role: z.string(),
          bio: z.string(),
        })
      )
      .default([]),
  }),
});

const podejscie = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/podejscie' }),
  schema: z.object({
    eyebrow: z.string().default('Filozofia pracy'),
    heading: z.string(),
    pillars: z
      .array(
        z.object({
          title: z.string(),
          body: z.string(),
        })
      )
      .default([]),
  }),
});

const zakres = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/zakres' }),
  schema: z.object({
    eyebrow: z.string().default('Zakres opieki'),
    heading: z.string().default('W czym możemy pomóc'),
    items: z
      .array(
        z.object({
          title: z.string(),
          body: z.string(),
        })
      )
      .default([]),
  }),
});

const wspolpraca = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/wspolpraca' }),
  schema: z.object({
    eyebrow: z.string().default('Współpraca'),
    heading: z.string().default('Razem zrobimy więcej dla zdrowia'),
    lead: z.string().default(''),
    areasHeading: z.string().default('Obszary współpracy'),
    areas: z
      .array(
        z.object({
          title: z.string(),
          summary: z.string().default(''),
          body: z.string(),
        })
      )
      .default([]),
    principlesHeading: z.string().default('Zasady, na jakich współpracujemy'),
    principles: z
      .array(
        z.object({
          title: z.string(),
          body: z.string(),
        })
      )
      .default([]),
    stepsHeading: z.string().default('Jak zaczynamy'),
    steps: z
      .array(
        z.object({
          title: z.string(),
          body: z.string(),
        })
      )
      .default([]),
    contactHeading: z.string().default('Masz pomysł na wspólny projekt?'),
    contactLead: z.string().default(''),
    contactDetails: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      )
      .default([]),
    contactCtaLabel: z.string().default('Napisz do nas'),
    contactCtaHref: z.string().default('mailto:gabinet.holimedicine@gmail.com'),
    partnersCtaLabel: z.string().default('Z nimi współpracujemy - kliknij i sprawdź!'),
    partnersEyebrow: z.string().default('Z nimi współpracujemy'),
    partnersHeading: z.string().default('Specjaliści, z którymi współpracujemy'),
    partnersLead: z.string().default(''),
  }),
});

const professions = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/professions' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(0),
    summary: z.string().optional(),
    members: z
      .array(
        z.object({
          name: z.string(),
          role: z.string().optional(),
          workplace: z.string().optional(),
          photo: z.string().nullish(),
          photoAlt: z.string().optional(),
          bio: z.string().optional(),
          link: z.string().nullish(),
          linkLabel: z.string().optional(),
        })
      )
      .default([]),
  }),
});

const contact = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/contact' }),
  schema: z.object({
    heading: z.string().default('Porozmawiajmy o Twoim zdrowiu'),
    lead: z
      .string()
      .default('Umów wizytę w gabinecie lub napisz, jeśli chcesz najpierw zapytać, czy możemy pomóc.'),
    visitQuestion: z.string().default('Jak wygląda wizyta?'),
    visitAnswer: z
      .string()
      .default(
        'Standardowa wizyta trwa około 45 minut. W tym czasie z pełną starannością wsłuchujemy się w Twoją historię, zbieramy dokładny wywiad lekarski i przeprowadzamy badanie fizykalne. Jeśli stan zdrowia i sytuacja tego wymagają, od razu włączamy do planu wizyty terapię manualną, dbając o to, by odnaleźć źródło problemu, a nie tylko łagodzić objawy.'
      ),
    pricingHeading: z.string().default('Cennik'),
    pricingItems: z
      .array(
        z.object({
          name: z.string(),
          price: z.string(),
        })
      )
      .default([]),
    phone: z.string().default('+48 000 000 000'),
    email: z.string().default('dscupial@gmail.com'),
    address: z.string().default('ul. Paderewskiego 25, 42-400 Zawiercie'),
    primaryCtaLabel: z.string().default('Napisz e-mail'),
    primaryCtaHref: z.string().default('mailto:kontakt@holimedicine.eu.org'),
    secondaryCtaLabel: z.string().default('Zadzwoń'),
    secondaryCtaHref: z.string().default('tel:+48000000000'),
  }),
});

export const collections = {
  edukacja,
  kategoriePrzepisow,
  przepisy,
  produkty,
  sekcjeProduktow,
  about,
  podejscie,
  zakres,
  wspolpraca,
  professions,
  contact,
};
