import { CartItem, ShippingDetails } from '../types';

// Constants
const BASE_RATE_TIER_1 = 80; // Flat rate for < 1kg
const BASE_RATE_TIER_2 = 100; // Example Base for >= 1kg
const RATE_PER_KG_TIER_2 = 50; // Example increment per Kg over 1kg

export const calculateShipping = (items: CartItem[]): ShippingDetails => {
  const totalWeightGrams = items.reduce((sum, item) => sum + (item.weightGrams * item.quantity), 0);
  const totalWeightKg = totalWeightGrams / 1000;

  let cost = 0;
  let isTier1 = true;

  if (totalWeightKg < 1) {
    // Tier 1: Flat rate
    cost = BASE_RATE_TIER_1;
    isTier1 = true;
  } else {
    // Tier 2: Formulaic (Assumed formula: Base + (Weight - 1) * Rate)
    // Adjust logic as per the specific formula requirement if it was fully provided. 
    // Using a standard logistical formula here.
    cost = BASE_RATE_TIER_2 + (Math.ceil(totalWeightKg - 1) * RATE_PER_KG_TIER_2);
    isTier1 = false;
  }

  return {
    weightKg: totalWeightKg,
    cost: cost,
    isTier1,
  };
};

export const generateWhatsAppLink = (
  items: CartItem[], 
  shipping: ShippingDetails, 
  form: any, 
  orderId: string
): string => {
  const phone = '916302382280';
  
  const itemsList = items.map(item => 
    `- ${item.name} x${item.quantity} (₹${item.price * item.quantity})`
  ).join('%0a');

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const total = subtotal + shipping.cost;

  const message = `
*NEW ORDER: ${orderId}* %0a
---------------------------- %0a
*Customer Details:* %0a
Name: ${form.customerName} %0a
Phone: ${form.phone} %0a
Address: ${form.address}, ${form.city} %0a
District: ${form.district} %0a
State: ${form.state} - ${form.pincode} %0a
---------------------------- %0a
*Order Summary:* %0a
${itemsList} %0a
---------------------------- %0a
Subtotal: ₹${subtotal} %0a
Shipping (${shipping.weightKg.toFixed(2)}kg): ₹${shipping.cost} %0a
*FINAL TOTAL: ₹${total}* %0a
---------------------------- %0a
*Payment Mode:* Pending Verification via WhatsApp %0a
  `.trim();

  return `https://wa.me/${phone}?text=${message}`;
};
