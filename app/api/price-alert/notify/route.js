import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { checkAndNotifyPriceDrop } from "@/lib/priceAlerts";

/**
 * API endpoint to check and send price drop notifications
 * Called when admin updates a phone price
 */
export async function POST(req) {
  try {
    const body = await req.json();
    const { phoneId, newPrice, oldPrice, phoneName, phoneSlug, imageUrl } = body;

    // Validate required fields
    if (!phoneId || newPrice === undefined) {
      return NextResponse.json(
        { error: "phoneId and newPrice are required" },
        { status: 400 }
      );
    }

    // Skip if no old price or price didn't drop
    if (!oldPrice || newPrice >= oldPrice) {
      return NextResponse.json({
        success: true,
        message: "No price drop detected",
        notified: 0,
      });
    }

    // Check for Gmail credentials
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn("Gmail credentials not configured. Skipping email notifications.");
      return NextResponse.json({
        success: true,
        message: "Email not configured - notifications skipped",
        notified: 0,
      });
    }

    // Send notifications
    const result = await checkAndNotifyPriceDrop(
      phoneId,
      newPrice,
      oldPrice,
      {
        name: phoneName,
        slug: phoneSlug,
        image_url: imageUrl,
      }
    );

    // Update the last_price in phones table for future comparisons
    const supabase = createAdminClient();
    await supabase
      .from("phones")
      .update({ last_price: newPrice })
      .eq("id", phoneId);

    return NextResponse.json({
      success: true,
      message: `Notified ${result.notified} subscribers`,
      ...result,
    });
  } catch (error) {
    console.error("Price alert notification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send notifications" },
      { status: 500 }
    );
  }
}
