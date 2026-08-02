"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, RotateCcw, Check, Sparkles } from "lucide-react";

interface FitProfile {
  measurements: Record<string, string>;
  bodyShape: string;
}

const FIELDS = [
  { id: "bust", label: "Bust" },
  { id: "underBust", label: "Under Bust" },
  { id: "waist", label: "Waist" },
  { id: "hip", label: "Hip" },
  { id: "shoulder", label: "Shoulder" },
  { id: "sleeveLength", label: "Sleeve Length" },
  { id: "height", label: "Height" },
  { id: "preferredHeelHeight", label: "Preferred Heel Height" },
];

const BODY_SHAPES = [
  "Balanced",
  "Fuller Bust",
  "Fuller Hips",
  "Broad Shoulders",
  "Curvy",
];

const STANDARD_SIZES = [
  { size: "6", bust: "32", waist: "26", hip: "36" },
  { size: "8", bust: "34", waist: "28", hip: "38" },
  { size: "10", bust: "36", waist: "30", hip: "41" },
  { size: "12", bust: "38", waist: "33", hip: "44" },
  { size: "14", bust: "40", waist: "36", hip: "46" },
  { size: "16", bust: "44", waist: "38", hip: "49" },
  { size: "18", bust: "48", waist: "44", hip: "52" },
  { size: "20", bust: "52", waist: "48", hip: "56" },
];

interface SizeGuideFlowProps {
  shopMode: "standard" | "personalized";
  setShopMode: (mode: "standard" | "personalized") => void;
}

export function SizeGuideFlow({ shopMode, setShopMode }: SizeGuideFlowProps) {
  const [isOpen, setIsOpen] = useState(false);


  // Keep measurements as array of digit strings for easy entry and editing
  const [measurements, setMeasurements] = useState<Record<string, string[]>>({
    bust: [],
    underBust: [],
    waist: [],
    hip: [],
    shoulder: [],
    sleeveLength: [],
    height: [],
    preferredHeelHeight: [],
  });

  const [bodyShape, setBodyShape] = useState<string>("");
  const [isSaved, setIsSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("fitProfile");
      if (stored) {
        const parsed = JSON.parse(stored) as FitProfile;
        if (parsed.measurements) {
          const loaded: Record<string, string[]> = {};
          FIELDS.forEach((f) => {
            const val = parsed.measurements[f.id] || "";
            loaded[f.id] = val.split("");
          });
          setMeasurements(loaded);
        }
        if (parsed.bodyShape) {
          setBodyShape(parsed.bodyShape);
        }
      }
    } catch (e) {
      console.error("Error loading fit profile from localStorage", e);
    }
  }, []);

  const handleDigitClick = (fieldId: string, digit: string) => {
    setMeasurements((prev) => {
      const current = prev[fieldId] || [];
      if (current.length >= 3) return prev; // Avoid unrealistic measurement lengths
      return {
        ...prev,
        [fieldId]: [...current, digit],
      };
    });
    setIsSaved(false);
  };

  const handleClearField = (fieldId: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [fieldId]: [],
    }));
    setIsSaved(false);
  };

  const handleSaveProfile = () => {
    const formattedMeasurements: Record<string, string> = {};
    FIELDS.forEach((f) => {
      formattedMeasurements[f.id] = measurements[f.id].join("");
    });

    const profile: FitProfile = {
      measurements: formattedMeasurements,
      bodyShape,
    };

    localStorage.setItem("fitProfile", JSON.stringify(profile));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="border border-charcoal/10 bg-ivory/50 mt-4">
      {/* Toggle Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-xs tracking-[0.2em] font-semibold text-charcoal uppercase hover:bg-charcoal/5 transition-all duration-300"
      >
        <span className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Size Guide & Fit Finder
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-charcoal/60" />
        ) : (
          <ChevronDown className="w-4 h-4 text-charcoal/60" />
        )}
      </button>

      {/* Collapsible Container with Smooth Grid Transition */}
      <div
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100 border-t border-charcoal/10" : "grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-6 space-y-8 text-charcoal">
            {/* STEP 1 — How would you like to shop? */}
            <div className="space-y-4">
              <span className="text-[10px] uppercase tracking-wider text-charcoal/60 block font-semibold">
                STEP 1 — How would you like to shop?
              </span>
              <div className="flex gap-6">
                <label className="flex items-center gap-2.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="shopMode"
                    value="standard"
                    checked={shopMode === "standard"}
                    onChange={() => setShopMode("standard")}
                    className="w-4 h-4 accent-charcoal cursor-pointer"
                  />
                  <span className={`${shopMode === "standard" ? "font-semibold text-charcoal" : "text-charcoal/70"}`}>
                    Standard Sizing
                  </span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="shopMode"
                    value="personalized"
                    checked={shopMode === "personalized"}
                    onChange={() => setShopMode("personalized")}
                    className="w-4 h-4 accent-charcoal cursor-pointer"
                  />
                  <span className={`${shopMode === "personalized" ? "font-semibold text-charcoal" : "text-charcoal/70"}`}>
                    Personalized Fit
                  </span>
                </label>
              </div>
            </div>

            {/* Content for Standard Sizing */}
            {shopMode === "standard" && (
              <div className="space-y-4 pt-4 border-t border-charcoal/5 animate-fadeIn">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-charcoal/10 text-[10px] uppercase tracking-wider text-charcoal/60 font-semibold">
                        <th className="py-2.5 font-semibold">Size</th>
                        <th className="py-2.5 font-semibold">Bust (Inches)</th>
                        <th className="py-2.5 font-semibold">Waist (Inches)</th>
                        <th className="py-2.5 font-semibold">Hip (Inches)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-charcoal/5">
                      {STANDARD_SIZES.map((row) => (
                        <tr key={row.size} className="hover:bg-charcoal/5 transition-colors">
                          <td className="py-2.5 font-bold">{row.size}</td>
                          <td className="py-2.5 text-charcoal/80">{row.bust}</td>
                          <td className="py-2.5 text-charcoal/80">{row.waist}</td>
                          <td className="py-2.5 text-charcoal/80">{row.hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Content for Personalized Fit */}
            {shopMode === "personalized" && (
              <div className="space-y-8 animate-fadeIn pt-4 border-t border-charcoal/5">
                {/* STEP 2 — Personalized Fit */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase text-charcoal">
                      Create Your Personalized Fit Profile
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal/50 block mt-1">
                      STEP 2 — Measurements
                    </span>
                  </div>

                  <div className="space-y-4">
                    {FIELDS.map((field) => {
                      const currentDigits = measurements[field.id] || [];
                      const valueString = currentDigits.join("");

                      return (
                        <div key={field.id} className="space-y-2 border-b border-charcoal/5 pb-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-charcoal/80">
                              {field.label}:{" "}
                              <strong className="text-charcoal font-semibold ml-1">
                                {valueString ? `${valueString} inches` : "—"}
                              </strong>
                            </span>
                            {valueString && (
                              <button
                                onClick={() => handleClearField(field.id)}
                                className="text-[10px] uppercase tracking-wider text-charcoal/50 hover:text-charcoal flex items-center gap-1 transition-colors"
                                title="Clear measurements"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Clear
                              </button>
                            )}
                          </div>

                          {/* Horizontal scrollable row of number tiles 0-9 */}
                          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
                            {Array.from({ length: 10 }).map((_, digit) => {
                              const digitStr = digit.toString();
                              const isSelected = currentDigits.includes(digitStr);

                              return (
                                <button
                                  key={digit}
                                  onClick={() => handleDigitClick(field.id, digitStr)}
                                  className={`flex-shrink-0 w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center border transition-all duration-300 ${
                                    isSelected
                                      ? "bg-champagne border-charcoal text-charcoal shadow-sm"
                                      : "border-charcoal/10 hover:border-charcoal/40 text-charcoal/70 bg-white"
                                  }`}
                                >
                                  {digit}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xs text-charcoal/55 italic leading-relaxed">
                    *Select each digit of your measurement. For example, for a 23-inch bust, select '2' then '3'. The same applies to all other fields.*
                  </p>
                </div>

                {/* STEP 3 — Body Shape */}
                <div className="space-y-6 pt-6 border-t border-charcoal/10">
                  <div>
                    <h3 className="text-sm font-semibold tracking-wider uppercase text-charcoal">
                      Body Shape
                    </h3>
                    <span className="text-[10px] uppercase tracking-wider text-charcoal/50 block mt-1">
                      STEP 3 — Shape Profile
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {BODY_SHAPES.map((shape) => {
                      const isSelected = bodyShape === shape;
                      return (
                        <button
                          key={shape}
                          onClick={() => {
                            setBodyShape(shape);
                            setIsSaved(false);
                          }}
                          className={`px-4 py-2 text-xs tracking-wider uppercase border transition-all duration-300 rounded-none ${
                            isSelected
                              ? "bg-champagne border-charcoal text-charcoal font-semibold"
                              : "border-charcoal/20 text-charcoal/80 hover:border-charcoal/50 bg-white"
                          }`}
                        >
                          {shape}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="w-full py-3.5 text-xs tracking-[0.2em] font-bold uppercase transition-all duration-300 bg-charcoal text-ivory hover:bg-charcoal/90 flex items-center justify-center gap-2"
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-4 h-4" />
                          Saved Successfully
                        </>
                      ) : (
                        "Save My Fit Profile"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
