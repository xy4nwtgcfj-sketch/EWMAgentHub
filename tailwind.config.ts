import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base: '#0a0f1e',
          raised: '#111827',
          overlay: '#1a2235',
          border: '#1e2d45',
        },
      },
      typography: {
        invert: {
          css: {
            '--tw-prose-body': '#cbd5e1',
            '--tw-prose-headings': '#f1f5f9',
            '--tw-prose-lead': '#94a3b8',
            '--tw-prose-links': '#60a5fa',
            '--tw-prose-bold': '#f1f5f9',
            '--tw-prose-counters': '#94a3b8',
            '--tw-prose-bullets': '#475569',
            '--tw-prose-hr': '#1e2d45',
            '--tw-prose-quotes': '#e2e8f0',
            '--tw-prose-quote-borders': '#334155',
            '--tw-prose-captions': '#94a3b8',
            '--tw-prose-code': '#93c5fd',
            '--tw-prose-pre-code': '#cbd5e1',
            '--tw-prose-pre-bg': '#0f172a',
            '--tw-prose-th-borders': '#1e2d45',
            '--tw-prose-td-borders': '#1e2d45',
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
