import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const phoneId = formData.get("phoneId");
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const phoneName = formData.get("phoneName") || "this phone";

    // Validate inputs
    if (!phoneId || !email) {
      return NextResponse.json(
        { error: "Phone ID and email are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Insert or update the alert (upsert on conflict)
    const { error } = await supabase
      .from("price_alerts")
      .upsert(
        { 
          phone_id: phoneId, 
          user_email: email, 
          is_active: true,
          updated_at: new Date().toISOString()
        }, 
        { 
          onConflict: "phone_id,user_email",
          ignoreDuplicates: false
        }
      );

    if (error) {
      console.error("Error saving price alert:", error);
      return NextResponse.json(
        { error: "Failed to save alert" },
        { status: 500 }
      );
    }

    // Redirect to success page with phone name
    // Use the x-forwarded-host header (without port) for proxied environments like Codespaces
    const forwardedHost = req.headers.get("x-forwarded-host");
    const host = forwardedHost || req.headers.get("host")?.replace(/:3000$/, "") || "localhost";
    const protocol = req.headers.get("x-forwarded-proto") || "https";
    const successUrl = `${protocol}://${host}/alert-set?phone=${encodeURIComponent(phoneName)}`;
    
    return NextResponse.redirect(successUrl, 303);
  } catch (error) {
    console.error("Price alert error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also support JSON API for client-side submissions
export async function PUT(req) {
  try {
    const body = await req.json();
    const { phoneId, email } = body;

    if (!phoneId || !email) {
      return NextResponse.json(
        { error: "Phone ID and email are required" },
        { status: 400 }
      );
    }

    const emailLower = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { error } = await supabase
      .from("price_alerts")
      .upsert(
        { 
          phone_id: phoneId, 
          user_email: emailLower, 
          is_active: true,
          updated_at: new Date().toISOString()
        }, 
        { 
          onConflict: "phone_id,user_email",
          ignoreDuplicates: false
        }
      );

    if (error) {
      console.error("Error saving price alert:", error);
      return NextResponse.json(
        { error: "Failed to save alert" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Alert saved successfully" });
  } catch (error) {
    console.error("Price alert error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
