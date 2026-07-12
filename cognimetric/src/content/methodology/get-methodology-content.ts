import "server-only";
import type { Locale } from "@/lib/i18n/config";
import type { MethodologyContent } from "./types";

const loaders: Record<Locale, () => Promise<MethodologyContent>> = {
  it: () => import("./it").then((m) => m.default),
  en: () => import("./en").then((m) => m.default),
  es: () => import("./es").then((m) => m.default),
  fr: () => import("./fr").then((m) => m.default),
  de: () => import("./de").then((m) => m.default),
};

export async function getMethodologyContent(locale: Locale): Promise<MethodologyContent> {
  return (loaders[locale] ?? loaders.en)();
}
