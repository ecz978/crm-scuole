// lib/audit.ts
import { prisma } from "@/lib/prisma";

interface AuditParams {
  scuolaId: string;
  userId: string;
  userEmail: string;
  azione: "CREATE" | "READ" | "UPDATE" | "DELETE";
  collezione: string;
  documentoId?: string;
  dettagli?: object;
  ip?: string;
  userAgent?: string;
}

export async function logAudit(params: AuditParams) {
  try {
    await prisma.auditLog.create({ data: params });
  } catch (e) {
    console.error("Audit log error:", e);
  }
}
