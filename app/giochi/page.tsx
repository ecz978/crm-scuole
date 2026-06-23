"use client";
import Link from "next/link";
import Sidebar from "@/components/layout/Sidebar";
import { Type, ChevronRight } from "lucide-react";

export default function GiochiPage() {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <div style={{ fontSize: 15, fontWeight: 600 }}>Giochi</div>
        </div>
        <div className="page">
          <Link
            href="/giochi/parole"
            className="surface"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              padding: 18,
              maxWidth: 480,
              textDecoration: "none",
              color: "var(--text)",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: "var(--accent-light)",
                color: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Type size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>Parole</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                Componi quante più parole possibili con le lettere a disposizione. Nuovo gioco ogni giorno.
              </div>
            </div>
            <ChevronRight size={18} color="var(--text-muted)" />
          </Link>
        </div>
      </div>
    </div>
  );
}
