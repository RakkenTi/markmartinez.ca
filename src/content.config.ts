import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.string(),
    platform: z.string(),
    language: z.string(),
    role: z.string(),
    status: z.enum(['live', 'in progress', 'archived']),
    order: z.number(),
    source: z.url().optional(),
    play: z.url().optional(),
    shots: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
          size: z.enum(['sm', 'lg', 'full', 'half']).optional(),
        })
      )
      .default([]),
  }),
});

export const collections = { work };
