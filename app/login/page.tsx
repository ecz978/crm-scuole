"use client";
// app/login/page.tsx
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Email o password errati");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{ width: 360 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontFamily: "var(--font-mono)",
            fontSize: 20,
            fontWeight: 600,
            color: "var(--text)",
            letterSpacing: "-0.03em",
            marginBottom: 4,
          }}>
            CRM<span style={{ color: "var(--text-muted)", fontWeight: 400 }}>/scuole</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Gestione studenti e famiglie
          </div>
        </div>

        {/* Card */}
        <div className="surface" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {error && (
              <div style={{
                padding: "10px 14px",
                background: "var(--danger-light)",
                border: "1px solid var(--danger)",
                borderRadius: 4,
                color: "var(--danger)",
                fontSize: 13,
              }}>
                {error}
              </div>
            )}

            <div className="field">
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="dirigente@calam.it"
                required
                autoFocus
              />
            </div>

            <div className="field">
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ justifyContent: "center", marginTop: 4 }}
            >
              {loading ? "Accesso in corso..." : "Accedi"}
            </button>
          </form>

          {/* OAuth separator */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            margin: "20px 0",
            color: "var(--text-muted)",
            fontSize: 12,
          }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            oppure
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="btn btn-secondary"
            style={{ width: "100%", justifyContent: "center", marginBottom: 8 }}
          >
            <GoogleIcon /> Accedi con Google
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11, color: "var(--text-muted)" }}>
          Accesso riservato al personale autorizzato
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}
