import { useEffect, useState } from "react";

interface OneSignalUser {
    userId: string;
    isSubscribed: boolean;
}

declare global {
    interface Window {
        OneSignal: any;
    }
}

export const useOneSignal = (appId: string) => {
    const [user, setUser] = useState<OneSignalUser | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Load OneSignal SDK
        const script = document.createElement("script");
        script.src = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.js";
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            if (window.OneSignal) {
                window.OneSignal.init({
                    appId: appId,
                    notifyButton: {
                        enable: true,
                    },
                    allowLocalhostAsSecureOrigin: true,
                });

                // Get user ID
                window.OneSignal.getUserId().then((userId: string) => {
                    if (userId) {
                        setUser({
                            userId,
                            isSubscribed: true,
                        });
                    }
                });

                // Listen for subscription changes
                window.OneSignal.on("subscriptionChange", (isSubscribed: boolean) => {
                    if (isSubscribed) {
                        window.OneSignal.getUserId().then((userId: string) => {
                            setUser({
                                userId,
                                isSubscribed: true,
                            });
                        });
                    } else {
                        setUser(null);
                    }
                });

                setIsInitialized(true);
            }
        };

        return () => {
            // Cleanup
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        };
    }, [appId]);

    const subscribe = () => {
        if (window.OneSignal) {
            window.OneSignal.showNativePrompt();
        }
    };

    const unsubscribe = () => {
        if (window.OneSignal) {
            window.OneSignal.setSubscription(false);
        }
    };

    return {
        user,
        isInitialized,
        subscribe,
        unsubscribe,
    };
};
