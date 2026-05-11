"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, SignOutButton } from "@clerk/nextjs";
import { Users, Home, Upload, Settings, LogOut, FileText, GraduationCap, Building2, Shield } from "lucide-react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/studenti", icon: Users, label: "Studenti" },
  { href: "/import", icon: Upload, label: "Import Spaggiari" },
  { href: "/documenti", icon: FileText, label: "Documenti" },
];

const adminItems = [
  { href: "/classi", icon: GraduationCap, label: "Classi" },
  { href: "/sedi", icon: Building2, label: "Sedi" },
  { href: "/audit", icon: Shield, label: "Audit Log" },
  { href: "/impostazioni", icon: Settings, label: "Impostazioni" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const isDirigente = user?.publicMetadata?.ruolo === "DIRIGENTE";

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        CRM<span>/scuole</span>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link key={href} href={href} className={`nav-item ${pathname.startsWith(href) ? "active" : ""}`}>
            <Icon size={15} />
            {label}
          </Link>
        ))}
        {isDirigente && (
          <>
            <div className="nav-section">Amministrazione</div>
            {adminItems.map(({ href, icon: Icon, label }) => (
              <Link key={href} href={href} className={`nav-item ${pathname.startsWith(href) ? "active" : ""}`}>
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </>
        )}
      </nav>
      <div style={{ padding: "12px 18px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>
          {user?.publicMetadata?.ruolo as string || "USER"}
        </div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user?.primaryEmailAddress?.emailAddress}
        </div>
        <SignOutButton>
          <button className="nav-item" style={{ padding: "6px 0", fontSize: 12, color: "rgba(255,255,255,0.5)", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, width: "100%" }}>
            <LogOut size={14} />
            Esci
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}
