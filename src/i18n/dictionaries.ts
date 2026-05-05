import "server-only";
import type { Locale } from "./config";
import type { Dictionary } from "@/types/dictionary";

const dictionaries = {
  en: () => import("./locales/en.json").then((module) => module.default as Dictionary),
  es: () => import("./locales/es.json").then((module) => module.default as Dictionary),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => dictionaries[locale]();
