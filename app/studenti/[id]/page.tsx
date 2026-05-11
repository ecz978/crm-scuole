"use client";
// app/studenti/[id]/page.tsx
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/layout/Sidebar";
import {
  ArrowLeft, Save, Paperclip, Users, AlertCircle,
  User, MapPin, Phone, GraduationCap, FileText,
  Heart, Globe, UserCheck, ChevronDown, ChevronUp
} from "lucide-react";

const SEZIONI = [
  { key: "anagrafe", label: "Anagrafe", icon: User },
  { key: "contatti", label: "Contatti", icon: Phone },
  { key: "residenza", label: "Residenza e recapito", icon: MapPin },
  { key: "iscrizione", label: "Iscrizione", icon: GraduationCap },
  { key: "provenienza", label: "Provenienza scolastica", icon: FileText },
  { key: "disabilita", label: "Disabilità e BES", icon: Heart },
  { key: "diritti", label: "Condizioni familiari e sociali", icon: Globe },
  { key: "documento", label: "Documento identità", icon: FileText },
  { key: "salute", label: "Salute e permessi", icon: Heart },
  { key: "genitori", label: "Genitori e deleghe", icon: Users },
  { key: "documenti", label: "Documenti allegati", icon: Paperclip },
];

export default function StudentePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [studente, setStudente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [openSections, setOpenSections] = useState<string[]>(["anagrafe", "iscrizione"]);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (!id || id === "nuovo") {
      setStudente({});
      setLoading(false);
      setOpenSections(SEZIONI.map(s => s.key));
      return;
    }
    fetch(`/api/studenti/${id}`)
      .then(r => r.json())
      .then(data => { setStudente(data); setLoading(false); });
  }, [id]);

  const toggle = (key: string) =>
    setOpenSections(s => s.includes(key) ? s.filter(k => k !== key) : [...s, key]);

  const set = (field: string, value: any) => {
    setStudente((s: any) => ({ ...s, [field]: value }));
    setDirty(true);
    setSaved(false);
  };

  const save = async () => {
    setSaving(true);
    const method = id === "nuovo" ? "POST" : "PUT";
    const url = id === "nuovo" ? "/api/studenti" : `/api/studenti/${id}`;
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studente),
    });
    setSaving(false);
    if (res.ok) {
      setDirty(false);
      setSaved(true);
      if (id === "nuovo") {
        const d = await res.json();
        router.replace(`/studenti/${d.id}`);
      }
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>Caricamento...</div>;

  const isNuovo = id === "nuovo";

  return (
    <div className="layout">
      <Sidebar />
      <div className="main">
        <div className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => router.back()}>
              <ArrowLeft size={14} /> Indietro
            </button>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>
                {isNuovo ? "Nuovo studente" : `${studente?.cognome || ""} ${studente?.nome || ""}`}
              </div>
              {!isNuovo && studente?.classe && (
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {studente.classe} · {studente.percorso} · {studente.sede}
                </div>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {saved && <span style={{ fontSize: 12, color: "var(--success)" }}>✓ Salvato</span>}
            {studente?.dsa && <span className="badge badge-yellow"><AlertCircle size={10} /> DSA</span>}
            {studente?.disabilita && <span className="badge badge-red"><AlertCircle size={10} /> Disabilità</span>}
            <button
              className="btn btn-primary btn-sm"
              onClick={save}
              disabled={saving || !dirty}
            >
              <Save size={14} />
              {saving ? "Salvataggio..." : "Salva modifiche"}
            </button>
          </div>
        </div>

        <div className="page" style={{ maxWidth: 900 }}>
          {SEZIONI.map(({ key, label, icon: Icon }) => (
            <div key={key} className="section-card">
              <div
                className="section-header"
                style={{ cursor: "pointer", justifyContent: "space-between" }}
                onClick={() => toggle(key)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon size={13} />
                  {label}
                </div>
                {openSections.includes(key) ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>

              {openSections.includes(key) && (
                <div className="section-body">
                  {key === "anagrafe" && <SezioneAnagrafe studente={studente} set={set} />}
                  {key === "contatti" && <SezioneContatti studente={studente} set={set} />}
                  {key === "residenza" && <SezioneResidenza studente={studente} set={set} />}
                  {key === "iscrizione" && <SezioneIscrizione studente={studente} set={set} />}
                  {key === "provenienza" && <SezioneProvenienza studente={studente} set={set} />}
                  {key === "disabilita" && <SezioneDisabilita studente={studente} set={set} />}
                  {key === "diritti" && <SezioneDiritti studente={studente} set={set} />}
                  {key === "documento" && <SezioneDocumento studente={studente} set={set} />}
                  {key === "salute" && <SezioneSalute studente={studente} set={set} />}
                  {key === "genitori" && <SezioneGenitori studente={studente} />}
                  {key === "documenti" && <SezioneDocumenti studenteId={id} />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Sezione helpers ──────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label className="label">{label}</label>
      {children}
    </div>
  );
}

function TF({ s, k, set, placeholder = "", type = "text" }: any) {
  return (
    <input
      type={type}
      className="input"
      value={s?.[k] || ""}
      onChange={e => set(k, e.target.value)}
      placeholder={placeholder}
    />
  );
}

function CB({ s, k, set, label }: any) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
      <input type="checkbox" checked={!!s?.[k]} onChange={e => set(k, e.target.checked)} />
      {label}
    </label>
  );
}

function SezioneAnagrafe({ studente: s, set }: any) {
  return (
    <div>
      <div className="grid-3" style={{ marginBottom: 12 }}>
        <Field label="Cognome *"><TF s={s} k="cognome" set={set} /></Field>
        <Field label="Nome *"><TF s={s} k="nome" set={set} /></Field>
        <Field label="Codice fiscale"><TF s={s} k="codFiscale" set={set} placeholder="RSSMRA00A01F205Z" /></Field>
        <Field label="Data di nascita"><TF s={s} k="dataNascita" set={set} type="date" /></Field>
        <Field label="Sesso">
          <select className="input" value={s?.sesso || ""} onChange={e => set("sesso", e.target.value)}>
            <option value="">—</option>
            <option value="M">Maschio</option>
            <option value="F">Femmina</option>
          </select>
        </Field>
        <Field label="Luogo di nascita"><TF s={s} k="luogoNascita" set={set} /></Field>
        <Field label="Provincia nascita"><TF s={s} k="provinciaNascita" set={set} placeholder="LO" /></Field>
        <Field label="Stato nascita"><TF s={s} k="statoNascita" set={set} placeholder="Italia" /></Field>
        <Field label="Matricola"><TF s={s} k="matricola" set={set} /></Field>
        <Field label="Codice SIDI"><TF s={s} k="codiceSidi" set={set} /></Field>
        <Field label="Cittadinanza 1"><TF s={s} k="cittadinanza1" set={set} /></Field>
        <Field label="Cittadinanza 2"><TF s={s} k="cittadinanza2" set={set} /></Field>
      </div>
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>Carriera alias (es. studenti transgender)</div>
        <div className="grid-3">
          <Field label="Cognome alias"><TF s={s} k="cognomeAlias" set={set} /></Field>
          <Field label="Nome alias"><TF s={s} k="nomeAlias" set={set} /></Field>
          <Field label="Sesso alias">
            <select className="input" value={s?.sessoAlias || ""} onChange={e => set("sessoAlias", e.target.value)}>
              <option value="">—</option>
              <option value="M">Maschio</option>
              <option value="F">Femmina</option>
            </select>
          </Field>
        </div>
      </div>
    </div>
  );
}

function SezioneContatti({ studente: s, set }: any) {
  return (
    <div className="grid-3">
      <Field label="Email"><TF s={s} k="email" set={set} type="email" /></Field>
      <Field label="Email 2"><TF s={s} k="email2" set={set} type="email" /></Field>
      <Field label="PEC"><TF s={s} k="pec" set={set} type="email" /></Field>
      <Field label="Telefono"><TF s={s} k="telefono" set={set} placeholder="02 1234567" /></Field>
      <Field label="Cellulare"><TF s={s} k="cellulare" set={set} placeholder="340 1234567" /></Field>
      <Field label="Skype"><TF s={s} k="skype" set={set} /></Field>
    </div>
  );
}

function SezioneResidenza({ studente: s, set }: any) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: "var(--text-muted)" }}>Residenza</div>
      <div className="grid-3" style={{ marginBottom: 16 }}>
        <Field label="Comune"><TF s={s} k="comuneResidenza" set={set} /></Field>
        <Field label="Provincia"><TF s={s} k="provinciaResidenza" set={set} /></Field>
        <Field label="CAP"><TF s={s} k="capResidenza" set={set} /></Field>
        <Field label="Indirizzo"><TF s={s} k="indirizzoResidenza" set={set} /></Field>
        <Field label="Frazione"><TF s={s} k="frazioneResidenza" set={set} /></Field>
        <Field label="Cod. catastale"><TF s={s} k="codiceCatastale" set={set} /></Field>
      </div>
      <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 10, color: "var(--text-muted)" }}>Recapito (se diverso)</div>
      <div className="grid-3">
        <Field label="Comune recapito"><TF s={s} k="comuneRecapito" set={set} /></Field>
        <Field label="Provincia"><TF s={s} k="provinciaRecapito" set={set} /></Field>
        <Field label="CAP"><TF s={s} k="capRecapito" set={set} /></Field>
        <Field label="Indirizzo"><TF s={s} k="indirizzoRecapito" set={set} /></Field>
        <Field label="Frazione"><TF s={s} k="frazioneRecapito" set={set} /></Field>
      </div>
    </div>
  );
}

function SezioneIscrizione({ studente: s, set }: any) {
  return (
    <div className="grid-3">
      <Field label="Anno scolastico"><TF s={s} k="annoScolastico" set={set} placeholder="2024/25" /></Field>
      <Field label="Classe"><TF s={s} k="classe" set={set} placeholder="4A" /></Field>
      <Field label="Anno corso"><TF s={s} k="annoCorso" set={set} /></Field>
      <Field label="Sezione"><TF s={s} k="sezione" set={set} /></Field>
      <Field label="Sede">
        <select className="input" value={s?.sede || ""} onChange={e => set("sede", e.target.value)}>
          <option value="">—</option>
          <option value="Lodi">Lodi</option>
          <option value="Codogno">Codogno</option>
        </select>
      </Field>
      <Field label="Percorso">
        <select className="input" value={s?.percorso || ""} onChange={e => set("percorso", e.target.value)}>
          <option value="">—</option>
          <option value="Informatica">Informatica</option>
          <option value="Cucina">Cucina</option>
          <option value="Acconciatura">Acconciatura</option>
          <option value="Estetica">Estetica</option>
          <option value="Moda">Moda</option>
        </select>
      </Field>
      <Field label="Data inizio"><TF s={s} k="dataInizio" set={set} type="date" /></Field>
      <Field label="Data fine"><TF s={s} k="dataFine" set={set} type="date" /></Field>
      <Field label="Ore settimanali"><TF s={s} k="oreSettimanali" set={set} type="number" /></Field>
      <Field label="Piano di studi"><TF s={s} k="pianoStudio" set={set} /></Field>
      <Field label="Stato alunno"><TF s={s} k="statoAlunno" set={set} /></Field>
      <Field label="Indirizzo scelto"><TF s={s} k="indirizzo" set={set} /></Field>
      <div className="grid-2" style={{ gridColumn: "1 / -1" }}>
        <CB s={s} k="religioneCattolica" set={set} label="Religione cattolica" />
        <CB s={s} k="attivitaAlternativa" set={set} label="Attività alternativa" />
        <CB s={s} k="convittore" set={set} label="Convittore" />
        <CB s={s} k="obligoFormativo" set={set} label="Obbligo formativo" />
      </div>
      <Field label="Note" style={{ gridColumn: "1 / -1" }}>
        <textarea className="input" value={s?.note || ""} onChange={e => set("note", e.target.value)} rows={3} style={{ resize: "vertical" }} />
      </Field>
    </div>
  );
}

function SezioneProvenienza({ studente: s, set }: any) {
  return (
    <div className="grid-3">
      <Field label="Scuola provenienza"><TF s={s} k="scuolaProvenienza" set={set} /></Field>
      <Field label="Denominazione istituto"><TF s={s} k="denominazioneIst" set={set} /></Field>
      <Field label="Codice meccanografico"><TF s={s} k="scuolaProvMecc" set={set} /></Field>
      <Field label="Indirizzo scuola media"><TF s={s} k="indirizzoScuolaMedia" set={set} /></Field>
      <Field label="Indirizzo ist. provenienza"><TF s={s} k="indirizzoIstProv" set={set} /></Field>
      <Field label="Anno conseguimento media"><TF s={s} k="annoConsequimentoMedia" set={set} /></Field>
      <Field label="Ultima annualità"><TF s={s} k="ultimaAnnualita" set={set} /></Field>
      <Field label="Ultimo anno scol."><TF s={s} k="ultimoAnnoScol" set={set} /></Field>
      <Field label="Esito provenienza"><TF s={s} k="esitoProvenienza" set={set} /></Field>
    </div>
  );
}

function SezioneDisabilita({ studente: s, set }: any) {
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        <CB s={s} k="dsa" set={set} label="DSA" />
        <CB s={s} k="disabilita" set={set} label="Disabilità" />
        <CB s={s} k="des" set={set} label="DES" />
        <CB s={s} k="bes" set={set} label="BES" />
      </div>
      <div className="grid-3">
        {s?.dsa && <Field label="Descrizione DSA"><TF s={s} k="dsaDescrizione" set={set} /></Field>}
        {s?.disabilita && <Field label="Gravità handicap"><TF s={s} k="gravitaHandicap" set={set} /></Field>}
        {s?.disabilita && <Field label="ICD-10"><TF s={s} k="icd10" set={set} /></Field>}
        <Field label="Ente certificatore"><TF s={s} k="enteCertificatore" set={set} /></Field>
        <Field label="Data certificazione"><TF s={s} k="dataCertificazione" set={set} type="date" /></Field>
      </div>
    </div>
  );
}

function SezioneDiritti({ studente: s, set }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <CB s={s} k="migrante" set={set} label="Migrante o di origine straniera" />
      <CB s={s} k="affidato" set={set} label="Minore affidato con provvedimento a famiglie o comunità" />
      {s?.affidato && (
        <Field label="Estremi provvedimento tribunale">
          <TF s={s} k="estremiProvvedimento" set={set} />
        </Field>
      )}
      <CB s={s} k="senzaDimora" set={set} label="Senza dimora o colpito da esclusione abitativa" />
      <CB s={s} k="alloggioInsicuro" set={set} label="Alloggio insicuro" />
      <CB s={s} k="abitazioneInadeguata" set={set} label="Abitazione inadeguata" />
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 4 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>Condizione familiare</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <CB s={s} k="famDisoccupata" set={set} label="Famiglia con componenti senza lavoro e senza figli a carico" />
          <CB s={s} k="famDisoccupataFigli" set={set} label="Famiglia con componenti senza lavoro e con figli a carico" />
          <CB s={s} k="genitoreSolo" set={set} label="Genitore solo, senza lavoro e con figli a carico" />
          <CB s={s} k="genitoreSoloLav" set={set} label="Genitore solo, lavoratore e con figli a carico" />
          <CB s={s} k="nessunaDelePrecedenti" set={set} label="Nessuna delle precedenti" />
        </div>
      </div>
    </div>
  );
}

function SezioneDocumento({ studente: s, set }: any) {
  return (
    <div className="grid-3">
      <Field label="Tipo documento">
        <select className="input" value={s?.tipoDocumento || ""} onChange={e => set("tipoDocumento", e.target.value)}>
          <option value="">—</option>
          <option>Carta d&apos;identità</option>
          <option>Passaporto</option>
          <option>Patente</option>
          <option>Permesso di soggiorno</option>
          <option>Altro</option>
        </select>
      </Field>
      <Field label="Numero documento"><TF s={s} k="numeroDocumento" set={set} /></Field>
      <Field label="Data scadenza"><TF s={s} k="dataScadenzaDoc" set={set} type="date" /></Field>
      <Field label="Ente emittente"><TF s={s} k="enteDocumento" set={set} /></Field>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <CB s={s} k="sidi" set={set} label="SIDI" />
      </div>
    </div>
  );
}

function SezioneSalute({ studente: s, set }: any) {
  return (
    <div className="grid-3">
      <Field label="Vaccinazione"><TF s={s} k="vaccinazione" set={set} /></Field>
      <Field label="Educazione fisica"><TF s={s} k="educazioneFisica" set={set} /></Field>
      <Field label="Esonero EF inizio"><TF s={s} k="esoneroEFInizio" set={set} type="date" /></Field>
      <Field label="Esonero EF fine"><TF s={s} k="esoneroEFFine" set={set} type="date" /></Field>
      <Field label="Permesso entrata mattino (min)"><TF s={s} k="entrataMattinoMin" set={set} type="number" /></Field>
      <Field label="Permesso entrata pomeriggio (min)"><TF s={s} k="entrataPomMin" set={set} type="number" /></Field>
      <Field label="Permesso uscita mattino (min)"><TF s={s} k="uscitaMattinoMin" set={set} type="number" /></Field>
      <Field label="Permesso uscita pomeriggio (min)"><TF s={s} k="uscitaPomMin" set={set} type="number" /></Field>
      <div style={{ gridColumn: "1 / -1" }}>
        <CB s={s} k="autoSomministrazione" set={set} label="Autorizzato all'autosomministrazione farmaci" />
      </div>
    </div>
  );
}

function SezioneGenitori({ studente }: any) {
  const genitori = studente?.genitori || [];
  return (
    <div>
      {genitori.length === 0 ? (
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Nessun genitore associato.</div>
      ) : (
        genitori.map((rel: any) => (
          <div key={rel.id} style={{ marginBottom: 12, padding: 12, background: "var(--bg)", borderRadius: 4, border: "1px solid var(--border)" }}>
            <div style={{ fontWeight: 500 }}>{rel.genitore.cognome} {rel.genitore.nome}</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{rel.parentela} · {rel.genitore.email1}</div>
          </div>
        ))
      )}
      <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}>
        + Aggiungi genitore
      </button>
    </div>
  );
}

function SezioneDocumenti({ studenteId }: { studenteId: string }) {
  const [docs, setDocs] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (studenteId && studenteId !== "nuovo") {
      fetch(`/api/studenti/${studenteId}/documenti`)
        .then(r => r.json())
        .then(setDocs);
    }
  }, [studenteId]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || studenteId === "nuovo") return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`/api/studenti/${studenteId}/documenti`, { method: "POST", body: fd });
    if (res.ok) {
      const doc = await res.json();
      setDocs(d => [doc, ...d]);
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div>
      {studenteId === "nuovo" ? (
        <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Salva prima lo studente per caricare documenti.</div>
      ) : (
        <>
          <label className="btn btn-secondary btn-sm" style={{ cursor: "pointer", display: "inline-flex", marginBottom: 12 }}>
            <Paperclip size={14} />
            {uploading ? "Caricamento..." : "Carica documento"}
            <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={upload} style={{ display: "none" }} />
          </label>
          {docs.length === 0 ? (
            <div style={{ color: "var(--text-muted)", fontSize: 13 }}>Nessun documento allegato.</div>
          ) : (
            docs.map(doc => (
              <div key={doc.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <span className={`badge ${doc.tipo === "PDF" ? "badge-red" : doc.tipo === "JPG" ? "badge-blue" : "badge-gray"}`} style={{ marginRight: 8 }}>{doc.tipo}</span>
                  <span style={{ fontSize: 13 }}>{doc.nome}</span>
                </div>
                <a href={doc.blobUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                  Apri
                </a>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
