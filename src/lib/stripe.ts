import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with the publishable key from environment variables
// This key is safe to expose to the client
export const stripePromise = loadStripe((import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY || '');
