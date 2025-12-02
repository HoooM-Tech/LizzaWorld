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
  onSuccess?: (reference: string) => void;
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

  // Load Paystack script
  useEffect(() => {
    if (typeof window !== "undefined" && !window.PaystackPop) {
      const script = document.createElement("script");
      script.src = "https://js.paystack.co/v1/inline.js";
      script.async = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const initiatePayment = (
    config: PaystackConfig,
    callbacks?: PaystackCallbacks
  ) => {
    if (!scriptLoaded || !window.PaystackPop) {
      alert("Payment system is still loading. Please try again.");
      return;
    }

    setIsLoading(true);

    // Get public key from environment variable
    const publicKey = config.publicKey || process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;

    if (!publicKey) {
      console.error("Paystack public key is missing");
      alert("Payment configuration error. Please contact support.");
      setIsLoading(false);
      return;
    }

    const paystackConfig = {
      key: publicKey,
      email: config.email,
      amount: config.amount,
      ref: config.reference,
      currency: config.currency || "NGN",
      channels: config.channels || ["card", "bank", "ussd", "mobile_money"],
      metadata: config.metadata || {},
      onSuccess: (transaction: any) => {
        setIsLoading(false);
        console.log("Payment successful:", transaction);
        callbacks?.onSuccess?.(transaction.reference);
      },
      onClose: () => {
        setIsLoading(false);
        console.log("Payment popup closed");
        callbacks?.onClose?.();
      },
    };

    const handler = window.PaystackPop.setup(paystackConfig);
    handler.openIframe();
  };

  return {
    initiatePayment,
    isLoading,
    scriptLoaded,
  };
}