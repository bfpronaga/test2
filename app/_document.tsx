import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                {/* PWA Meta Tags */}
                <meta name="application-name" content="Next.js PWA App" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="PWA App" />
                <meta name="description" content="A Next.js Progressive Web App with OneSignal notifications" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="msapplication-config" content="/browserconfig.xml" />
                <meta name="msapplication-TileColor" content="#000000" />
                <meta name="msapplication-tap-highlight" content="no" />
                <meta name="theme-color" content="#000000" />

                {/* PWA Manifest */}
                <link rel="manifest" href="/manifest.json" />

                {/* Apple Touch Icons */}
                <link rel="apple-touch-icon" href="/icon-192x192.svg" />
                <link rel="apple-touch-icon" sizes="152x152" href="/icon-192x192.svg" />
                <link rel="apple-touch-icon" sizes="180x180" href="/icon-192x192.svg" />
                <link rel="apple-touch-icon" sizes="167x167" href="/icon-192x192.svg" />

                {/* Favicon */}
                <link rel="icon" type="image/svg+xml" href="/icon-192x192.svg" />
                <link rel="mask-icon" href="/icon-192x192.svg" color="#000000" />
                <link rel="shortcut icon" href="/favicon.ico" />

                {/* Service Worker Registration */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
                    }}
                />
            </Head>
            <body className="antialiased">
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
