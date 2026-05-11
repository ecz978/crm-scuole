"use client";
// app/import/page.tsx
import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import * as XLSX from "xlsx";
import { Upload, ArrowRight, CheckCircle, AlertCircle, Save } from "lucide-react";

// Tutti i campi CRM disponibili per il mapping
const CRM_FIELDS = [
  { value: "", label: "— Non importare —" },
  { value: "cognome", label: "Cognome" },
  { value: "nome", label: "Nome" },
  { value: "dataNascita", label: "Data di nascita" },
  { value: "sesso", label: "Sesso" },
  { value: "luogoNascita", label: "Luogo di nascita" },
  { value: "provinciaNascita", label: "Provincia nascita" },
  { value: "statoNascita", label: "Stato nascita" },
  { value: "codFiscale", label: "Codice fiscale" },
  { value: "codiceSidi", label: "Codice SIDI" },
  { value: "matricola", label: "Matricola" },
  { value: "cittadinanza1", label: "Prima cittadinanza" },
  { value: "cittadinanza2", label: "Seconda cittadinanza" },
  { value: "email", label: "Email" },
  { value: "email2", label: "Email 2" },
  { value: "pec", label: "PEC" },
  { value: "telefono", label: "Telefono" },
  { value: "cellulare", label: "Cellulare" },
  { value: "comuneResidenza", label: "Comune residenza" },
  { value: "provinciaResidenza", label: "Provincia residenza" },
  { value: "indirizzoResidenza", label: "Indirizzo residenza" },
  { value: "capResidenza", label: "CAP residenza" },
  { value: "codiceCatastale", label: "Codice catastale" },
  { value: "comuneRecapito", label: "Comune recapito" },
  { value: "provinciaRecapito", label: "Provincia recapito" },
  { value: "indirizzoRecapito", label: "Indirizzo recapito" },
  { value: "capRecapito", label: "CAP recapito" },
  { value: "annoScolastico", label: "Anno scolastico" },
  { value: "classe", label: "Classe" },
  { value: "sezione", label: "Sezione" },
  { value: "percorso", label: "Percorso" },
  { value: "sede", label: "Sede" },
  { value: "indirizzoStudi", label: "Indirizzo studi" },
  { value: "annoCorso", label: "Anno corso" },
  { value: "scuolaProvenienza", label: "Scuola provenienza" },
  { value: "scuolaProvMecc", label: "Codice mecc. provenienza" },
  { value: "denominazioneIst", label: "Denominazione ist. provenienza" },
  { value: "indirizzoScuolaMedia", label: "Indirizzo scuola media" },
  { value: "indirizzoIstProv", label: "Indirizzo ist. provenienza" },
  { value: "ultimaAnnualita", label: "Ultima annualità" },
  { value: "ultimoAnnoScol", label: "Ultimo anno scol." },
  { value: "esitoProvenienza", label: "Esito provenienza" },
  { value: "annoConsequimentoMedia", label: "Anno conseguimento media" },
  { value: "statoAlunno", label: "Stato alunno" },
  { value: "mezzoTrasporto1", label: "Mezzo trasporto 1" },
  { value: "mezzoTrasporto2", label: "Mezzo trasporto 2" },
  { value: "annoArrivoItalia", label: "Anno arrivo Italia" },
  { value: "note", label: "Note" },
  { value: "noteAlunno", label: "Note alunno" },
  { value: "lingua1", label: "Lingua studiata 1" },
  { value: "lingua2", label: "Lingua studiata 2" },
  { value: "lingua3", label: "Lingua studiata 3" },
  { value: "strumento1", label: "Strumento scelto 1" },
  { value: "strumento2", label: "Strumento scelto 2" },
  { value: "strumento3", label: "Strumento scelto 3" },
  { value: "campo1Anagrafe", label: "Campo 1 anagrafe" },
  { value: "campo2Anagrafe", label: "Campo 2 anagrafe" },
  { value: "campo3Anagrafe", label: "Campo 3 anagrafe" },
  { value: "campo4Anagrafe", label: "Campo 4 anagrafe" },
  { value: "campo5Anagrafe", label: "Campo 5 anagrafe" },
  { value: "campo6Anagrafe", label: "Campo 6 anagrafe" },
  { value: "campo7Anagrafe", label: "Campo 7 anagrafe" },
  { value: "campo8Anagrafe", label: "Campo 8 anagrafe" },
  { value: "campoAgg1", label: "Campo aggiuntivo 1" },
  { value: "campoAgg2", label: "Campo aggiuntivo 2" },
  { value: "campoAgg3", label: "Campo aggiuntivo 3" },
  { value: "campoAgg4", label: "Campo aggiuntivo 4" },
  { value: "campoAgg5", label: "Campo aggiuntivo 5" },
  { value: "campoAgg6", label: "Campo aggiuntivo 6" },
  { value: "campoAgg7", label: "Campo aggiuntivo 7" },
  { value: "campoAgg8", label: "Campo aggiuntivo 8" },
];

// Auto-matching euristico colonne Spaggiari → campi CRM
function autoMatch(colonna: string): string {
  const c = colonna.toLowerCase().trim();
  const map: Record<string, string> = {
    "cognome": "cognome",
    "nome": "nome",
    "data nascita": "dataNascita",
    "data di nascita": "dataNascita",
    "sesso": "sesso",
    "luogo nascita semplice": "luogoNascita",
    "luogo nascita": "luogoNascita",
    "provincia nascita": "provinciaNascita",
    "stato nascita": "statoNascita",
    "codice fiscale": "codFiscale",
    "cod alunno sidi": "codiceSidi",
    "matricola": "matricola",
    "prima cittadinanza": "cittadinanza1",
    "seconda cittadinanza": "cittadinanza2",
    "email": "email",
    "email 2": "email2",
    "pec": "pec",
    "telefono": "telefono",
    "cellulare": "cellulare",
    "comune residenza": "comuneResidenza",
    "provincia residenza": "provinciaResidenza",
    "indirizzo residenza": "indirizzoResidenza",
    "cap residenza": "capResidenza",
    "comune recapito": "comuneRecapito",
    "provincia recapito": "provinciaRecapito",
    "indirizzo recapito": "indirizzoRecapito",
    "cap recapito": "capRecapito",
    "anno scolastico": "annoScolastico",
    "classe": "classe",
    "sezione": "sezione",
    "sede": "sede",
    "indirizzo studi": "indirizzoStudi",
    "anno corso": "annoCorso",
    "scuola provenienza": "scuolaProvenienza",
    "stato alunno": "statoAlunno",
    "note": "note",
    "note alunno": "noteAlunno",
    "lingua studiata 1": "lingua1",
    "lingua studiata 2": "lingua2",
    "lingua studiata 3": "lingua3",
    "strumento scelto 1": "strumento1",
    "strumento scelto 2": "strumento2",
    "strumento scelto 3": "strumento3",
    "mezzo trasporto 1": "mezzoTrasporto1",
    "mezzo trasporto 2": "mezzoTrasporto2",
    "anno arrivo in italia": "annoArrivoItalia",
    "campo 1 anagrafe": "campo1Anagrafe",
    "campo 2 anagrafe": "campo2Anagrafe",
    "campo aggiuntivo 1": "campoAgg1",
    "campo aggiuntivo 2": "campoAgg2",
  };
  return map[c] || "";
}

export default function ImportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [file, setFile] = useState<File | null>(null);
  const [colonne, setColonne] = useState<string[]>([]);
  const [righe, setRighe] = useState<any[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  if (status === "loading") return null;
  if (!session) { router.push("/login"); return null; }

  const user = session.user as any;
  if (!["DIRIGENTE", "VICEPRESIDE"].includes(user.ruolo)) {
    return <div style={{ padding: 40 }}>Accesso non autorizzato.</div>;
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const wb = XLSX.read(ev.target?.result, { type: "binary", cellDates: true });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(ws, { raw: false, dateNF: "yyyy-mm-dd" });
      if (rows.length === 0) return;

      const cols = Object.keys(rows[0]);
      setColonne(cols);
      setRighe(rows);

      // Auto-match
      const autoMapped: Record<string, string> = {};
      for (const col of cols) {
        const match = autoMatch(col);
        if (match) autoMapped[col] = match;
      }
      setMapping(autoMapped);
      setStep(2);
    };
    reader.readAsBinaryString(f);
  };

  const handlePreview = async () => {
    setLoading(true);
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ righe, mapping, preview: true, nomeFile: file?.name }),
    });
    const data = await res.json();
    setPreview(data);
    setStep(3);
    setLoading(false);
  };

  const handleImport = async () => {
    setLoading(true);
    const res = await fetch("/api/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ righe, mapping, preview: false, nomeFile: file?.name }),
    });
    const data = await res.json();
    setResult(data);
    setStep(4);
    setLoading(false);
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <div style={{ fontSize: 15, fontWeight: 600 }}>Import da Spaggiari</div>
        </div>

        <div className="page" style={{ maxWidth: 900 }}>
          {/* Stepper */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 28 }}>
            {["Carica file", "Mapping campi", "Anteprima", "Risultato"].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{
                  width: 28, height: 28,
                  borderRadius: "50%",
                  background: step > i + 1 ? "var(--success)" : step === i + 1 ? "var(--accent)" : "var(--border)",
                  color: step >= i + 1 ? "white" : "var(--text-muted)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 600,
                }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <div style={{ fontSize: 12, marginLeft: 6, color: step === i + 1 ? "var(--text)" : "var(--text-muted)", marginRight: 12 }}>
                  {label}
                </div>
                {i < 3 && <div style={{ width: 24, height: 1, background: "var(--border)", marginRight: 12 }} />}
              </div>
            ))}
          </div>

          {/* Step 1: Upload */}
          {step === 1 && (
            <div className="surface" style={{ padding: 40, textAlign: "center" }}>
              <Upload size={36} style={{ color: "var(--text-muted)", marginBottom: 16 }} />
              <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Carica il file di Spaggiari</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 24 }}>
                Formato supportato: Excel (.xlsx, .xls) o CSV
              </div>
              <label className="btn btn-primary" style={{ cursor: "pointer" }}>
                Scegli file
                <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} style={{ display: "none" }} />
              </label>
            </div>
          )}

          {/* Step 2: Mapping */}
          {step === 2 && (
            <div>
              <div className="surface" style={{ padding: 16, marginBottom: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{file?.name}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{righe.length} righe · {colonne.length} colonne</div>
              </div>

              {/* Anteprima dati */}
              <div className="section-card" style={{ marginBottom: 16 }}>
                <div className="section-header">Anteprima prime 3 righe</div>
                <div className="section-body" style={{ overflowX: "auto", padding: 0 }}>
                  <table style={{ fontSize: 12 }}>
                    <thead>
                      <tr>
                        {colonne.slice(0, 8).map(c => <th key={c} style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis" }}>{c}</th>)}
                        {colonne.length > 8 && <th>+{colonne.length - 8} altre</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {righe.slice(0, 3).map((r, i) => (
                        <tr key={i}>
                          {colonne.slice(0, 8).map(c => <td key={c} style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r[c] || "—"}</td>)}
                          {colonne.length > 8 && <td>...</td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mapping */}
              <div className="section-card" style={{ marginBottom: 16 }}>
                <div className="section-header">
                  Mappa le colonne
                  <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 400, color: "var(--success)" }}>
                    {Object.values(mapping).filter(Boolean).length}/{colonne.length} mappate
                  </span>
                </div>
                <div className="section-body">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "8px 12px", alignItems: "center" }}>
                    {colonne.map(col => (
                      <>
                        <div key={`col-${col}`} style={{ fontSize: 13, fontFamily: "var(--font-mono)", background: "var(--bg)", padding: "6px 10px", borderRadius: 4 }}>
                          {col}
                        </div>
                        <ArrowRight key={`arr-${col}`} size={14} color="var(--text-muted)" />
                        <select
                          key={`sel-${col}`}
                          className="input"
                          value={mapping[col] || ""}
                          onChange={e => setMapping(m => ({ ...m, [col]: e.target.value }))}
                        >
                          {CRM_FIELDS.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                          ))}
                        </select>
                      </>
                    ))}
                  </div>
                </div>
              </div>

              {/* Salva template */}
              <div className="surface" style={{ padding: 14, marginBottom: 16, display: "flex", gap: 10, alignItems: "center" }}>
                <input
                  type="text"
                  className="input"
                  placeholder="Nome template (es. Spaggiari 2024/25)"
                  value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button className="btn btn-secondary btn-sm" disabled={!templateName}>
                  <Save size={13} /> Salva template
                </button>
              </div>

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn btn-secondary" onClick={() => setStep(1)}>Indietro</button>
                <button className="btn btn-primary" onClick={handlePreview} disabled={loading}>
                  {loading ? "Validazione..." : "Valida e anteprima →"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Preview */}
          {step === 3 && preview && (
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div className="surface" style={{ padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "var(--text)" }}>{preview.totale}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Righe totali</div>
                </div>
                <div className="surface" style={{ padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: "var(--success)" }}>{preview.pronti}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Pronti per import</div>
                </div>
                <div className="surface" style={{ padding: 16, textAlign: "center" }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: preview.errori?.length > 0 ? "var(--warning)" : "var(--success)" }}>{preview.errori?.length || 0}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Errori / avvisi</div>
                </div>
              </div>

              {preview.errori?.length > 0 && (
                <div className="section-card" style={{ marginBottom: 20 }}>
                  <div className="section-header"><AlertCircle size={13} /> Errori rilevati</div>
                  <div className="section-body" style={{ maxHeight: 300, overflowY: "auto" }}>
                    {preview.errori.map((e: any, i: number) => (
                      <div key={i} style={{ fontSize: 12, padding: "6px 0", borderBottom: "1px solid var(--border)", display: "flex", gap: 12 }}>
                        <span style={{ color: "var(--warning)", fontFamily: "var(--font-mono)" }}>riga {e.riga}</span>
                        <span style={{ color: "var(--text-muted)" }}>{e.campo}</span>
                        <span>{e.messaggio}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button className="btn btn-secondary" onClick={() => setStep(2)}>Modifica mapping</button>
                <button
                  className="btn btn-primary"
                  onClick={handleImport}
                  disabled={loading || preview.pronti === 0}
                >
                  {loading ? "Importazione..." : `Importa ${preview.pronti} studenti →`}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Risultato */}
          {step === 4 && result && (
            <div style={{ textAlign: "center" }}>
              <CheckCircle size={48} color="var(--success)" style={{ marginBottom: 16 }} />
              <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Import completato</div>
              <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
                <strong style={{ color: "var(--success)" }}>{result.ok} studenti</strong> importati con successo.
                {result.fail > 0 && <span style={{ color: "var(--danger)" }}> {result.fail} falliti.</span>}
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
                <button className="btn btn-secondary" onClick={() => { setStep(1); setFile(null); setPreview(null); setResult(null); }}>
                  Nuovo import
                </button>
                <button className="btn btn-primary" onClick={() => router.push("/dashboard")}>
                  Vai alla lista studenti
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
