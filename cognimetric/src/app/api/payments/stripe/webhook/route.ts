import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

// Stripe requires the raw body to verify the webhook signature, so this route
// must not run through any JSON body-parsing middleware.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) return NextResponse.json({ error: "missing_signature" }, { status: 400 });

  const rawBody = await req.text();
  const stripe = getStripe();

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch (err) {
    return NextResponse.json({ error: `signature_verification_failed` }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as { id: string; metadata?: { attemptId?: string } };
    const attemptId = session.metadata?.attemptId;
    if (attemptId) {
      await prisma.$transaction([
        prisma.payment.updateMany({ where: { providerRef: session.id }, data: { status: "PAID" } }),
        prisma.testAttempt.update({ where: { id: attemptId }, data: { status: "PAID" } }),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
