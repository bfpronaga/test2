"use client";
import { OneSignalInitial } from "@/lib/OneSignalInitial";
import { useEffect } from "react";
import OneSignal from "react-onesignal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const oneSignalInit = async () => {
            await OneSignal.init({
                appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "",
            }).then(() => {
                OneSignal.Slidedown.promptPush();
            });
        };
        oneSignalInit();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    return (
        <html lang="en">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icon-192x192.png"></link>
                <meta name="theme-color" content="#f69435" />
            </head>
            <body>{children}</body>
        </html>
    );
}
