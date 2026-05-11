"use client";
// app/dashboard/page.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Users, Upload, Search, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Studente {
  id: string;
  cognome: string;
  nome: string;
  classe: string;
  percorso: string;
  sede: string;
  email: string;
  codFiscale: string;
  dsa: boolean;
  disabilita: boolean;
}

interface Stats {
  totale: number;
  perSede: Record<string, number>;
  perPercorso: Record<string, number>;
  dsa: number;
  disabilita: number;
}

export default function Dashboard() {
  const router = useRouter();
  const [studenti, setStudenti] = useState<Studente[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [sede, setSede] = useState("");
  const [percorso, setPercorso] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudenti();
  }, [q, sede, percorso, page]);

  const fetchStudenti = async () => {
    setLoading(true);
    const params = new URLSearchParams({ q, sede, percorso, page: String(page), limit: "50" });
    const res = await fetch(`/api/studenti?${params}`);
    const data = await res.json();
    setStudenti(data.studenti || []);
    setTotal(data.total || 0);
    setPages(data.pages || 1);
    setLoading(false);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        {/* Topbar */}
        <div className="topbar">
          <div style={{ fontSize: 15, fontWeight: 600 }}>Studenti</div>
          <div style={{ display: "flex", gap: 8 }}>
            <Link href="/import" className="btn btn-secondary btn-sm">
              <Upload size={14} /> Import Spaggiari
            </Link>
            <Link href="/studenti/nuovo" className="btn btn-primary btn-sm">
              <Plus size={14} /> Nuovo studente
            </Link>
          </div>
        </div>

        <div className="page">
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
            <StatCard label="Totale studenti" value={total} icon={<Users size={18} />} />
            <StatCard label="Con DSA" value={studenti.filter(s => s.dsa).length} color="var(--warning)" />
            <StatCard label="Con disabilità" value={studenti.filter(s => s.disabilita).length} color="var(--danger)" />
            <StatCard label="Sedi attive" value={new Set(studenti.map(s => s.sede).filter(Boolean)).size} color="var(--success)" />
          </div>

          {/* Filtri */}
          <div className="surface" style={{ padding: "12px 16px", marginBottom: 12, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 240px" }}>
              <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                className="input"
                placeholder="Cerca per nome, cognome, CF..."
                value={q}
                onChange={e => { setQ(e.target.value); setPage(1); }}
                style={{ paddingLeft: 32, width: "100%" }}
              />
            </div>
            <select className="input" value={sede} onChange={e => { setSede(e.target.value); setPage(1); }} style={{ flex: "0 1 160px" }}>
              <option value="">Tutte le sedi</option>
              <option value="Lodi">Lodi</option>
              <option value="Codogno">Codogno</option>
            </select>
            <select className="input" value={percorso} onChange={e => { setPercorso(e.target.value); setPage(1); }} style={{ flex: "0 1 180px" }}>
              <option value="">Tutti i percorsi</option>
              <option value="Informatica">Informatica</option>
              <option value="Cucina">Cucina</option>
              <option value="Acconciatura">Acconciatura</option>
              <option value="Estetica">Estetica</option>
              <option value="Moda">Moda</option>
            </select>
            {(q || sede || percorso) && (
              <button className="btn btn-secondary btn-sm" onClick={() => { setQ(""); setSede(""); setPercorso(""); setPage(1); }}>
                Reset
              </button>
            )}
          </div>

          {/* Tabella */}
          <div className="surface" style={{ overflow: "hidden" }}>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Studente</th>
                    <th>Classe</th>
                    <th>Percorso</th>
                    <th>Sede</th>
                    <th>Email</th>
                    <th>Flag</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>Caricamento...</td></tr>
                  ) : studenti.length === 0 ? (
                    <tr><td colSpan={7} style={{ textAlign: "center", padding: 32, color: "var(--text-muted)" }}>
                      {total === 0 ? "Nessuno studente. Importa da Spaggiari o aggiungi manualmente." : "Nessun risultato."}
                    </td></tr>
                  ) : (
                    studenti.map(s => (
                      <tr key={s.id} onClick={() => router.push(`/studenti/${s.id}`)}>
                        <td>
                          <div style={{ fontWeight: 500 }}>{s.cognome} {s.nome}</div>
                          {s.codFiscale && <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{s.codFiscale}</div>}
                        </td>
                        <td>{s.classe || "—"}</td>
                        <td>{s.percorso || "—"}</td>
                        <td>{s.sede || "—"}</td>
                        <td style={{ fontSize: 12 }}>{s.email || "—"}</td>
                        <td>
                          <div style={{ display: "flex", gap: 4 }}>
                            {s.dsa && <span className="badge badge-yellow">DSA</span>}
                            {s.disabilita && <span className="badge badge-red">Dis.</span>}
                          </div>
                        </td>
                        <td><ChevronRight size={16} color="var(--text-muted)" /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginazione */}
            {pages > 1 && (
              <div className="pagination">
                <button className="page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</button>
                {Array.from({ length: Math.min(7, pages) }, (_, i) => {
                  const p = page <= 4 ? i + 1 : page - 3 + i;
                  if (p < 1 || p > pages) return null;
                  return (
                    <button key={p} className={`page-btn ${p === page ? "active" : ""}`} onClick={() => setPage(p)}>{p}</button>
                  );
                })}
                <button className="page-btn" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}>→</button>
                <span style={{ marginLeft: 8, fontSize: 12, color: "var(--text-muted)" }}>
                  {total} studenti totali
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color = "var(--accent)" }: any) {
  return (
    <div className="surface" style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>{label}</div>
          <div style={{ fontSize: 26, fontWeight: 600, color }}>{value}</div>
        </div>
        {icon && <div style={{ color }}>{icon}</div>}
      </div>
    </div>
  );
}