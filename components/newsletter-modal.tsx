"use client";

import { useEffect, useState, FormEvent } from "react";
import { Mail, X } from "lucide-react";

export function NewsletterModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // scroll visibility
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  // Track scroll position to show/hide the floating button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setStatus("error");
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "newsletter",
          data: {
            fullName,
            email,
          },
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setFullName("");
        setEmail("");
        // Close modal after showing success message briefly
        setTimeout(() => {
          setIsOpen(false);
          // Reset status after close animation
          setTimeout(() => setStatus("idle"), 500);
        }, 3000);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setStatus("error");
      setErrorMessage("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <>
      {/* Floating Button (Bottom Left) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 left-8 z-45 flex h-12 w-12 items-center justify-center rounded-full bg-charcoal text-ivory border border-ivory/10 hover:bg-champagne hover:text-charcoal hover:scale-105 active:scale-95 shadow-soft transition-all duration-300 ${
          isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-90 pointer-events-none"
        }`}
        aria-label="Subscribe to newsletter"
      >
        <Mail className="h-5 w-5" />
      </button>

      {/* Modal Overlay & Modal Window */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-sm transition-all duration-300"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-charcoal text-ivory border border-champagne/10 shadow-soft overflow-hidden p-8 flex flex-col space-y-6 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-charcoal/80 text-ivory border border-ivory/10 hover:bg-ivory hover:text-charcoal transition-all duration-300"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header / Text */}
            <div className="text-center space-y-2 pt-4">
              <span className="text-xs uppercase tracking-[0.2em] text-champagne block font-medium">Newsletter</span>
              <h2 className="font-display text-2xl md:text-3xl text-white tracking-wide">
                What does power look like on you?
              </h2>
              <p className="text-sm text-ivory/70 leading-relaxed max-w-sm mx-auto">
                Join the Lizzaatelier Private List for collection launches, styling insights, and exclusive access.
              </p>
            </div>

            {/* Status Feedback / Form */}
            {status === "success" ? (
              <div className="text-center py-6 space-y-3 animate-in fade-in duration-300">
                <div className="flex justify-center">
                  <div className="rounded-full bg-champagne/10 border border-champagne/30 p-3">
                    <Mail className="h-8 w-8 text-champagne" />
                  </div>
                </div>
                <h3 className="font-display text-lg text-white">Thank you for subscribing</h3>
                <p className="text-xs text-ivory/60">A welcome email has been sent to your inbox.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="modal-fullname" className="text-[10px] uppercase tracking-[0.15em] text-ivory/50 block font-medium">
                    Full Name
                  </label>
                  <input
                    id="modal-fullname"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    disabled={status === "loading"}
                    className="w-full bg-[#242424] border border-ivory/20 text-ivory placeholder-ivory/40 text-sm px-4 py-3 rounded-none focus:outline-none focus:border-champagne transition duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="modal-email" className="text-[10px] uppercase tracking-[0.15em] text-ivory/50 block font-medium">
                    Email Address
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                    className="w-full bg-[#242424] border border-ivory/20 text-ivory placeholder-ivory/40 text-sm px-4 py-3 rounded-none focus:outline-none focus:border-champagne transition duration-300"
                  />
                </div>

                {status === "error" && (
                  <p className="text-xs text-red-400 font-medium">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 mt-2 text-xs tracking-[0.2em] font-semibold uppercase bg-champagne text-charcoal hover:bg-champagne/90 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
