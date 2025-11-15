"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  children?: ReactNode;
};

export function CartDrawer({ open, onClose, children }: CartDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "pointer-events-none fixed inset-0 z-50 flex justify-end bg-charcoal/0 transition",
        open && "pointer-events-auto bg-charcoal/40"
      )}
      role="dialog"
    >
      <aside
        className={cn(
          "flex h-full w-full max-w-md translate-x-full flex-col gap-6 bg-ivory p-8 shadow-soft transition duration-300",
          open && "translate-x-0"
        )}
      >
        <div className="flex items-center justify-between">
          <p className="font-display text-xl">Your Selections</p>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close cart">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 space-y-4 text-sm text-charcoal/70">
          {children ?? (
            <p className="leading-relaxed">
              Your curated pieces will appear here. {/* TODO: integrate cart state */}
            </p>
          )}
        </div>
        <Button disabled>Checkout Coming Soon</Button>
      </aside>
    </div>
  );
}
