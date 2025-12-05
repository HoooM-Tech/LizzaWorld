// app/api/webhooks/paystack/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { sendOrderConfirmation, sendConsultationConfirmation, sendAdminNotification } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    
    if (!signature) {
      console.error("No signature provided");
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    // Verify signature
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    
    if (!secretKey) {
      console.error("PAYSTACK_SECRET_KEY not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const hash = crypto
      .createHmac("sha512", secretKey)
      .update(body)
      .digest("hex");
    
    if (hash !== signature) {
      console.error("Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    
    const event = JSON.parse(body);
    console.log("Webhook event received:", event.event);
    
    // Handle successful charge
    if (event.event === "charge.success") {
      const { reference, metadata, customer } = event.data;
      
      console.log("Processing successful payment:", reference);
      
      try {
        // Determine order type and send appropriate email
        if (metadata.order_type === "ready_to_wear") {
          // Send order confirmation email
          await sendOrderConfirmation({
            email: customer.email,
            fullName: metadata.fullName,
            phone: metadata.phone,
            address: metadata.address,
            items: metadata.items,
            totalAmount: event.data.amount / 100, // Convert from kobo to naira
            reference,
          });

          // Send admin notification
          await sendAdminNotification("order", {
            reference,
            customer: customer.email,
            fullName: metadata.fullName,
            phone: metadata.phone,
            address: metadata.address,
            items: metadata.items,
            totalAmount: event.data.amount / 100,
            metadata,
          });

          console.log("Order confirmation emails sent successfully");
        } else if (metadata.order_type === "consultation") {
          // Send consultation confirmation email
          await sendConsultationConfirmation({
            email: customer.email,
            fullName: metadata.fullName,
            consultationType: metadata.consultationType,
            preferredDate: metadata.preferredDate,
            preferredTime: metadata.preferredTime,
            category: metadata.category,
            reference,
            amount: event.data.amount / 100,
          });

          // Send admin notification
          await sendAdminNotification("consultation", {
            reference,
            customer: customer.email,
            fullName: metadata.fullName,
            consultationType: metadata.consultationType,
            preferredDate: metadata.preferredDate,
            preferredTime: metadata.preferredTime,
            category: metadata.category,
            amount: event.data.amount / 100,
            metadata,
          });

          console.log("Consultation confirmation emails sent successfully");
        }

        // TODO: Save order to database here
        // TODO: Update inventory here
        
      } catch (emailError) {
        console.error("Error sending confirmation emails:", emailError);
        // Don't fail the webhook - payment was successful
        // You might want to implement a retry mechanism or alert system
      }
    }
    
    // Handle failed charges
    if (event.event === "charge.failed") {
      console.log("Payment failed:", event.data.reference);
      // TODO: Handle failed payment (notify user, log, etc.)
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { 
        error: "Webhook failed",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}