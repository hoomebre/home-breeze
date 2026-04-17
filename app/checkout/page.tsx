"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, ChevronRight, Lock, MapPin, Truck, CreditCard, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderRef, setOrderRef] = useState("");

  const [contact, setContact] = useState({ email: "", phone: "" });
  const [shipping, setShipping] = useState({ firstName: "", lastName: "", address: "", city: "Lahore", zip: "" });

  const cartTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitting(true);
      try {
        const fullName = `${shipping.firstName} ${shipping.lastName}`;
        const shippingAddr = shipping.address;
        
        // 1. Create the order
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert({
            customer_name: fullName,
            customer_email: contact.email,
            customer_phone: contact.phone,
            shipping_address: shippingAddr,
            city: shipping.city,
            postal_code: shipping.zip,
            total_amount: cartTotal,
            status: 'pending'
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Create order items
        const orderItems = items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price,
          total_price: item.price * item.quantity
        }));

        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        // Success
        setOrderRef(order.id.slice(0, 8).toUpperCase());
        setOrderComplete(true);
        clearCart();
      } catch (err: any) {
        console.error("Checkout error:", err.message);
        alert("Failed to place order. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-lg text-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-semibold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your purchase. We&apos;ve received your order and will begin processing it shortly.
          </p>
          <p className="text-sm border border-border rounded-md py-3 px-4 mb-8 bg-muted/50">
            Order Reference: <span className="font-bold">#ORD-{orderRef}</span>
          </p>
          <Link 
            href="/products"
            className="w-full inline-block py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0 && step === 1) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 text-center">
        <h1 className="font-serif text-3xl font-semibold mb-4">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-8">Add some luxury items to your cart to proceed with checkout.</p>
        <Link 
          href="/products"
          className="px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <h1 className="font-serif text-3xl md:text-4xl font-semibold mb-8 text-center md:text-left">
          Secure Checkout
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left Column: Form */}
          <div className="flex-1">
            {/* Logic for simplified steps */}
            <div className="mb-8">
              <nav className="flex items-center text-sm font-medium">
                <span className={`${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Contact</span>
                <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
                <span className={`${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Shipping</span>
                <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />
                <span className={`${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>Payment</span>
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step 1: Contact */}
              {step === 1 && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm animate-in fade-in slide-in-from-bottom-4">
                  <h2 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-accent" /> Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                      <input 
                        type="email" id="email" required
                        value={contact.email} onChange={e => setContact({...contact, email: e.target.value})}
                        className="w-full border border-border rounded-md px-4 py-2 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                      <input 
                        type="tel" id="phone" required
                        value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})}
                        className="w-full border border-border rounded-md px-4 py-2 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg mt-6">
                      Continue to Shipping
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Shipping */}
              {step === 2 && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-serif font-semibold flex items-center gap-2">
                      <Truck className="w-5 h-5 text-accent" /> Shipping Address
                    </h2>
                    <button type="button" onClick={() => setStep(1)} className="text-sm text-primary hover:underline">Edit Contact</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fname" className="block text-sm font-medium mb-1">First Name</label>
                      <input 
                        type="text" id="fname" required
                        value={shipping.firstName} onChange={e => setShipping({...shipping, firstName: e.target.value})}
                        className="w-full border border-border rounded-md px-4 py-2 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="lname" className="block text-sm font-medium mb-1">Last Name</label>
                      <input 
                        type="text" id="lname" required
                        value={shipping.lastName} onChange={e => setShipping({...shipping, lastName: e.target.value})}
                        className="w-full border border-border rounded-md px-4 py-2 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                    <div className="col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium mb-1">Street Address</label>
                      <input 
                        type="text" id="address" required
                        value={shipping.address} onChange={e => setShipping({...shipping, address: e.target.value})}
                        className="w-full border border-border rounded-md px-4 py-2 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
                      <select 
                        id="city" required
                        value={shipping.city} onChange={e => setShipping({...shipping, city: e.target.value})}
                        className="w-full border border-border rounded-md px-4 py-2 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Peshawar">Peshawar</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="zip" className="block text-sm font-medium mb-1">Postal Code</label>
                      <input 
                        type="text" id="zip" required
                        value={shipping.zip} onChange={e => setShipping({...shipping, zip: e.target.value})}
                        className="w-full border border-border rounded-md px-4 py-2 focus:ring-2 focus:ring-accent focus:border-accent outline-none"
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg mt-6">
                    Continue to Payment
                  </button>
                </div>
              )}

              {/* Step 3: Payment */}
              {step === 3 && (
                <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm animate-in fade-in slide-in-from-bottom-4">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-serif font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-accent" /> Payment Method
                    </h2>
                    <button type="button" onClick={() => setStep(2)} className="text-sm text-primary hover:underline">Edit Shipping</button>
                  </div>
                  
                  <div className="border border-accent bg-accent/5 rounded-md p-4 relative mb-6">
                    <div className="flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full border-[5px] border-accent shrink-0" />
                        <span className="font-medium">Cash on Delivery (COD)</span>
                      </div>
                      <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                    </div>
                    <p className="text-sm border-t border-border/50 mt-4 pt-3 text-muted-foreground ml-7">
                      Pay with cash upon delivery. Safe, simple, and convenient.
                    </p>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg mt-6 disabled:opacity-70 flex justify-center items-center"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-border shadow-sm sticky top-24">
              <h2 className="text-xl font-serif font-semibold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 rounded border border-border overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                      <span className="absolute -top-2 -right-2 bg-muted text-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center border border-border font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 py-1 flex flex-col justify-between">
                      <span className="text-sm font-medium line-clamp-2">{item.name}</span>
                      <span className="text-sm text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-border">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
