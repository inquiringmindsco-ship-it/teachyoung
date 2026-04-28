---

## Likeness™ Apparel (FROZEN — Apr 23, 2026)
- URL: https://likenessverified.com/apparel
- Stripe LIVE mode sk_live key configured
- STRIPE_WEBHOOK_SECRET added to Vercel env
- apparel_orders: 23-field schema (migration 032)
- `shipping_address_collection` on checkout
- Webhook fires on checkout.session.completed → writes apparel_orders
- inject-order deleted from production
- Printful NOT auto-triggered (manual sync only)
- CONFIRMED: Real payment E2E proven end-to-end
  - pi_3TPWNLRz80LUYyCU0qXowJyq, $34.00, shipping: 612 Brotherton, Ferguson MO
