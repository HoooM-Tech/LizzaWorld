"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type CurrencyInfo = {
  code: string;
  symbol: string;
  rate: number; // Conversion rate: priceNaira * rate = localPrice
};

export const CURRENCIES: Record<string, CurrencyInfo> = {
  NGN: { code: "NGN", symbol: "₦", rate: 1 },
  USD: { code: "USD", symbol: "$", rate: 0.00067 }, // 1 USD = 1,500 NGN
  EUR: { code: "EUR", symbol: "€", rate: 0.000625 }, // 1 EUR = 1,600 NGN
  GBP: { code: "GBP", symbol: "£", rate: 0.000526 }, // 1 GBP = 1,900 NGN
  CHF: { code: "CHF", symbol: "CHF ", rate: 0.000588 } // 1 CHF = 1,700 NGN
};

type CurrencyContextType = {
  currency: CurrencyInfo;
  setCurrencyCode: (code: string) => void;
  formatPrice: (priceNaira: number) => string;
  convertPrice: (priceNaira: number) => number;
  isLoading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }): JSX.Element {
  const [currencyCode, setCurrencyCodeState] = useState<string>("NGN");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const setCurrencyCode = (code: string) => {
    if (CURRENCIES[code]) {
      setCurrencyCodeState(code);
      localStorage.setItem("selectedCurrency", code);
    }
  };

  useEffect(() => {
    // 1. Check local storage first
    const stored = localStorage.getItem("selectedCurrency");
    if (stored && CURRENCIES[stored]) {
      setCurrencyCodeState(stored);
      setIsLoading(false);
      return;
    }

    // 2. Query location via IP API
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        const detectedCurrency = data.currency;
        if (detectedCurrency && CURRENCIES[detectedCurrency]) {
          setCurrencyCodeState(detectedCurrency);
          localStorage.setItem("selectedCurrency", detectedCurrency);
        } else if (data.country_code && data.country_code !== "NG") {
          // If foreign location but not in list, default to USD
          setCurrencyCodeState("USD");
          localStorage.setItem("selectedCurrency", "USD");
        } else {
          setCurrencyCodeState("NGN");
          localStorage.setItem("selectedCurrency", "NGN");
        }
      })
      .catch((err) => {
        console.warn("IP location lookup failed, using timezone fallback:", err);
        // 3. Fallback to timezone
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        let detected = "NGN";
        if (tz.includes("Zurich") || tz.includes("Switzerland")) {
          detected = "CHF";
        } else if (tz.includes("London") || tz.includes("Dublin")) {
          detected = "GBP";
        } else if (tz.startsWith("Europe")) {
          detected = "EUR";
        } else if (tz.startsWith("America") || tz.includes("US") || tz.includes("Canada")) {
          detected = "USD";
        }
        setCurrencyCodeState(detected);
        localStorage.setItem("selectedCurrency", detected);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const currentCurrency = CURRENCIES[currencyCode] || CURRENCIES.NGN;

  const formatPrice = (priceNaira: number): string => {
    const converted = priceNaira * currentCurrency.rate;
    const decimals = currentCurrency.code === "NGN" ? 0 : 2;
    const numFormatter = new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    return `${currentCurrency.symbol}${numFormatter.format(converted)}`;
  };

  const convertPrice = (priceNaira: number): number => {
    return priceNaira * currentCurrency.rate;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency: currentCurrency,
        setCurrencyCode,
        formatPrice,
        convertPrice,
        isLoading
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextType {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}
