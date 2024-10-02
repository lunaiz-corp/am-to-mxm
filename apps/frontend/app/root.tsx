import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from '@remix-run/react';
import { ManifestLink } from '@remix-pwa/sw';

import 'normalize.css';
import '~/styles/tailwind.css';

import MainSearchArea from '~/components/MainSearchArea';
import Footer from '~/components/Footer';

import { routes } from '~/types/search';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <Meta />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />

        <meta name="application-name" content="AM to MxM" />
        <meta name="apple-mobile-web-app-title" content="AM to MxM" />

        <meta name="theme-color" content="#f5f5f5" />
        <meta name="msapplication-navbutton-color" content="#fd5e6e" />
        <meta name="msapplication-starturl" content="/" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />

        <Links />
        <ManifestLink />

        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link
          rel="apple-touch-icon"
          sizes="128x128"
          href="/pwa/icons/maskable_icon_128x128.png"
        />

        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=arrow_right_alt,search&display=block"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap"
        />

        {/* Google Tag Manager */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PDKX2QV5');
          `,
          }}
        />
        {/* End Google Tag Manager */}
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            title="Google Tag Manager"
            src="https://www.googletagmanager.com/ns.html?id=GTM-PDKX2QV5"
            height="0"
            width="0"
            style={{
              display: 'none',
              visibility: 'hidden',
            }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}

        <div className="flex flex-col lg:min-h-screen lg:flex-row">
          {Object.keys(routes).includes(location.pathname) && (
            <MainSearchArea
              searchType={routes[location.pathname as keyof typeof routes]}
            />
          )}

          {children}

          {Object.keys(routes).includes(location.pathname) && (
            <div className="flex flex-col items-center gap-6 pb-12 lg:hidden">
              <Footer
                searchType={routes[location.pathname as keyof typeof routes]}
              />
            </div>
          )}
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}
