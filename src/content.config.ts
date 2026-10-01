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

export const collections = { edukacja, przepisy };
