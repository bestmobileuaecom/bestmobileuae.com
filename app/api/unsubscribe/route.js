import { NextResponse } from "next/server";
import { unsubscribeAlert } from "@/lib/priceAlerts";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const phone = searchParams.get("phone");

  if (!email || !phone) {
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head><title>Unsubscribe Error</title></head>
      <body style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h1>Invalid Request</h1>
        <p>Missing email or phone information.</p>
        <a href="/">Go to Homepage</a>
      </body>
      </html>
    `, { 
      status: 400,
      headers: { "Content-Type": "text/html" }
    });
  }

  const result = await unsubscribeAlert(email, phone);

  if (result.success) {
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Unsubscribed - Best Mobile UAE</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            text-align: center;
            padding: 50px 20px;
            background: #f5f5f5;
          }
          .container {
            max-width: 400px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          h1 { color: #1f2937; margin-bottom: 10px; }
          p { color: #6b7280; }
          a {
            display: inline-block;
            margin-top: 20px;
            background: #6366f1;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
          }
          a:hover { background: #4f46e5; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>✅ Unsubscribed</h1>
          <p>You've been unsubscribed from price alerts for this phone.</p>
          <p>You can always subscribe again from the phone's page.</p>
          <a href="/phones">Browse Phones</a>
        </div>
      </body>
      </html>
    `, { 
      status: 200,
      headers: { "Content-Type": "text/html" }
    });
  }

  return new Response(`
    <!DOCTYPE html>
    <html>
    <head><title>Error</title></head>
    <body style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1>Something went wrong</h1>
      <p>${result.error || "Unable to unsubscribe. Please try again."}</p>
      <a href="/">Go to Homepage</a>
    </body>
    </html>
  `, { 
    status: 500,
    headers: { "Content-Type": "text/html" }
  });
}
