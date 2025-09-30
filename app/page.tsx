"use client";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { useState, useEffect } from "react";
import { useOneSignal } from "../hooks/useOneSignal";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function Home() {
    const [isOnline, setIsOnline] = useState(true);
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isInstalled, setIsInstalled] = useState(false);

    // OneSignal integration
    const { user, isInitialized, subscribe, unsubscribe } = useOneSignal(process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || "");

    useEffect(() => {
        // Check online status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        // Check if app is already installed
        if (window.matchMedia("(display-mode: standalone)").matches) {
            setIsInstalled(true);
        }

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: any) => {
            e.preventDefault();
            setInstallPrompt(e);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (installPrompt) {
            installPrompt.prompt();
            const { outcome } = await installPrompt.userChoice;
            if (outcome === "accepted") {
                setIsInstalled(true);
            }
            setInstallPrompt(null);
        }
    };

    const sendTestNotification = async () => {
        try {
            const response = await fetch("/api/test-notification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (data.success) {
                alert("Test notification sent successfully!");
            } else {
                alert("Failed to send notification: " + data.error);
            }
        } catch (error) {
            alert("Error sending notification: " + error);
        }
    };

    return (
        <div className={`${geistSans.className} ${geistMono.className} font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20`}>
            <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start max-w-4xl">
                <div className="flex items-center gap-4">
                    <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}></div>
                        <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
                    </div>
                </div>

                <div className="text-center sm:text-left">
                    <h1 className="text-4xl font-bold mb-4">Next.js PWA with OneSignal</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">A Progressive Web App with push notifications powered by OneSignal</p>

                    {/* Mobile Testing Banner */}
                    <div className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 rounded-lg mb-6">
                        <h2 className="text-xl font-bold mb-2">📱 Mobile Testing Ready!</h2>
                        <p className="text-sm opacity-90">Open this app on your phone, subscribe to notifications, then use the test buttons below to send notifications from your computer to your phone!</p>
                    </div>
                </div>

                {/* PWA Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border">
                        <h2 className="text-xl font-semibold mb-4">PWA Features</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Service Worker</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>Offline Support</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-green-500">✓</span>
                                <span>App Manifest</span>
                            </div>
                            {isInstalled && (
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-500">✓</span>
                                    <span>Installed as PWA</span>
                                </div>
                            )}
                        </div>
                        {installPrompt && !isInstalled && (
                            <button onClick={handleInstall} className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                Install App
                            </button>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border">
                        <h2 className="text-xl font-semibold mb-4">Push Notifications</h2>
                        <div className="space-y-3">
                            {isInitialized ? (
                                <>
                                    {user ? (
                                        <div className="text-green-600">
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-500">✓</span>
                                                <span>Subscribed to notifications</span>
                                            </div>
                                            <p className="text-sm text-gray-500 mt-1">User ID: {user.userId}</p>
                                        </div>
                                    ) : (
                                        <div className="text-yellow-600">
                                            <div className="flex items-center gap-2">
                                                <span className="text-yellow-500">⚠</span>
                                                <span>Not subscribed to notifications</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-2 mt-4">
                                        {!user ? (
                                            <button onClick={subscribe} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors">
                                                Subscribe
                                            </button>
                                        ) : (
                                            <button onClick={unsubscribe} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                                                Unsubscribe
                                            </button>
                                        )}

                                        <button onClick={sendTestNotification} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                                            Send Test
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-gray-500">Initializing OneSignal...</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Notification Testing Section */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-6 rounded-lg w-full">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-4 text-xl">📱 Test Notifications on Your Phone</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Quick Test Buttons:</h4>
                            <div className="space-y-2">
                                <button onClick={sendTestNotification} className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium">
                                    🚀 Send Test Notification
                                </button>
                                <button
                                    onClick={() => {
                                        const customNotification = {
                                            title: "Custom Test",
                                            message: "This is a custom notification from your computer!",
                                            url: "/",
                                        };
                                        fetch("/api/send-notification", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify(customNotification),
                                        })
                                            .then((res) => res.json())
                                            .then((data) => {
                                                if (data.success) {
                                                    alert("Custom notification sent!");
                                                } else {
                                                    alert("Failed: " + data.error);
                                                }
                                            });
                                    }}
                                    className="w-full bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors font-medium"
                                >
                                    📝 Send Custom Notification
                                </button>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-2">Testing Steps:</h4>
                            <ol className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                                <li>1. Open this app on your phone</li>
                                <li>2. Click "Subscribe" to enable notifications</li>
                                <li>3. Allow notifications when prompted</li>
                                <li>4. Use the buttons above to send test notifications</li>
                                <li>5. Check your phone for the notifications!</li>
                            </ol>
                        </div>
                    </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg w-full">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Setup Instructions:</h3>
                    <ol className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                        <li>1. Create a OneSignal account at onesignal.com</li>
                        <li>2. Create a new app and get your App ID</li>
                        <li>3. Set NEXT_PUBLIC_ONESIGNAL_APP_ID in your environment variables</li>
                        <li>4. Set ONESIGNAL_REST_API_KEY for server-side notifications</li>
                    </ol>
                </div>
            </main>

            <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
                <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
                    <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
                    Learn
                </a>
                <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
                    <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
                    Examples
                </a>
                <a className="flex items-center gap-2 hover:underline hover:underline-offset-4" href="https://nextjs.org?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app" target="_blank" rel="noopener noreferrer">
                    <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
                    Go to nextjs.org →
                </a>
            </footer>
        </div>
    );
}
