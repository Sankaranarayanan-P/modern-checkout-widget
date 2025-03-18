
import { Coupon } from "../types/checkout";

export const availableCoupons: Coupon[] = [
  {
    id: "1",
    code: "WELCOME20",
    description: "20% off your first purchase",
    discountPercentage: 20,
    expiresAt: "2024-12-31",
    isValid: true,
  },
  {
    id: "2",
    code: "SUMMER10",
    description: "10% off summer collection",
    discountPercentage: 10,
    expiresAt: "2024-08-31",
    isValid: true,
  },
  {
    id: "3",
    code: "FREESHIP",
    description: "Free shipping on orders over $50",
    discountPercentage: 0,
    isValid: true,
  },
];

export const calculateOrderSummary = (subtotal: number, appliedCoupon?: Coupon) => {
  const shipping = 5.99;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  
  let discount = 0;
  if (appliedCoupon && appliedCoupon.isValid) {
    discount = subtotal * (appliedCoupon.discountPercentage / 100);
  }
  
  // If FREESHIP coupon is applied and subtotal > 50, remove shipping cost
  if (appliedCoupon?.code === "FREESHIP" && subtotal >= 50) {
    return {
      subtotal,
      shipping: 0,
      tax,
      discount,
      total: subtotal + tax - discount
    };
  }
  
  return {
    subtotal,
    shipping,
    tax,
    discount,
    total: subtotal + shipping + tax - discount
  };
};
