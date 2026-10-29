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

const przepisy = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/przepisy' }),
  schema: z.object({
    title: z.string(),
    category: z.enum(['na-wynos', 'dania']).default('dania'),
    tag: z.string().optional(),
    summary: z.string().optional(),
    coverImage: z.string().optional(),
    alt: z.string().optional(),
    order: z.number().default(0),
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

const contact = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/contact' }),
  schema: z.object({
    heading: z.string().default('Porozmawiajmy o Twoim zdrowiu'),
    lead: z
      .string()
      .default('Umów wizytę w gabinecie lub napisz, jeśli chcesz najpierw zapytać, czy możemy pomóc.'),
    phone: z.string().default('+48 000 000 000'),
    email: z.string().default('dscupial@gmail.com'),
    address: z.string().default('ul. Paderewskiego 25, 42-400 Zawiercie'),
    primaryCtaLabel: z.string().default('Napisz e-mail'),
    primaryCtaHref: z.string().default('mailto:kontakt@holimedicine.eu.org'),
    secondaryCtaLabel: z.string().default('Zadzwoń'),
    secondaryCtaHref: z.string().default('tel:+48000000000'),
  }),
});

export const collections = { edukacja, przepisy, about, podejscie, zakres, contact };
