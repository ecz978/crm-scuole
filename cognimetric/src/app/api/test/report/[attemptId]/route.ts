import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { attemptId: string } }) {
  const attempt = await prisma.testAttempt.findUnique({ where: { id: params.attemptId } });
  if (!attempt) return NextResponse.json({ error: "not_found" }, { status: 404 });

  if (attempt.status !== "PAID") {
    return NextResponse.json(
      {
        attemptId: attempt.id,
        status: attempt.status,
        paid: false,
        priceCents: Number(process.env.TEST_REPORT_PRICE_CENTS ?? 100),
        currency: process.env.TEST_REPORT_CURRENCY ?? "eur",
      },
      { status: attempt.status === "SCORED" ? 402 : 409 }
    );
  }

  return NextResponse.json({
    attemptId: attempt.id,
    status: attempt.status,
    paid: true,
    compositeScore: attempt.compositeScore,
    domainScores: attempt.domainScores,
    percentile: attempt.percentile,
    reliabilityFlag: attempt.reliabilityFlag,
  });
}
