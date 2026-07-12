import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionary-type";

const loaders: Record<Locale, () => Promise<Dictionary>> = {
  it: () => import("./dictionaries/it").then((m) => m.default),
  en: () => import("./dictionaries/en").then((m) => m.default),
  es: () => import("./dictionaries/es").then((m) => m.default),
  fr: () => import("./dictionaries/fr").then((m) => m.default),
  de: () => import("./dictionaries/de").then((m) => m.default),
};

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const loader = loaders[locale] ?? loaders.en;
  return loader();
}
