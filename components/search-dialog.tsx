"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type SearchDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  // When closed, don't mount anything
  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center bg-charcoal/40 p-6",
        "animate-in fade-in duration-200"
      )}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={cn(
          "mt-24 w-full max-w-2xl rounded-2xl border border-charcoal/10 bg-ivory p-8 shadow-soft",
          "animate-in zoom-in-95 slide-in-from-top-2 duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <p className="font-display text-xl">Search the Atelier</p>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Close search"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <Input
            placeholder="Explore collections, silhouettes, or muses"
            autoFocus
          />
          <p className="text-sm text-charcoal/60">
            Begin typing to discover pieces crafted with intention.
          </p>
        </div>
      </div>
    </div>
  );
}
