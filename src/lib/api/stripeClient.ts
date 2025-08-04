import { loadStripe, Stripe } from "@stripe/stripe-js";

const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

export async function createPaymentIntent(amount: number, metadata?: any) {
  try {
    const response = await fetch("/api/checkout/payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount,
        metadata,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  } catch (error) {

    throw error;
  }
}

export async function confirmPayment(clientSecret: string, paymentElement: any) {
  const stripe = await getStripe();
  if (!stripe) throw new Error("Stripe not initialized");

  const { error } = await stripe.confirmPayment({
    elements: paymentElement,
    confirmParams: {
      return_url: `${window.location.origin}/checkout/confirmation`,
    },
  });

  if (error) {
    throw error;
  }
}