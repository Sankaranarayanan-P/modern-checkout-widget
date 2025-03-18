
export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountPercentage: number;
  expiresAt?: string;
  isValid: boolean;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}
