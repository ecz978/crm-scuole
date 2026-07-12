const PAYPAL_API_BASE =
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

async function getAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) throw new Error("PayPal credentials are not set");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

export async function createPayPalOrder(
  amountCents: number,
  currency: string,
  attemptId: string,
  returnUrl: string,
  cancelUrl: string
) {
  const token = await getAccessToken();
  const value = (amountCents / 100).toFixed(2);

  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ reference_id: attemptId, amount: { currency_code: currency.toUpperCase(), value } }],
      application_context: { return_url: returnUrl, cancel_url: cancelUrl, user_action: "PAY_NOW", shipping_preference: "NO_SHIPPING" },
    }),
  });
  if (!res.ok) throw new Error(`PayPal order creation failed: ${res.status}`);
  return res.json();
}

export async function capturePayPalOrder(orderId: string) {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`PayPal capture failed: ${res.status}`);
  return res.json();
}
