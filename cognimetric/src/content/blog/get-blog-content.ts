import "server-only";
import type { Locale } from "@/lib/i18n/config";
import type { BlogContent } from "./types";

const loaders: Record<Locale, () => Promise<BlogContent>> = {
  it: () => import("./it").then((m) => m.default),
  en: () => import("./en").then((m) => m.default),
  es: () => import("./es").then((m) => m.default),
  fr: () => import("./fr").then((m) => m.default),
  de: () => import("./de").then((m) => m.default),
};

export async function getBlogContent(locale: Locale): Promise<BlogContent> {
  return (loaders[locale] ?? loaders.en)();
}
