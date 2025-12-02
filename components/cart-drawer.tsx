"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import { X, Minus, Plus, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart-context";
import { usePaystackPayment } from "@/hooks/use-paystack";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0
});

export function CartDrawer({ open, onClose }: CartDrawerProps): JSX.Element {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const { initiatePayment, isLoading } = usePaystackPayment();
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        if (showEmailModal) {
          setShowEmailModal(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, showEmailModal]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCheckoutClick = () => {
    setShowEmailModal(true);
    setEmail("");
    setEmailError("");
  };

  const handleEmailSubmit = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    const paymentData = {
      email: email.trim(),
      amount: totalPrice * 100,
      reference: `CART-${Date.now()}`,
      metadata: {
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          size: item.size,
          quantity: item.quantity,
          price: item.priceNaira
        })),
        totalItems,
        cart_type: "ready_to_wear"
      }
    };

    setShowEmailModal(false);

    initiatePayment(paymentData, {
      onSuccess: (reference) => {
        console.log("Payment successful:", reference);
        clearCart();
        onClose();
        alert("Payment successful! Your order has been received.");
      },
      onClose: () => {
        console.log("Payment popup closed");
      }
    });
  };

  return (
    <>
      <div
        aria-hidden={!open}
        className={cn(
          "pointer-events-none fixed inset-0 z-50 flex justify-end bg-charcoal/0 transition",
          open && "pointer-events-auto bg-charcoal/40"
        )}
        role="dialog"
        onClick={onClose}
      >
        <aside
          className={cn(
            "flex h-full w-full max-w-md translate-x-full flex-col bg-ivory transition duration-300",
            open && "translate-x-0"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-8 border-b border-charcoal/10">
            <div>
              <p className="font-display text-xl">Your Selections</p>
              {totalItems > 0 && (
                <p className="text-sm text-charcoal/60">{totalItems} {totalItems === 1 ? "item" : "items"}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close cart">
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            {items.length === 0 ? (
              <p className="text-sm text-charcoal/70 leading-relaxed">
                Your curated pieces will appear here.
              </p>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-charcoal/5">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover rounded-none"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div>
                        <h4 className="font-display text-base text-charcoal">{item.title}</h4>
                        <p className="text-xs text-charcoal/60">Size: {item.size}</p>
                      </div>
                      <p className="text-sm text-charcoal/80">
                        {formatter.format(item.priceNaira)}
                      </p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3 text-charcoal hover:text-white" />
                          </Button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3 text-charcoal hover:text-white" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 ml-auto"
                          onClick={() => removeItem(item.id, item.size)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-charcoal/10 p-8 space-y-4">
              <div className="flex items-center justify-between text-lg">
                <span className="font-display">Total</span>
                <span className="font-display">{formatter.format(totalPrice)}</span>
              </div>
              <Button 
                className="w-full" 
                onClick={handleCheckoutClick}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>
          )}
        </aside>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-charcoal/60 transition-opacity"
          onClick={() => setShowEmailModal(false)}
        >
          <div
            className="bg-ivory p-8 w-full max-w-md mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-champagne/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-champagne" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-display text-xl text-charcoal">Confirm Your Email</h3>
                  <p className="text-sm text-charcoal/60">We'll send your receipt here</p>
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError("");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleEmailSubmit();
                    }
                  }}
                  className={cn(
                    "w-full",
                    emailError && "border-red-500 focus:border-red-500"
                  )}
                  autoFocus
                />
                {emailError && (
                  <p className="text-sm text-red-600">{emailError}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEmailSubmit}
                  className="flex-1"
                >
                  Continue to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}