import { z } from 'zod';

/**
 * Shared validation schemas for all forms.
 * These are used with react-hook-form or standalone zod .parse().
 */

// ─── Auth ──────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

// ─── Checkout ──────────────────────────────────────────────────
export const checkoutSchema = z.object({
  cardName: z.string().min(2, 'Cardholder name is required').max(100),
  cardNumber: z
    .string()
    .min(1, 'Card number is required')
    .regex(/^[\d\s]{13,19}$/, 'Enter a valid card number (13-19 digits)')
    .refine((val) => {
      const digits = val.replace(/\s/g, '');
      return digits.length >= 13 && digits.length <= 19;
    }, 'Card number must be 13-19 digits'),
  expiryDate: z
    .string()
    .min(1, 'Expiry date is required')
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format'),
  cvv: z
    .string()
    .min(1, 'CVV is required')
    .regex(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
});

export const upiSchema = z.object({
  upiId: z
    .string()
    .min(1, 'UPI ID is required')
    .regex(/^[\w.\-]+@[\w]+$/, 'Enter a valid UPI ID (e.g. name@upi)'),
});

// ─── Pickup Request ────────────────────────────────────────────
export const pickupSchema = z.object({
  address: z.string().min(5, 'Enter a complete address').max(500),
  city: z.string().min(2, 'City is required').max(100),
  scheduledDate: z.string().min(1, 'Please select a pickup date'),
  notes: z.string().max(1000).optional(),
  items: z
    .array(
      z.object({
        deviceType: z.string().min(1, 'Device type is required'),
        quantity: z.number().int().positive().max(50),
        condition: z.string().optional(),
      })
    )
    .min(1, 'Add at least one item for pickup'),
});

// ─── Product Sell Modal ────────────────────────────────────────
export const sellItemSchema = z.object({
  deviceType: z.string().min(1, 'Select a device type'),
  condition: z.enum(['Excellent', 'Good', 'Fair'], {
    errorMap: () => ({ message: 'Select device condition' }),
  }),
  description: z.string().min(10, 'Describe the device (min 10 characters)').max(1000),
  askingPrice: z.number().int().positive().max(500000),
});

// ─── Review ────────────────────────────────────────────────────
export const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

/**
 * Format a card number by adding spaces every 4 digits.
 */
export function formatCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
}

/**
 * Format expiry date as MM/YY.
 */
export function formatExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  }
  return digits;
}

/**
 * Validate a Luhn card number (basic check).
 */
export function isValidCardNumber(number) {
  const digits = number.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}
