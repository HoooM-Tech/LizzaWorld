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
        "pointer-events-none fixed inset-0 z-50 flex items-start justify-center bg-charcoal/0 p-6 transition",
        open && "pointer-events-auto bg-charcoal/40"
      )}
      role="dialog"
    >
      <div
        className={cn(
          "mt-24 w-full max-w-2xl scale-95 rounded-2xl border border-charcoal/10 bg-ivory p-8 shadow-soft transition duration-300",
          open && "scale-100"
        )}
      >
        <div className="flex items-center justify-between">
          <p className="font-display text-xl">Search the Atelier</p>
          <Button variant="ghost" size="icon" aria-label="Close search" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="mt-6 space-y-4">
          <Input placeholder="Explore collections, silhouettes, or muses" autoFocus />
          <p className="text-sm text-charcoal/60">
            {/* TODO: connect to product and editorial search */}
            Begin typing to discover pieces crafted with intention.
          </p>
        </div>
      </div>
    </div>
  );
}
