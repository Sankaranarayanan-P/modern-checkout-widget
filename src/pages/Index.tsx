
import React, { useState } from "react";
import CheckoutWidget from "@/components/CheckoutWidget";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const ProductCard = ({ className }: { className?: string }) => (
  <div className={cn("w-full max-w-md p-4", className)}>
    <div className="aspect-square bg-stone-100 rounded-3xl mb-6 overflow-hidden">
      <div className="w-full h-full bg-gradient-to-b from-blue-50 to-purple-50 flex items-center justify-center">
        <span className="text-sm text-muted-foreground">Product Image</span>
      </div>
    </div>
    <h1 className="text-3xl font-medium text-stone-900 tracking-tight">Premium Wireless Headphones</h1>
    <p className="text-stone-500 mt-2 mb-4 leading-relaxed">
      Experience immersive sound with our premium wireless headphones. 
      Featuring active noise cancellation, 40-hour battery life, and premium materials.
    </p>
    <div className="flex items-baseline space-x-2 mb-4">
      <span className="text-2xl font-semibold">$249.99</span>
      <span className="text-sm line-through text-muted-foreground">$299.99</span>
      <span className="text-xs font-medium bg-green-100 text-green-800 rounded-full px-2 py-0.5">
        Save 17%
      </span>
    </div>
  </div>
);

const Index = () => {
  const [subtotal] = useState(249.99);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-xs uppercase tracking-widest text-center text-stone-500 font-medium mb-2">Premium Experience</h1>
        <div className="text-4xl font-medium text-center mb-16">Product Checkout</div>
        
        <div className="flex flex-col lg:flex-row justify-center items-start gap-8 max-w-6xl mx-auto">
          <ProductCard className="lg:flex-1" />
          
          <div className="hidden lg:block">
            <Separator orientation="vertical" />
          </div>
          
          <div className="lg:hidden w-full">
            <Separator />
          </div>
          
          <div className="flex-1 flex justify-center items-start">
            <CheckoutWidget 
              productName="Premium Wireless Headphones" 
              initialSubtotal={subtotal} 
              className="sticky top-8" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
