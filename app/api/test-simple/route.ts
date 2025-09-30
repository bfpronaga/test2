import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        // Simple test without OneSignal dependencies
        return NextResponse.json({
            success: true,
            message: "Test endpoint working! OneSignal credentials not configured yet.",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Error in test endpoint:", error);
        return NextResponse.json(
            {
                error: "Test endpoint failed",
                details: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
