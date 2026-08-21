import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import solid from '@astrojs/solid-js';

const externalLinks = {
  name: 'external-links',
  element: {
    filter: ['a'],
    visit(node) {
      const href = node.properties?.href;
      if (typeof href !== 'string' || !/^https?:\/\//.test(href)) return;
      return {
        ...node,
        properties: { ...node.properties, target: '_blank', rel: 'noopener noreferrer' },
      };
    },
  },
};

const bodyFigures = {
  name: 'body-figures',
  element: {
    filter: ['p'],
    visit(node) {
      const children = node.children ?? [];
      if (children.length !== 1) return;
      const img = children[0];
      if (img.type !== 'element' || img.tagName !== 'img') return;

      const { title, ...rest } = img.properties ?? {};
      const figure = {
        type: 'element',
        tagName: 'figure',
        properties: { className: ['figure'] },
        children: [{ ...img, properties: { ...rest, loading: 'lazy' } }],
      };
      if (title) {
        figure.children.push({
          type: 'element',
          tagName: 'figcaption',
          properties: {},
          children: [{ type: 'text', value: String(title) }],
        });
      }
      return figure;
    },
  },
};

export default defineConfig({
  site: 'https://markmartinez.ca',
  integrations: [solid()],
  markdown: {
    processor: satteri({ hastPlugins: [externalLinks, bodyFigures] }),
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
});
