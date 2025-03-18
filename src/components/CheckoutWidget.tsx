
import React, { useState, useRef, useEffect } from "react";
import { Coupon, OrderSummary } from "../types/checkout";
import { availableCoupons, calculateOrderSummary } from "../data/coupons";
import { Share, Check, Plus, ShoppingBag, ChevronDown, ChevronUp, Tag, X, Info, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAnimationSequence, useAnimatedValue } from "@/hooks/use-animation";

interface CheckoutWidgetProps {
  productName?: string;
  initialSubtotal: number;
  className?: string;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const CheckoutWidget = ({
  productName = "Your Product",
  initialSubtotal,
  className,
}: CheckoutWidgetProps) => {
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | undefined>(undefined);
  const [showCoupons, setShowCoupons] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>(
    calculateOrderSummary(initialSubtotal)
  );
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  // Animation states
  const isVisible1 = useAnimationSequence(100, 100, 1);
  const isVisible2 = useAnimationSequence(200, 100, 1);
  const isVisible3 = useAnimationSequence(300, 100, 1);
  const isVisible4 = useAnimationSequence(400, 100, 1);
  
  const displayTotal = useAnimatedValue(0, orderSummary.total, 1000);
  
  const couponRef = useRef<HTMLDivElement>(null);
  
  // Update order summary when coupon changes
  useEffect(() => {
    setOrderSummary(calculateOrderSummary(initialSubtotal, appliedCoupon));
  }, [appliedCoupon, initialSubtotal]);
  
  // Close coupon dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (couponRef.current && !couponRef.current.contains(event.target as Node)) {
        setShowCoupons(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [couponRef]);
  
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: `Check out ${productName} for ${formatCurrency(orderSummary.total)}!`,
        url: window.location.href,
      }).catch((error) => {
        console.error('Error sharing:', error);
      });
    } else {
      // Fallback for browsers that don't support Navigator.share
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The product link has been copied to your clipboard.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const applyCoupon = (coupon: Coupon) => {
    setAppliedCoupon(coupon);
    setShowCoupons(false);
    
    toast({
      title: "Coupon applied!",
      description: `${coupon.code}: ${coupon.description}`,
    });
  };
  
  const removeCoupon = () => {
    setAppliedCoupon(undefined);
    
    toast({
      title: "Coupon removed",
      description: "The coupon has been removed from your order.",
    });
  };
  
  const handleBuyNow = () => {
    toast({
      title: "Processing your order",
      description: "Your order is being processed. Thank you for your purchase!",
    });
  };
  
  return (
    <div className={cn(
      "w-full max-w-sm rounded-2xl bg-white p-6 checkout-shadow transition-all-300",
      className
    )}>
      {/* Header Section */}
      <div className={cn("mb-6", isVisible1 ? "fade-in" : "opacity-0")}>
        <span className="text-xs font-medium text-[hsl(var(--checkout-text-light))] uppercase tracking-wider">
          Order Summary
        </span>
        <h2 className="text-2xl font-medium text-[hsl(var(--checkout-text))] mt-1">
          {formatCurrency(displayTotal)}
        </h2>
      </div>
      
      {/* Share Button */}
      <div className={cn("absolute top-6 right-6", isVisible1 ? "fade-in" : "opacity-0")}>
        <button
          onClick={handleShareClick}
          className="p-2 rounded-full bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--accent))] transition-all-300 hover-lift"
          aria-label="Share"
        >
          <Share className="h-4 w-4 text-[hsl(var(--checkout-text))]" />
        </button>
      </div>
      
      {/* Order Details */}
      <div className={cn("space-y-3 mb-6", isVisible2 ? "fade-in" : "opacity-0")}>
        <div className="flex justify-between text-sm">
          <span className="text-[hsl(var(--checkout-text-light))]">Subtotal</span>
          <span className="font-medium">{formatCurrency(orderSummary.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[hsl(var(--checkout-text-light))]">Shipping</span>
          <span className="font-medium">{formatCurrency(orderSummary.shipping)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[hsl(var(--checkout-text-light))]">Tax</span>
          <span className="font-medium">{formatCurrency(orderSummary.tax)}</span>
        </div>
        
        {appliedCoupon && (
          <div className="flex justify-between text-sm text-[hsl(var(--checkout-discount))]">
            <div className="flex items-center">
              <span>Discount</span>
              <button 
                onClick={removeCoupon}
                className="ml-1 p-0.5 rounded-full hover:bg-red-50 transition-colors"
              >
                <X className="h-3 w-3 text-red-500" />
              </button>
            </div>
            <span className="font-medium">-{formatCurrency(orderSummary.discount)}</span>
          </div>
        )}
        
        <div className="pt-3 border-t border-[hsl(var(--checkout-border))]">
          <div className="flex justify-between font-medium">
            <span className="text-[hsl(var(--checkout-text))]">Total</span>
            <span className="text-[hsl(var(--checkout-text))]">{formatCurrency(orderSummary.total)}</span>
          </div>
        </div>
      </div>
      
      {/* Coupons Section */}
      <div className={cn("mb-6 relative", isVisible3 ? "fade-in" : "opacity-0")}>
        <button
          onClick={() => setShowCoupons(!showCoupons)}
          className="w-full flex items-center justify-between py-3 px-4 rounded-xl border border-[hsl(var(--checkout-border))] bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--accent))] transition-all-300"
        >
          <div className="flex items-center">
            <Tag className="h-4 w-4 mr-2 text-[hsl(var(--checkout-text-light))]" />
            <span className="text-sm font-medium text-[hsl(var(--checkout-text))]">
              {appliedCoupon ? appliedCoupon.code : "Apply Coupon"}
            </span>
          </div>
          {showCoupons ? (
            <ChevronUp className="h-4 w-4 text-[hsl(var(--checkout-text-light))]" />
          ) : (
            <ChevronDown className="h-4 w-4 text-[hsl(var(--checkout-text-light))]" />
          )}
        </button>
      </div>
      
      {/* Buy Now Button */}
      <button
        onClick={handleBuyNow}
        className={cn(
          "w-full py-4 px-6 rounded-xl bg-[hsl(var(--checkout-primary))] hover:bg-[hsl(var(--checkout-primary-dark))] text-white font-medium flex items-center justify-center transition-all-300 hover-lift",
          isVisible4 ? "fade-in" : "opacity-0"
        )}
      >
        <ShoppingBag className="h-4 w-4 mr-2" />
        Buy Now
      </button>
      
      {/* Coupon dropdown positioned after the Buy Now button */}
      {showCoupons && (
        <div 
          ref={couponRef}
          className="absolute z-20 mt-4 w-full left-0 px-6 slide-up"
        >
          <div className="w-full bg-white rounded-xl checkout-shadow border border-[hsl(var(--checkout-border))] p-2">
            <div className="text-xs font-medium text-[hsl(var(--checkout-text-light))] px-2 py-1.5 uppercase tracking-wider">
              Available Offers
            </div>
            <div className="space-y-2 mt-1 max-h-48 overflow-y-auto">
              {availableCoupons.map((coupon) => (
                <button
                  key={coupon.id}
                  onClick={() => applyCoupon(coupon)}
                  className="w-full flex items-center justify-between p-2.5 text-left rounded-lg hover:bg-[hsl(var(--secondary))] transition-all-300"
                >
                  <div className="flex-1">
                    <div className="flex items-center">
                      <Sparkles className="h-3.5 w-3.5 mr-1.5 text-[hsl(var(--checkout-secondary))]" />
                      <span className="text-sm font-medium text-[hsl(var(--checkout-text))]">{coupon.code}</span>
                    </div>
                    <p className="text-xs text-[hsl(var(--checkout-text-light))] mt-0.5">{coupon.description}</p>
                  </div>
                  <div className="pl-2">
                    <Plus className="h-4 w-4 text-[hsl(var(--checkout-text-light))]" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutWidget;
