import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const testNotification = {
        title: "Test Notification",
        message: "This is a test notification from your PWA app!",
        url: "/",
    };

    try {
        const origin = request.headers.get("origin") || request.url.split("/api")[0];
        const response = await fetch(`${origin}/api/send-notification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(testNotification),
        });

        const data = await response.json();

        if (response.ok) {
            return NextResponse.json({
                success: true,
                message: "Test notification sent successfully",
                data,
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: "Failed to send test notification",
                    details: data,
                },
                { status: response.status }
            );
        }
    } catch (error) {
        console.error("Error sending test notification:", error);
        return NextResponse.json(
            {
                error: "Failed to send test notification",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
