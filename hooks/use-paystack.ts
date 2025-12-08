// hooks/use-paystack.ts
import { useState, useEffect } from "react";

interface PaystackConfig {
  email: string;
  amount: number;
  reference: string;
  publicKey?: string;
  metadata?: Record<string, any>;
  currency?: string;
  channels?: string[];
}

interface PaystackCallbacks {
  onSuccess?: (reference: string) => void | Promise<void>;
  onClose?: () => void;
}

declare global {
  interface Window {
    PaystackPop?: {
      setup: (config: any) => {
        openIframe: () => void;
      };
    };
  }
}

export function usePaystackPayment() {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => {
        console.log("✅ Paystack script loaded");
        setScriptLoaded(true);
      };
      script.onerror = () => {
        console.error("❌ Failed to load Paystack script");
      };
      document.body.appendChild(script);

      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else if (window.PaystackPop) {
      setScriptLoaded(true);
    }
  }, []);

  const initiatePayment = (
    config: PaystackConfig,
    callbacks?: PaystackCallbacks
  ) => {
    console.log("🔵 initiatePayment called");
    console.log("🔵 Script loaded:", scriptLoaded);
    console.log("🔵 Window.PaystackPop:", !!window.PaystackPop);

    if (!scriptLoaded || !window.PaystackPop) {
      alert("Payment system is still loading. Please try again.");
      return;
    }

    setIsLoading(true);
    console.log("🔵 isLoading set to true");

    const publicKey = config.publicKey || process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    if (!publicKey) {
      console.error("❌ Paystack public key is missing");
      alert("Payment configuration error. Please contact support.");
      setIsLoading(false);
      return;
    }

    console.log("🔵 Public key found:", publicKey.substring(0, 10) + "...");

    const paystackConfig = {
      key: publicKey,
      email: config.email,
      amount: config.amount,
      ref: config.reference,
      currency: config.currency || "NGN",
      channels: config.channels || ["card", "bank", "ussd", "mobile_money"],
      metadata: config.metadata || {},
      
      // PRIMARY: Use 'callback' (Paystack's correct property name)
      callback: function(response: any) {
        console.log("✅✅✅ Paystack callback triggered!");
        console.log("✅ Response:", response);
        
        setIsLoading(false);
        console.log("✅ isLoading set to false");
        
        if (callbacks?.onSuccess) {
          console.log("✅ Calling onSuccess callback with reference:", response.reference);
          callbacks.onSuccess(response.reference);
        }
      },
      
      onClose: function() {
        console.log("⚠️ Paystack popup closed");
        setIsLoading(false);
        console.log("⚠️ isLoading set to false");
        
        if (callbacks?.onClose) {
          callbacks.onClose();
        }
      },
    };

    console.log("🔵 Paystack config created");
    console.log("🔵 Opening Paystack iframe...");
    
    try {
      const handler = window.PaystackPop.setup(paystackConfig);
      handler.openIframe();
    } catch (error) {
      console.error("❌ Error opening Paystack:", error);
      setIsLoading(false);
      alert("Failed to open payment window. Please try again.");
    }
  };

  return {
    initiatePayment,
    isLoading,
    scriptLoaded,
  };
}