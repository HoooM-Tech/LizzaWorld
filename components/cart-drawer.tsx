// components/cart-drawer.tsx 

"use client";

import { ReactNode, useEffect } from "react";
import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/cart-context";
import { useRouter } from "next/navigation";
import { useCurrency } from "@/components/currency-context";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps): JSX.Element {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCart();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const handleCheckout = () => {
    onClose();
    router.push("/checkout");
  };

  return (
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
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-charcoal/5">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="80px"
                      className="object-cover rounded-none"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4 className="font-display text-base text-charcoal">{item.title}</h4>
                      <div className="text-xs text-charcoal/60 space-y-0.5">
                        {item.color !== "Default" && <p>Color: {item.color}</p>}
                        <p>Size: {item.size}</p>
                        {item.height && <p>Height: {item.height}</p>}
                      </div>
                    </div>
                    <p className="text-sm text-charcoal/80">
                      {formatPrice(item.priceNaira)}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1, item.height)}
                        >
                          <Minus className="h-3 w-3 text-charcoal hover:text-white" />
                        </Button>
                        <span className="text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1, item.height)}
                        >
                          <Plus className="h-3 w-3 text-charcoal hover:text-white" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 ml-auto"
                        onClick={() => removeItem(item.id, item.size, item.color, item.height)}
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
              <span className="font-display">{formatPrice(totalPrice)}</span>
            </div>
            <Button 
              className="w-full" 
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </aside>
    </div>
  );
}