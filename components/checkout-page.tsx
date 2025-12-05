"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/components/cart-context";
import { usePaystackPayment } from "@/hooks/use-paystack";
import { ArrowLeft, MapPin, User, Phone, Mail } from "lucide-react";

const formatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0
});

const nigerianStates = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa",
  "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
  "FCT"
];

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryNotes: string;
};

const initialFormState: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  deliveryNotes: ""
};

interface CheckoutPageProps {
  onBack?: () => void;
}

export default function CheckoutPage({ onBack }: CheckoutPageProps) {
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { initiatePayment, isLoading } = usePaystackPayment();
  const [formData, setFormData] = useState<CheckoutForm>(initialFormState);
  const [errors, setErrors] = useState<Partial<CheckoutForm>>({});
  const [orderComplete, setOrderComplete] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckoutForm> = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid 11-digit phone number";
    }
    if (!formData.address.trim()) newErrors.address = "Delivery address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCheckout = () => {
    if (!validateForm()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const paymentData = {
      email: formData.email,
      amount: totalPrice * 100,
      reference: `ORDER-${Date.now()}`,
      metadata: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        deliveryNotes: formData.deliveryNotes,
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          size: item.size,
          quantity: item.quantity,
          price: item.priceNaira
        })),
        totalItems,
        order_type: "ready_to_wear"
      }
    };

    initiatePayment(paymentData, {
      onSuccess: async (reference) => {
        console.log("Payment successful:", reference);
        
        // Send order confirmation email
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'order',
              data: {
                email: formData.email,
                fullName: formData.fullName,
                phone: formData.phone,
                address: `${formData.address}, ${formData.city}, ${formData.state}`,
                items: items.map(item => ({
                  title: item.title,
                  size: item.size,
                  quantity: item.quantity,
                  price: item.priceNaira,
                })),
                totalAmount: totalPrice,
                reference,
              },
            }),
          });
        } catch (error) {
          console.error('Failed to send email:', error);
        }
        
        clearCart();
        setOrderComplete(true);
      },
      onClose: () => {
        console.log("Payment popup closed");
      }
    });
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-ivory p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-champagne/30">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-champagne" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h1 className="font-display text-3xl text-charcoal mb-2">Order Confirmed!</h1>
                <p className="text-charcoal/70">
                  Thank you for your purchase. We've sent a confirmation email to {formData.email}
                </p>
              </div>
              <div className="bg-champagne/5 border border-champagne/20 p-6 rounded-sm text-left">
                <h3 className="font-display text-lg mb-3">Delivery Information</h3>
                <div className="space-y-2 text-sm text-charcoal/70">
                  <p><strong>Name:</strong> {formData.fullName}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state}</p>
                </div>
              </div>
              <p className="text-sm text-charcoal/60">
                We will contact you within 24-48 hours to arrange delivery.
              </p>
              <Button onClick={() => window.location.href = "/"} className="w-full sm:w-auto">
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory p-4 sm:p-8">
        <div className="max-w-6xl mx-auto text-center py-16">
          <h1 className="font-display text-3xl text-charcoal mb-4">Your Cart is Empty</h1>
          <p className="text-charcoal/70 mb-8">Add some items to your cart before checking out</p>
          <Button onClick={() => window.location.href = "/shop"}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-charcoal/70 hover:text-charcoal mb-6 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Cart</span>
          </button>
        )}

        <h1 className="font-display text-4xl text-charcoal mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-champagne/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-champagne" />
                  </div>
                  <h2 className="font-display text-xl text-charcoal">Contact Information</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="Full Name *"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <Input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <Input
                      type="tel"
                      placeholder="Phone Number (WhatsApp) *"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-champagne/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-champagne" />
                  </div>
                  <h2 className="font-display text-xl text-charcoal">Delivery Address</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Textarea
                      placeholder="Street Address *"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      rows={2}
                      className={errors.address ? "border-red-500" : ""}
                    />
                    {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Input
                        placeholder="City *"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <select
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className={`flex h-12 w-full border ${errors.state ? "border-red-500" : "border-charcoal/15"} bg-white/70 px-4 text-sm text-charcoal placeholder:text-charcoal/50 backdrop-blur transition focus:border-charcoal/30 focus:bg-white focus:outline-none`}
                      >
                        <option value="">Select State *</option>
                        {nigerianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                      {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
                    </div>
                  </div>

                  <Input
                    placeholder="Postal Code (Optional)"
                    value={formData.postalCode}
                    onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  />

                  <Textarea
                    placeholder="Delivery Notes (Optional) - e.g., landmarks, special instructions"
                    value={formData.deliveryNotes}
                    onChange={(e) => handleInputChange("deliveryNotes", e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardContent className="p-6 space-y-6">
                <h2 className="font-display text-xl text-charcoal">Order Summary</h2>

                <div className="space-y-4 max-h-64 overflow-y-auto">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.size}`} className="flex gap-3">
                      <div className="relative h-16 w-12 flex-shrink-0 bg-charcoal/5 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover rounded-none"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-charcoal font-medium truncate">{item.title}</p>
                        <p className="text-xs text-charcoal/60">Size: {item.size} × {item.quantity}</p>
                        <p className="text-sm text-charcoal/80">{formatter.format(item.priceNaira)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-charcoal/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Subtotal</span>
                    <span className="text-charcoal">{formatter.format(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal/70">Delivery</span>
                    <span className="text-charcoal">Calculated at delivery</span>
                  </div>
                  <div className="flex justify-between font-display text-lg pt-2 border-t border-charcoal/10">
                    <span>Total</span>
                    <span>{formatter.format(totalPrice)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : `Pay ${formatter.format(totalPrice)}`}
                </Button>

                <p className="text-xs text-charcoal/60 text-center">
                  By placing this order, you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}