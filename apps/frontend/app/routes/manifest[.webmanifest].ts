/* eslint-disable import/prefer-default-export, implicit-arrow-linebreak */

import type { WebAppManifest } from '@remix-pwa/dev';
import { json } from '@remix-run/node';

export const loader = () =>
  json(
    {
      name: 'Apple Music to Musixmatch Link',
      short_name: 'AM to MxM',
      icons: [
        {
          src: '/pwa/icons/maskable_icon_48x48.png',
          sizes: '48x48',
          type: 'image/png',
        },
        {
          src: '/pwa/icons/maskable_icon_72x72.png',
          sizes: '48x48',
          type: 'image/png',
        },
        {
          src: '/pwa/icons/maskable_icon_128x128.png',
          sizes: '128x128',
          type: 'image/png',
          purpose: 'apple touch icon',
        },
        {
          src: '/pwa/icons/maskable_icon_192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: '/pwa/icons/maskable_icon_512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
      start_url: '/',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: '#f5f5f5',
    } as WebAppManifest,
    {
      headers: {
        'Cache-Control': 'public, max-age=600',
        'Content-Type': 'application/manifest+json',
      },
    },
  );
