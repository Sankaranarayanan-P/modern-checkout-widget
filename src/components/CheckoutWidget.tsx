
import React, { useState, useRef, useEffect } from "react";
import { Coupon, OrderSummary, Author } from "../types/checkout";
import { availableCoupons, calculateOrderSummary } from "../data/coupons";
import { Share, Star, StarHalf, Tag, ShoppingBag, ChevronDown, ChevronUp, X, Check, Percent } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAnimationSequence, useAnimatedValue } from "@/hooks/use-animation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CheckoutWidgetProps {
  productName?: string;
  initialSubtotal: number;
  className?: string;
  author?: Author;
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
  author = {
    name: "Jacqueline Miller",
    title: "Founder Eduport company",
    rating: 4.5
  },
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
  
  const renderStarRating = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-${i}`} className="h-4 w-4 text-amber-400 fill-amber-400" />
      );
    }
    
    // Half star
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half-star" className="h-4 w-4 text-amber-400 fill-amber-400" />
      );
    }
    
    // Empty stars
    const emptyStarsCount = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStarsCount; i++) {
      stars.push(
        <Star key={`empty-star-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }
    
    return stars;
  };
  
  return (
    <div className={cn(
      "w-full max-w-sm rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-all-300",
      className
    )}>
      {/* Price and Share Section */}
      <div className={cn("flex justify-between items-center mb-6", isVisible1 ? "fade-in" : "opacity-0")}>
        <h2 className="text-3xl font-bold text-gray-900">
          {formatCurrency(displayTotal)}
        </h2>
        <button
          onClick={handleShareClick}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Share"
        >
          <Share className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      
      {/* Buy Now Button */}
      <button
        onClick={handleBuyNow}
        className={cn(
          "w-full py-3.5 px-6 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium flex items-center justify-center transition-all-300 hover-lift mb-6",
          isVisible2 ? "fade-in" : "opacity-0"
        )}
      >
        <ShoppingBag className="h-4 w-4 mr-2" />
        Buy now
      </button>
      
      {/* Available Offers Section */}
      <div className={cn("mb-6", isVisible3 ? "fade-in" : "opacity-0")}>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Available Offers?</h3>
        <div className="space-y-2" ref={couponRef}>
          {appliedCoupon ? (
            <div className="rounded-lg border border-indigo-100 bg-indigo-50">
              <div className="p-3.5 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 mr-3">
                      <Check className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold text-indigo-700">{appliedCoupon.code}</span>
                        <Badge variant="outline" className="ml-2 bg-indigo-100 text-indigo-700 border-0">
                          Applied
                        </Badge>
                      </div>
                      <p className="text-sm text-indigo-600 mt-0.5">{appliedCoupon.description}</p>
                    </div>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-indigo-500 hover:text-indigo-700 p-1 rounded-full hover:bg-indigo-100 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : !showCoupons ? (
            <button
              onClick={() => setShowCoupons(true)}
              className="w-full block focus:outline-none"
            >
              <div className="w-full rounded-lg border border-gray-200 p-3.5 text-left relative pr-10 hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 mr-3">
                    <Percent className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Select a coupon</span>
                    <p className="text-sm text-gray-500 mt-0.5">Apply discount to your order</p>
                  </div>
                </div>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowCoupons(false)}
                className="w-full block focus:outline-none mb-2"
              >
                <div className="w-full rounded-lg border border-gray-200 p-3.5 text-left relative pr-10">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-100 mr-3">
                      <Percent className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Select a coupon</span>
                      <p className="text-sm text-gray-500 mt-0.5">Apply discount to your order</p>
                    </div>
                  </div>
                  <ChevronUp className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </button>
              
              {/* Coupon options */}
              <div className="w-full bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden divide-y divide-gray-100">
                {availableCoupons.map((coupon) => (
                  <button
                    key={coupon.id}
                    onClick={() => applyCoupon(coupon)}
                    className="w-full flex items-center p-3.5 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-purple-100 mr-3">
                      <Tag className="h-4 w-4 text-purple-600 rotate-[15deg]" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-700">{coupon.code}</div>
                      <p className="text-sm text-gray-500 mt-0.5">{coupon.description}</p>
                    </div>
                    {coupon.expiresAt && (
                      <Badge variant="outline" className="ml-auto text-xs bg-gray-50 text-gray-600 border-0">
                        Expires {new Date(coupon.expiresAt).toLocaleDateString()}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Author Section */}
      {author && (
        <div className={cn("pt-5 border-t border-gray-100", isVisible4 ? "fade-in" : "opacity-0")}>
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-300 to-purple-300 mr-3">
              {author.avatarUrl ? (
                <img src={author.avatarUrl} alt={author.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-medium">
                  {author.name.substring(0, 1)}
                </div>
              )}
            </div>
            <div>
              <div className="text-base font-semibold text-gray-900">By {author.name}</div>
              <div className="text-sm text-gray-500">{author.title}</div>
            </div>
          </div>
          
          {author.rating && (
            <div className="flex items-center mt-3">
              <div className="flex space-x-0.5 mr-2">
                {renderStarRating(author.rating)}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {author.rating}/5.0
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutWidget;
