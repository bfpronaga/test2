import { NextRequest, NextResponse } from "next/server";

interface NotificationRequest {
    title: string;
    message: string;
    userId?: string;
    url?: string;
}

interface OneSignalResponse {
    id: string;
    recipients: number;
    external_id: string;
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

        const notificationData = {
            app_id: appId,
            headings: { en: title },
            contents: { en: message },
            url: url || "/",
            ...(userId ? { include_player_ids: [userId] } : { included_segments: ["Subscribed Users"] }),
            chrome_web_icon: "/icon-192x192.svg",
            chrome_web_badge: "/icon-192x192.svg",
            firefox_icon: "/icon-192x192.svg",
            chrome_icon: "/icon-192x192.svg",
        };

        const response = await fetch("https://onesignal.com/api/v1/notifications", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${restApiKey}`,
            },
            body: JSON.stringify(notificationData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("OneSignal API error:", errorData);
            return NextResponse.json(
                {
                    error: "Failed to send notification",
                    details: errorData,
                },
                { status: response.status }
            );
        }

        const data: OneSignalResponse = await response.json();

        return NextResponse.json({
            success: true,
            notificationId: data.id,
            recipients: data.recipients,
            message: "Notification sent successfully",
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
