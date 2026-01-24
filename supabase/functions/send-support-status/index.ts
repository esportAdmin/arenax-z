import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation schema
const statusEmailRequestSchema = z.object({
  to: z.string()
    .email("Invalid email address")
    .max(255, "Email too long"),
  name: z.string()
    .min(1, "Name is required")
    .max(100, "Name too long")
    .regex(/^[a-zA-ZÀ-ÿ\s\-']+$/, "Name contains invalid characters"),
  status: z.enum(["pending", "in_progress", "resolved", "closed"], {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
  inquirySubject: z.string()
    .min(1, "Subject is required")
    .max(200, "Subject too long"),
});

const statusMessages: Record<string, { title: string; message: string; emoji: string }> = {
  pending: {
    title: "Inquiry Received",
    message: "We have received your support inquiry and it is currently in our queue. Our team will review it shortly.",
    emoji: "📥"
  },
  in_progress: {
    title: "We're Working On It",
    message: "Good news! Our support team is now actively working on your inquiry. We'll get back to you with a solution soon.",
    emoji: "🔧"
  },
  resolved: {
    title: "Issue Resolved",
    message: "Your support inquiry has been resolved. If you have any further questions or if the issue persists, please don't hesitate to reach out again.",
    emoji: "✅"
  },
  closed: {
    title: "Inquiry Closed",
    message: "Your support inquiry has been closed. Thank you for contacting FanArena Pro support. We're always here if you need help!",
    emoji: "📁"
  }
};

// Sanitize HTML to prevent XSS in email
function sanitizeForHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // Parse and validate request body
    let requestBody: unknown;
    try {
      requestBody = await req.json();
    } catch {
      console.error("Invalid JSON body");
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate input with Zod
    const validationResult = statusEmailRequestSchema.safeParse(requestBody);
    if (!validationResult.success) {
      const errorMessage = validationResult.error.errors.map(e => e.message).join(", ");
      console.error("Validation failed:", validationResult.error.errors);
      return new Response(
        JSON.stringify({ success: false, error: errorMessage }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const { to, name, status, inquirySubject } = validationResult.data;
    
    // Sanitize user inputs for HTML
    const safeName = sanitizeForHtml(name);
    const safeSubject = sanitizeForHtml(inquirySubject);

    console.log(`Sending status update email to ${to} for status: ${status}`);

    const statusInfo = statusMessages[status];

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0a0a0f; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 16px 24px; border-radius: 12px;">
              <span style="font-size: 24px; font-weight: bold; color: white;">FanArena Pro</span>
            </div>
          </div>
          
          <!-- Main Card -->
          <div style="background-color: #1a1a24; border-radius: 16px; padding: 32px; border: 1px solid #2a2a3a;">
            <!-- Status Badge -->
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 48px;">${statusInfo.emoji}</span>
            </div>
            
            <!-- Title -->
            <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; text-align: center; margin: 0 0 16px 0;">
              ${statusInfo.title}
            </h1>
            
            <!-- Greeting -->
            <p style="color: #a0a0b0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              Hi ${safeName},
            </p>
            
            <!-- Message -->
            <p style="color: #d0d0e0; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
              ${statusInfo.message}
            </p>
            
            <!-- Inquiry Reference -->
            <div style="background-color: #0a0a0f; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
              <p style="color: #8080a0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
                Your Inquiry
              </p>
              <p style="color: #ffffff; font-size: 14px; font-weight: 500; margin: 0;">
                ${safeSubject}
              </p>
            </div>
            
            <!-- CTA Button -->
            <div style="text-align: center;">
              <a href="https://fanarena.pro/contact" 
                 style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                Contact Support
              </a>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px;">
            <p style="color: #606080; font-size: 12px; margin: 0;">
              © 2026 FanArena Pro. All rights reserved.
            </p>
            <p style="color: #606080; font-size: 12px; margin: 8px 0 0 0;">
              This email was sent regarding your support inquiry.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "FanArena Pro Support <onboarding@resend.dev>",
        to: [to],
        subject: `${statusInfo.emoji} ${statusInfo.title} - ${safeSubject}`,
        html: emailHtml,
      }),
    });

    const emailResponse = await res.json();

    if (!res.ok) {
      console.error("Resend API error:", emailResponse);
      throw new Error(emailResponse.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, ...emailResponse }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in send-support-status function:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
