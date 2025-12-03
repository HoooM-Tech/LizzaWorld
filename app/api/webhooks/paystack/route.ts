import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    
    // Verify signature
    const hash = crypto
      //.createHmac("sha512", process.env.PAYSTACK_WEBHOOK_SECRET!)
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");
    
    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }
    
    const event = JSON.parse(body);
    
    // Handle different event types
    if (event.event === "charge.success") {
      const { reference, metadata } = event.data;
      
      // Save order to database
      // Send confirmation email
      // Update inventory
      
      console.log("Payment successful:", reference, metadata);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}