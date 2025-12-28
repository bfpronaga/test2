import { NextRequest, NextResponse } from "next/server";

interface NotificationRequest {
    title: string;
    message: string;
    userId?: string;
    url?: string;
}

interface OneSignalResponse {
    id: string;
    external_id?: string;
    errors?: any;
}

export async function POST(request: NextRequest) {
    try {
        const { title, message, userId, url }: NotificationRequest = await request.json();

        if (!title || !message) {
            return NextResponse.json({ error: "Title and message are required" }, { status: 400 });
        }

        const appId = process.env.ONESIGNAL_APP_ID;
        const restApiKey = process.env.ONESIGNAL_REST_API_KEY;

        if (!appId || !restApiKey) {
            return NextResponse.json(
                {
                    error: "OneSignal configuration missing. Please set ONESIGNAL_APP_ID and ONESIGNAL_REST_API_KEY environment variables.",
                },
                { status: 500 }
            );
        }

        // Build notification payload according to OneSignal API v1 documentation
        const notificationData = {
            app_id: appId,
            target_channel: "push",
            contents: { en: message },
            headings: { en: title },
            url: url || "/",
            chrome_web_icon: "/icon-192x192.svg",
            chrome_web_badge: "/icon-192x192.svg",
            firefox_icon: "/icon-192x192.svg",
            // Target all subscribed users if no specific user ID
            // included_segments: ["Active Subscriptions"],
            // If specific user ID provided, target that user instead
            // ...(userId && {
            include_external_user_ids: ["test"],
            // included_segments: undefined,
            // }),
        };

        console.log("Sending notification with data:", JSON.stringify(notificationData, null, 2));

        // Use the correct OneSignal API endpoint
        const response = await fetch("https://api.onesignal.com/notifications?c=push", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${restApiKey}`,
            },
            body: JSON.stringify(notificationData),
        });

        console.log("OneSignal API response status:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("OneSignal API error response:", errorText);

            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText };
            }

            return NextResponse.json(
                {
                    error: "Failed to send notification",
                    details: errorData,
                    status: response.status,
                },
                { status: response.status }
            );
        }

        const data: OneSignalResponse = await response.json();
        console.log("OneSignal API success response:", data);

        return NextResponse.json({
            success: true,
            notificationId: data.id,
            externalId: data.external_id,
            message: "Notification sent successfully",
            errors: data.errors,
        });
    } catch (error) {
        console.error("Error sending notification:", error);
        return NextResponse.json(
            {
                error: "Failed to send notification",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
