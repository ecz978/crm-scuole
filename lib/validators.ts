// lib/validators.ts
import { z } from "zod";

// ─── Codice Fiscale ───────────────────────────────────────────
export function isValidCF(cf: string): boolean {
  if (!cf || cf.length !== 16) return false;
  const regex = /^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/i;
  if (!regex.test(cf)) return false;

  const dispari = "BAKPLCQDREVOSFTGUHMINJWZYX";
  const pari    = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let sum = 0;
  for (let i = 0; i < 15; i++) {
    const c = cf.toUpperCase().charCodeAt(i);
    const d = c >= 48 && c <= 57 ? c - 48 : c - 65;
    sum += i % 2 === 0
      ? dispari.charCodeAt(d >= 10 ? d - 10 : d) - 65
      : (c >= 48 && c <= 57 ? d : d);
  }
  return String.fromCharCode((sum % 26) + 65) === cf.toUpperCase()[15];
}

// ─── IBAN ─────────────────────────────────────────────────────
export function isValidIBAN(iban: string): boolean {
  const clean = iban.replace(/\s/g, "").toUpperCase();
  if (!/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/.test(clean)) return false;
  const rearr = clean.slice(4) + clean.slice(0, 4);
  let num = "";
  for (const c of rearr) {
    num += c >= "A" ? String(c.charCodeAt(0) - 55) : c;
  }
  let rem = 0;
  for (const d of num) {
    rem = (rem * 10 + parseInt(d)) % 97;
  }
  return rem === 1;
}

// ─── Zod Schemas ─────────────────────────────────────────────

export const studenteSchema = z.object({
  cognome: z.string().min(1, "Cognome obbligatorio"),
  nome: z.string().min(1, "Nome obbligatorio"),
  dataNascita: z.string().nullable().optional(),
  codFiscale: z
    .string()
    .nullable()
    .optional()
    .refine((v) => !v || isValidCF(v), "Codice fiscale non valido"),
  email: z.string().email("Email non valida").nullable().optional().or(z.literal("")),
  email2: z.string().email("Email 2 non valida").nullable().optional().or(z.literal("")),
  telefono: z.string().nullable().optional(),
  cellulare: z.string().nullable().optional(),
  classe: z.string().nullable().optional(),
  percorso: z.string().nullable().optional(),
  sede: z.string().nullable().optional(),
  annoScolastico: z.string().nullable().optional(),
});

export const genitoreSchema = z.object({
  cognome: z.string().min(1, "Cognome obbligatorio"),
  nome: z.string().min(1, "Nome obbligatorio"),
  parentela: z.string().min(1, "Parentela obbligatoria"),
  codFiscale: z
    .string()
    .nullable()
    .optional()
    .refine((v) => !v || isValidCF(v), "Codice fiscale non valido"),
  email1: z.string().email("Email non valida").nullable().optional().or(z.literal("")),
  iban: z
    .string()
    .nullable()
    .optional()
    .refine((v) => !v || isValidIBAN(v), "IBAN non valido"),
});

export type StudenteInput = z.infer<typeof studenteSchema>;
export type GenitoreInput = z.infer<typeof genitoreSchema>;
