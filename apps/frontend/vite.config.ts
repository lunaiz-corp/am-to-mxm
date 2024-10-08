import { vitePlugin as remix } from '@remix-run/dev';
import { defineConfig } from 'vite';

import { remixPWA } from '@remix-pwa/dev';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix({
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    remixPWA(),
    svgr(),
    tsconfigPaths(),
  ],
});
