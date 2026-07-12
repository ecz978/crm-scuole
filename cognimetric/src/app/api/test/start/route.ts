import { randomUUID, createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { buildAttemptItems } from "@/lib/test/build-attempt";
import { stripAnswer } from "@/lib/test/types";
import { DOMAIN_CONFIG, DOMAINS } from "@/lib/test/types";
import { isLocale, defaultLocale } from "@/lib/i18n/config";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const locale = isLocale(body?.locale) ? body.locale : defaultLocale;

  const seed = randomUUID();
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const ipHash = createHash("sha256").update(ip).digest("hex");
  const userAgent = req.headers.get("user-agent") ?? undefined;

  const attempt = await prisma.testAttempt.create({
    data: {
      id: seed,
      seed,
      locale,
      consentGiven: true,
      consentAt: new Date(),
      ipHash,
      userAgent,
    },
  });

  const itemsByDomain = buildAttemptItems(seed, locale);
  const items = Object.fromEntries(
    Object.entries(itemsByDomain).map(([domain, list]) => [domain, list.map(stripAnswer)])
  );

  return NextResponse.json({
    attemptId: attempt.id,
    domains: DOMAINS,
    domainConfig: DOMAIN_CONFIG,
    items,
  });
}
