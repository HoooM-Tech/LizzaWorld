"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/components/cart-context";
import { usePaystackPayment } from "@/hooks/use-paystack";
import { ArrowLeft, MapPin, User, Truck, Globe } from "lucide-react";

// Helper function to verify payment
const verifyPaymentWithBackend = async (reference: string) => {
  console.log("🔍 Verifying payment with backend:", reference);
  
  try {
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reference }),
    });

    const data = await response.json();
    console.log("🔍 Verification response:", data);

    return data.status === true && data.data?.status === 'success';
  } catch (error) {
    console.error("❌ Verification error:", error);
    return false;
  }
};

// Helper function to send order confirmation email
const sendOrderConfirmationEmail = async (emailData: any) => {
  try {
    console.log("📧 Sending order confirmation email...");
    await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'order',
        data: emailData,
      }),
    });
    console.log("📧 Order confirmation email sent successfully");
  } catch (error) {
    console.error('❌ Failed to send order confirmation email:', error);
  }
};

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

type DeliveryOption = 'within-lagos' | 'outside-lagos' | 'international' | string;

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  deliveryNotes: string;
  deliveryOption: DeliveryOption | '';
  country: string;
};

const initialFormState: CheckoutForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postalCode: "",
  deliveryNotes: "",
  deliveryOption: "",
  country: "Nigeria"
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
  const [paymentReference, setPaymentReference] = useState("");
  const [showInternationalForm, setShowInternationalForm] = useState(false);

  const getDeliveryFee = (): number => {
    if (formData.deliveryOption === 'within-lagos') return 5000;
    if (formData.deliveryOption === 'outside-lagos') return 6500;
    return 0; // International handled separately
  };

  const deliveryFee = getDeliveryFee();
  const finalTotal = totalPrice + deliveryFee;

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
    } else if (!/^[0-9+\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.deliveryOption) newErrors.deliveryOption = "Please select a delivery option";
    
    // Only validate Nigerian address if not international
    if (formData.deliveryOption !== 'international') {
      if (!formData.address.trim()) newErrors.address = "Delivery address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state) newErrors.state = "State is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDeliveryOptionChange = (option: DeliveryOption) => {
    setFormData(prev => ({ 
      ...prev, 
      deliveryOption: option,
      country: option === 'international' ? '' : 'Nigeria'
    }));
    if (errors.deliveryOption) {
      setErrors(prev => ({ ...prev, deliveryOption: undefined }));
    }
  };

  const handleInternationalSubmit = async () => {
    const country = formData.country.trim();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !country || country === "Nigeria") {
      alert("Please fill in all required fields and specify your country");
      return;
    }

    try {
      // Send international shipping inquiry email
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'international_inquiry',
          data: {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            country: formData.country,
            address: formData.address,
            items: items.map(item => ({
              title: item.title,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              price: item.priceNaira
            })),
            totalAmount: totalPrice,
          },
        }),
      });

      alert("Thank you! We've received your international shipping request. Our team will contact you within 24 hours with shipping costs and payment details.");
      clearCart();
      window.location.href = "/";
    } catch (error) {
      console.error('Failed to send inquiry:', error);
      alert("There was an error submitting your request. Please try again or contact us directly.");
    }
  };

  const handleCheckout = () => {
    console.log("🔵 Checkout button clicked");
    
    if (!validateForm()) {
      alert("Please fill in all required fields correctly");
      return;
    }

    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // Handle international orders separately
    if (formData.deliveryOption === 'international') {
      setShowInternationalForm(true);
      return;
    }

    const reference = `ORDER-${Date.now()}`;
    console.log("🔵 Generated reference:", reference);

    const paymentData = {
      email: formData.email,
      amount: finalTotal * 100, // Include delivery fee
      reference,
      metadata: {
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        deliveryNotes: formData.deliveryNotes,
        deliveryOption: formData.deliveryOption,
        deliveryFee: deliveryFee,
        items: items.map(item => ({
          id: item.id,
          title: item.title,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          price: item.priceNaira
        })),
        totalItems,
        order_type: "ready_to_wear"
      }
    };

    console.log("🔵 Initiating payment with data:", paymentData);

    let callbackFired = false;

    initiatePayment(paymentData, {
      onSuccess: async (ref) => {
        console.log("✅ Payment onSuccess callback triggered!");
        console.log("✅ Reference received:", ref);
        
        callbackFired = true;
        
        try {
          console.log("✅ Verifying payment with backend...");
          const isVerified = await verifyPaymentWithBackend(ref);
          
          if (isVerified) {
            console.log("✅ Payment verified successfully!");
            
            const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}${formData.postalCode ? ' ' + formData.postalCode : ''}`;
            
            await sendOrderConfirmationEmail({
              email: formData.email,
              fullName: formData.fullName,
              phone: formData.phone,
              address: fullAddress,
              deliveryOption: formData.deliveryOption,
              deliveryFee: deliveryFee,
              items: items.map(item => ({
                title: item.title,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: item.priceNaira
              })),
              totalAmount: totalPrice,
              finalTotal: finalTotal,
              reference: ref,
            });
            
            setPaymentReference(ref);
            setOrderComplete(true);
            clearCart();
            
            console.log("✅ Success flow completed!");
          } else {
            console.error("❌ Payment verification failed");
            alert("Payment verification failed. Please contact support with reference: " + ref);
          }
        } catch (error) {
          console.error("❌ Error in success handler:", error);
          alert("An error occurred. Please contact support with reference: " + ref);
        }
      },
      
      onClose: async () => {
        console.log("⚠️ Payment popup closed");
        
        if (!callbackFired) {
          console.log("⚠️ Callback did not fire, attempting manual verification...");
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          console.log("🔍 Checking payment status for reference:", reference);
          const isVerified = await verifyPaymentWithBackend(reference);
          
          if (isVerified) {
            console.log("✅ Payment verified via fallback!");
            
            const fullAddress = `${formData.address}, ${formData.city}, ${formData.state}${formData.postalCode ? ' ' + formData.postalCode : ''}`;
            
            await sendOrderConfirmationEmail({
              email: formData.email,
              fullName: formData.fullName,
              phone: formData.phone,
              address: fullAddress,
              deliveryOption: formData.deliveryOption,
              deliveryFee: deliveryFee,
              items: items.map(item => ({
                title: item.title,
                size: item.size,
                color: item.color,
                quantity: item.quantity,
                price: item.priceNaira
              })),
              totalAmount: totalPrice,
              finalTotal: finalTotal,
              reference,
            });
            
            setPaymentReference(reference);
            setOrderComplete(true);
            clearCart();
          } else {
            console.log("⚠️ Payment not verified - user may have cancelled");
          }
        }
      }
    });
  };

  // International shipping inquiry modal
  if (showInternationalForm) {
    return (
      <div className="min-h-screen bg-ivory p-4 sm:p-8">
        <div className="max-w-2xl mx-auto">
          <Card className="border-champagne/30">
            <CardContent className="p-8 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-champagne/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-champagne" />
                </div>
                <h1 className="font-display text-3xl text-charcoal mb-2">International Shipping</h1>
                <p className="text-charcoal/70">
                  We'll calculate DHL shipping costs for your location and contact you with payment details
                </p>
              </div>

              <div className="bg-champagne/5 border border-champagne/20 p-6 rounded-sm space-y-4">
                <h3 className="font-display text-lg mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{item.title} (Size {item.size}) × {item.quantity}</span>
                      <span>{formatter.format(item.priceNaira)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold pt-2 border-t">
                    <span>Subtotal</span>
                    <span>{formatter.format(totalPrice)}</span>
                  </div>
                  <p className="text-xs text-charcoal/60 pt-2">
                    + International shipping (to be calculated)
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Delivery Country *"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                />
                <Textarea
                  placeholder="Full Delivery Address (Optional - can be provided later)"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowInternationalForm(false)}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleInternationalSubmit}
                  className="flex-1"
                >
                  Submit Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                {paymentReference && (
                  <p className="text-sm text-charcoal/60 mt-2">
                    Reference: {paymentReference}
                  </p>
                )}
              </div>
              <div className="bg-champagne/5 border border-champagne/20 p-6 rounded-sm text-left">
                <h3 className="font-display text-lg mb-3">Order Details</h3>
                <div className="space-y-2 text-sm text-charcoal/70">
                  <p><strong>Name:</strong> {formData.fullName}</p>
                  <p><strong>Phone:</strong> {formData.phone}</p>
                  <p><strong>Address:</strong> {formData.address}, {formData.city}, {formData.state}</p>
                  <p><strong>Delivery:</strong> {formData.deliveryOption === 'within-lagos' ? 'Within Lagos' : 'Outside Lagos'} - {formatter.format(deliveryFee)}</p>
                  <p className="pt-2 border-t"><strong>Total Paid:</strong> {formatter.format(finalTotal)}</p>
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

            {/* Delivery Options */}
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 bg-champagne/10 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-champagne" />
                  </div>
                  <h2 className="font-display text-xl text-charcoal">Delivery Option</h2>
                </div>

                <div className="space-y-3">
                  <label className={`flex items-start gap-4 p-4 border-2 rounded-sm cursor-pointer transition ${formData.deliveryOption === 'within-lagos' ? 'border-champagne bg-champagne/5' : 'border-charcoal/10 hover:border-champagne/50'}`}>
                    <input
                      type="radio"
                      name="delivery"
                      value="within-lagos"
                      checked={formData.deliveryOption === 'within-lagos'}
                      onChange={() => handleDeliveryOptionChange('within-lagos')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-charcoal">Within Lagos</p>
                          <p className="text-sm text-charcoal/60">Delivery within Lagos State</p>
                        </div>
                        <p className="font-display text-lg text-charcoal">{formatter.format(5000)}</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-4 border-2 rounded-sm cursor-pointer transition ${formData.deliveryOption === 'outside-lagos' ? 'border-champagne bg-champagne/5' : 'border-charcoal/10 hover:border-champagne/50'}`}>
                    <input
                      type="radio"
                      name="delivery"
                      value="outside-lagos"
                      checked={formData.deliveryOption === 'outside-lagos'}
                      onChange={() => handleDeliveryOptionChange('outside-lagos')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-charcoal">Outside Lagos</p>
                          <p className="text-sm text-charcoal/60">Delivery to other Nigerian states</p>
                        </div>
                        <p className="font-display text-lg text-charcoal">{formatter.format(6500)}</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-4 p-4 border-2 rounded-sm cursor-pointer transition ${formData.deliveryOption === 'international' ? 'border-champagne bg-champagne/5' : 'border-charcoal/10 hover:border-champagne/50'}`}>
                    <input
                      type="radio"
                      name="delivery"
                      value="international"
                      checked={formData.deliveryOption === 'international'}
                      onChange={() => handleDeliveryOptionChange('international')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-charcoal">International Shipping</p>
                          <p className="text-sm text-charcoal/60">DHL shipping - costs calculated based on location</p>
                        </div>
                        <p className="font-display text-sm text-charcoal/60">Contact us</p>
                      </div>
                    </div>
                  </label>
                </div>
                {errors.deliveryOption && <p className="text-xs text-red-600">{errors.deliveryOption}</p>}
              </CardContent>
            </Card>

            {/* Delivery Address - Only show for Nigerian deliveries */}
            {formData.deliveryOption && formData.deliveryOption !== 'international' && (
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
                          title="select value"
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
            )}
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
                          unoptimized
                          className="object-cover rounded-none"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-charcoal font-medium truncate">{item.title}</p>
                        <p className="text-xs text-charcoal/60">Color: {item.color}</p>
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
                    <span className="text-charcoal">
                      {formData.deliveryOption === 'international' 
                        ? 'Contact us' 
                        : deliveryFee > 0 
                          ? formatter.format(deliveryFee)
                          : 'Select option'}
                    </span>
                  </div>
                  <div className="flex justify-between font-display text-lg pt-2 border-t border-charcoal/10">
                    <span>Total</span>
                    <span>
                      {formData.deliveryOption === 'international'
                        ? formatter.format(totalPrice)
                        : formatter.format(finalTotal)}
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleCheckout}
                  disabled={isLoading}
                >
                  {isLoading 
                    ? "Processing..." 
                    : formData.deliveryOption === 'international'
                      ? "Request Shipping Quote"
                      : `Pay ${formatter.format(finalTotal)}`}
                </Button>

                <p className="text-xs text-charcoal/60 text-center">
                  {formData.deliveryOption === 'international'
                    ? "We'll contact you with shipping costs and payment details"
                    : "By placing this order, you agree to our terms and conditions"}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
