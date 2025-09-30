import { OneSignalInitial } from "@/lib/OneSignalInitial";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icon-192x192.png"></link>
                <meta name="theme-color" content="#f69435" />
            </head>
            <body>
                <OneSignalInitial />
                {children}
            </body>
        </html>
    );
}
