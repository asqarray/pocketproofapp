
// This file runs on the server (Vercel Serverless Function)
// It keeps your STRIPE_SECRET_KEY hidden from the browser.

import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { amount, description, successUrl, cancelUrl } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: description || 'PocketProof Service',
              description: 'AI-Powered Medical Bill Audit & Dispute Generation',
            },
            unit_amount: amount, // Amount in cents (e.g., 3900 = $39.00)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl || `${req.headers.origin}/#report?payment=success`,
      cancel_url: cancelUrl || `${req.headers.origin}/#report?payment=cancelled`,
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(500).json({ error: error.message });
  }
}
