
export enum Role {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
}

export interface User {
  id: string;
  name: string;
  role: Role;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stockCount: number;
  weightGrams: number;
  imageUrl: string;
  description: string;
  category?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ShippingDetails {
  weightKg: number;
  cost: number;
  isTier1: boolean;
}

export interface OrderForm {
  customerName: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  phone: string;
}
