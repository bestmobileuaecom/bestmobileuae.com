/**
 * Price Alert Email Notifications
 * Handles sending price drop notifications to subscribers
 */

import { createAdminClient } from "@/lib/supabase/server";
import nodemailer from "nodemailer";

// Create email transporter using Gmail SMTP
function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
    },
  });
}

/**
 * Check if price dropped and send notifications
 * Call this when updating phone price in admin
 * 
 * @param {string} phoneId - The phone ID
 * @param {number} newPrice - The new price
 * @param {number} oldPrice - The previous price
 * @param {object} phoneData - Phone details for email content
 */
export async function checkAndNotifyPriceDrop(phoneId, newPrice, oldPrice, phoneData) {
  // Only proceed if price actually dropped
  if (!oldPrice || newPrice >= oldPrice) {
    console.log(`No price drop for ${phoneData.name}: ${oldPrice} -> ${newPrice}`);
    return { notified: 0, skipped: true };
  }

  const supabase = createAdminClient();

  // Get all active subscribers for this phone who haven't been notified at this price
  const { data: alerts, error: alertsError } = await supabase
    .from("price_alerts")
    .select("*")
    .eq("phone_id", phoneId)
    .eq("is_active", true)
    .or(`last_notified_price.is.null,last_notified_price.gt.${newPrice}`);

  if (alertsError) {
    console.error("Error fetching price alerts:", alertsError);
    return { notified: 0, error: alertsError.message };
  }

  if (!alerts || alerts.length === 0) {
    console.log(`No subscribers to notify for ${phoneData.name}`);
    return { notified: 0, skipped: true };
  }

  console.log(`Sending price drop alerts to ${alerts.length} subscribers for ${phoneData.name}`);

  // Send emails
  const transporter = createTransporter();
  let notifiedCount = 0;
  const errors = [];

  for (const alert of alerts) {
    try {
      await sendPriceDropEmail(transporter, {
        to: alert.user_email,
        phoneName: phoneData.name,
        phoneSlug: phoneData.slug,
        oldPrice,
        newPrice,
        savings: oldPrice - newPrice,
        imageUrl: phoneData.image_url || phoneData.image,
      });

      // Update last_notified_price to prevent duplicate notifications
      await supabase
        .from("price_alerts")
        .update({ 
          last_notified_price: newPrice,
          updated_at: new Date().toISOString()
        })
        .eq("id", alert.id);

      notifiedCount++;
    } catch (err) {
      console.error(`Failed to send email to ${alert.user_email}:`, err);
      errors.push({ email: alert.user_email, error: err.message });
    }
  }

  return { 
    notified: notifiedCount, 
    total: alerts.length,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Send price drop notification email
 */
async function sendPriceDropEmail(transporter, { to, phoneName, phoneSlug, oldPrice, newPrice, savings, imageUrl }) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bestmobileuae.com";
  const phoneUrl = `${siteUrl}/phones/${phoneSlug}`;
  const unsubscribeUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(to)}&phone=${phoneSlug}`;

  const mailOptions = {
    from: `"Best Mobile UAE" <${process.env.GMAIL_USER}>`,
    to,
    subject: `🔔 Price Drop Alert: ${phoneName} is now AED ${newPrice.toLocaleString()}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 30px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Price Drop Alert!</h1>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #1f2937; margin: 0 0 10px; font-size: 22px;">${phoneName}</h2>
              
              <!-- Price Box -->
              <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
                <div style="color: #6b7280; font-size: 14px; text-decoration: line-through; margin-bottom: 5px;">
                  Was: AED ${oldPrice.toLocaleString()}
                </div>
                <div style="color: #16a34a; font-size: 32px; font-weight: bold; margin-bottom: 5px;">
                  Now: AED ${newPrice.toLocaleString()}
                </div>
                <div style="color: #16a34a; font-size: 16px; font-weight: 600;">
                  You save AED ${savings.toLocaleString()}!
                </div>
              </div>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${phoneUrl}" 
                   style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 600; font-size: 16px;">
                  View Phone Details →
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 20px 0 0;">
                This is your personalized price drop alert from Best Mobile UAE. 
                We'll continue monitoring prices and notify you of future drops.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0 0 10px;">
                You're receiving this because you subscribed to price alerts.
              </p>
              <a href="${unsubscribeUrl}" style="color: #6b7280; font-size: 12px;">
                Unsubscribe from this alert
              </a>
            </div>
            
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Price Drop Alert: ${phoneName}

Great news! The price has dropped!

Was: AED ${oldPrice.toLocaleString()}
Now: AED ${newPrice.toLocaleString()}
You save: AED ${savings.toLocaleString()}

View details: ${phoneUrl}

---
Unsubscribe: ${unsubscribeUrl}
    `.trim(),
  };

  return transporter.sendMail(mailOptions);
}

/**
 * Get all active price alerts for a phone
 */
export async function getPriceAlertsForPhone(phoneId) {
  const supabase = createAdminClient();
  
  const { data, error } = await supabase
    .from("price_alerts")
    .select("*")
    .eq("phone_id", phoneId)
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching alerts:", error);
    return [];
  }

  return data || [];
}

/**
 * Deactivate a price alert (unsubscribe)
 */
export async function unsubscribeAlert(email, phoneSlug) {
  const supabase = createAdminClient();

  // First get the phone ID from slug
  const { data: phone } = await supabase
    .from("phones")
    .select("id")
    .eq("slug", phoneSlug)
    .single();

  if (!phone) {
    return { success: false, error: "Phone not found" };
  }

  const { error } = await supabase
    .from("price_alerts")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("phone_id", phone.id)
    .eq("user_email", email.toLowerCase());

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
