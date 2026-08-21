import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const image = z.object({
  src: z.string(),
  alt: z.string(),
});

const hero = z.object({
  alt: z.string(),
  frames: z.array(z.string()).min(1).max(4),
  video: z.string().optional(),
  poster: z.string().optional(),
  note: z.string().optional(),
  fit: z.enum(['cover', 'contain']).default('cover'),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.string(),
    platform: z.string(),
    language: z.string(),
    role: z.string().optional(),
    status: z.enum(['live', 'in progress', 'archived']),
    order: z.number(),
    stat: z.string().optional(),
    layout: z.enum(['game', 'engine', 'app']).default('app'),
    highlights: z
      .array(z.object({ value: z.string(), label: z.string() }))
      .default([]),
    hero,
    sections: z
      .array(z.enum(['shots', 'funnel', 'metrics', 'writeup']))
      .default(['shots', 'funnel']),
    gallery: z.enum(['grid', 'marquee']).default('grid'),
    writeup: z
      .object({
        title: z.string().optional(),
        cta: z.string().optional(),
      })
      .optional(),
    funnel: z
      .object({
        heading: z.string(),
        note: z.string().optional(),
        steps: z
          .array(z.object({ label: z.string(), count: z.number() }))
          .min(2),
      })
      .optional(),
    metrics: z
      .object({
        heading: z.string(),
        note: z.string().optional(),
        fpsFloor: z.number().default(60),
        columns: z.array(z.string()).min(1),
        machines: z
          .array(
            z.object({
              name: z.string(),
              score: z.string().optional(),
              system: z
                .array(z.object({ label: z.string(), value: z.string() }))
                .default([]),
              rows: z
                .array(
                  z.object({
                    label: z.string(),
                    tag: z.string().optional(),
                    values: z.array(z.string()),
                  })
                )
                .min(1),
            })
          )
          .min(1),
      })
      .superRefine((metrics, ctx) => {
        for (const machine of metrics.machines) {
          for (const row of machine.rows) {
            if (row.values.length === metrics.columns.length) continue;
            ctx.addIssue({
              code: 'custom',
              message: `${machine.name} row "${row.label}" has ${row.values.length} values but there are ${metrics.columns.length} columns`,
            });
          }
        }
      })
      .optional(),
    source: z.url().optional(),
    play: z.url().optional(),
    playdemo: z.url().optional(),
    shots: z
      .array(
        image.extend({
          caption: z.string().optional(),
        })
      )
      .default([]),
  }),
});

export const collections = { projects };
