import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { gradeAttempt, type AnswerInput } from "@/lib/test/grade-attempt";
import { isLocale } from "@/lib/i18n/config";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.attemptId || !Array.isArray(body?.answers)) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const attempt = await prisma.testAttempt.findUnique({ where: { id: body.attemptId } });
  if (!attempt) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (attempt.status !== "IN_PROGRESS") {
    return NextResponse.json({ attemptId: attempt.id, status: attempt.status });
  }
  if (!isLocale(attempt.locale)) return NextResponse.json({ error: "invalid_locale" }, { status: 400 });

  const answers: AnswerInput[] = body.answers;
  const { graded, scoring } = gradeAttempt(attempt.seed, attempt.locale, answers);

  await prisma.$transaction([
    prisma.answer.createMany({
      data: graded.map((g) => ({
        attemptId: attempt.id,
        domain: g.domain,
        itemId: g.itemId,
        correct: g.correct,
        responseMs: g.responseMs,
        difficulty: g.difficulty,
      })),
    }),
    prisma.testAttempt.update({
      where: { id: attempt.id },
      data: {
        status: "SCORED",
        submittedAt: new Date(),
        compositeScore: scoring.compositeScore,
        domainScores: scoring.domainScores,
        percentile: scoring.percentile,
        reliabilityFlag: scoring.reliabilityFlag,
        email: typeof body.email === "string" && body.email.includes("@") ? body.email : undefined,
      },
    }),
  ]);

  return NextResponse.json({
    attemptId: attempt.id,
    status: "SCORED",
    priceCents: Number(process.env.TEST_REPORT_PRICE_CENTS ?? 100),
    currency: process.env.TEST_REPORT_CURRENCY ?? "eur",
  });
}
