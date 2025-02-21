import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vitest/config';
import denoSveltekitExit from './.vite/deno-sveltekit-exit.ts';
import { Environment } from './src/lib/api.ts';
import { manifest } from './src/lib/pwa/manifest.ts';

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

function findGitRoot(dir: string): string {
  if (fs.existsSync(path.join(dir, '.git'))) {
    return dir;
  }

  const parentDir = path.resolve(dir, '..');

  if (parentDir === dir) {
    throw new Error('Git root directory not found!');
  }

  return findGitRoot(parentDir);
}

const MONOREPO_ROOT = findGitRoot(__dirname);

const TRAKT_TARGET_ENVIRONMENT = process.env.IS_CONTRIB
  ? Environment.staging
  : Environment.staging_private;

export default defineConfig(({ mode }) => ({
  define: {
    'TRAKT_CLIENT_ID': `"${process.env.TRAKT_CLIENT_ID}"`,
    'TRAKT_MODE': `"${mode}${process.env.IS_PREVIEW ? '-preview' : ''}"`,
    'TRAKT_TARGET_ENVIRONMENT': `"${TRAKT_TARGET_ENVIRONMENT}"`,
    'TRAKT_POST_HOG_TOKEN': `"${process.env.TRAKT_POST_HOG_TOKEN}"`,
    'FIREBASE_PROJECT_ID': `"${process.env.FIREBASE_PROJECT_ID}"`,
    'FIREBASE_API_KEY': `"${process.env.FIREBASE_API_KEY}"`,
    'FIREBASE_APP_ID': `"${process.env.FIREBASE_APP_ID}"`,
    'FIREBASE_MEASUREMENT_ID': `"${process.env.FIREBASE_MEASUREMENT_ID}"`,
    'FIREBASE_MESSAGING_SENDER_ID':
      `"${process.env.FIREBASE_MESSAGING_SENDER_ID}"`,
  },

  server: {
    fs: {
      allow: [MONOREPO_ROOT],
    },
    proxy: {
      '/api/trakt': {
        target: TRAKT_TARGET_ENVIRONMENT,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/trakt/, ''),
      },
    },
  },

  plugins: [
    sveltekit(),
    paraglide({
      project: './i18n/project.inlang',
      outdir: './src/lib/paraglide',
    }),
    denoSveltekitExit(),
    svelteTesting(),
    enhancedImages(),
    SvelteKitPWA({
      injectRegister: 'script-defer',
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'service-worker.ts',
      manifest,
      manifestFilename: 'manifest.webmanifest',
      injectManifest: {
        injectionPoint: 'self.__WB_MANIFEST',
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
  //TODO enable globals when typings are fixed
  test: {
    include: [
      'src/**/*.{test,spec}.{js,ts}',
      '.scripts/**/*.{test,spec}.{js,ts}',
    ],
    environment: 'jsdom',
    setupFiles: ['./vitest-setup.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['clover', 'lcov'],
    },
    reporters: process.env.GITHUB_ACTIONS ? ['dot', 'github-actions'] : ['dot'],
  },

  resolve: process.env.VITEST
    ? {
      conditions: ['browser'],
    }
    : undefined,
}));
