import { useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Check,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { formatMemorizationStatus, progressPercent, verificationCount } from "../data/demoData";
import type { MemorizationStatus, Student } from "../types";
import { useAuth } from "../contexts/AuthContext";

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className={`brand-mark${compact ? " brand-mark--compact" : ""}`} aria-label="Laman utama Hafazan">
      <span className="brand-symbol" aria-hidden="true"><BookOpen size={20} strokeWidth={1.7} /></span>
      <span className="brand-copy"><strong>hafazan</strong><small>Surau Seri Dahlia</small></span>
    </Link>
  );
}

const navigation = [
  { to: "/", label: "Papan pemuka", icon: LayoutDashboard, end: true },
  { to: "/students", label: "Murid", icon: Users },
  { to: "/teacher", label: "Ruang guru", icon: GraduationCap },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { isDemoMode, user, signOut } = useAuth();
  const [signOutError, setSignOutError] = useState("");

  const handleSignOut = async () => {
    const result = await signOut();
    setSignOutError(result.error ?? "");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <BrandMark />
        <p className="nav-caption">RUANG ANDA</p>
        <nav className="side-nav" aria-label="Navigasi utama">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link${isActive ? " is-active" : ""}`}>
              <Icon size={19} strokeWidth={1.7} aria-hidden="true" /><span>{label}</span>
              {to === "/teacher" && <span className="nav-link-dot" aria-label="Pengesahan tertunggak" />}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="sidebar-note-icon"><Sparkles size={15} aria-hidden="true" /></span>
          <p>Setiap hari sedikit,<br />perjalanan penuh makna.</p>
          <span className="sidebar-note-arabic" lang="ar" dir="rtl">وَرَتِّلِ الْقُرْآنَ تَرْتِيلًا</span>
        </div>
        <div className="sidebar-foot">
          {isDemoMode
            ? <><span className="demo-dot" /> Ruang demo <span className="local-only">· setempat sahaja</span></>
            : <><span className="account-indicator" /> <span className="account-email">{user?.email ?? "Telah log masuk"}</span><button className="sign-out-button" type="button" aria-label="Log keluar" title="Log keluar" onClick={handleSignOut}><LogOut size={14} /></button></>}
        </div>
      </aside>
      <div className="mobile-header">
        <BrandMark compact />
        {isDemoMode
          ? <span className="mobile-demo">DEMO</span>
          : <button className="mobile-sign-out" type="button" aria-label="Log keluar" title="Log keluar" onClick={handleSignOut}><LogOut size={16} /></button>}
      </div>
      <main className="main-content">
        {signOutError && <p className="auth-feedback" role="alert">Tidak dapat log keluar: {signOutError}</p>}
        {children}
      </main>
      <nav className="mobile-nav" aria-label="Navigasi mudah alih">
        {navigation.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={({ isActive }) => `mobile-nav-link${isActive ? " is-active" : ""}`}>
            <Icon size={20} aria-hidden="true" /><span>{label === "Ruang guru" ? "Guru" : label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function DemoBanner() {
  const { isDemoMode } = useAuth();

  return (
    <div className="demo-banner">
      <span className="demo-dot" />
      <span><strong>{isDemoMode ? "Ruang demo" : "Data contoh"}</strong><span className="demo-banner-detail"> Murid contoh · perubahan hanya pada halaman ini</span></span>
    </div>
  );
}

export function PageHeader({ eyebrow, title, description, action }: {
  eyebrow: string;
  title: ReactNode;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="page-header">
      <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-description">{description}</p></div>
      {action && <div className="page-header-action">{action}</div>}
    </header>
  );
}

export function MetricCard({ label, value, supporting, icon: Icon, tone = "gold" }: {
  label: string;
  value: string | number;
  supporting: string;
  icon: typeof Users;
  tone?: "gold" | "green" | "blue" | "rose";
}) {
  return (
    <article className="metric-card">
      <div className={`metric-icon metric-icon--${tone}`}><Icon size={19} strokeWidth={1.8} aria-hidden="true" /></div>
      <p className="metric-label">{label}</p>
      <strong className="metric-value">{value}</strong>
      <span className="metric-supporting">{supporting}</span>
    </article>
  );
}

export function StatusBadge({ status, verified = false }: { status: MemorizationStatus; verified?: boolean }) {
  const label = status === "memorized" && verified ? "Disahkan guru" : formatMemorizationStatus(status);
  const className = status === "memorized" && verified
    ? "status-badge status-badge--verified"
    : `status-badge status-badge--${status}`;
  return <span className={className}>{status === "memorized" && verified && <Check size={12} aria-hidden="true" />}{label}</span>;
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="progress-wrap">
      <div className="progress-track" role="progressbar" aria-label={label} aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <span className="progress-fill" style={{ width: `${value}%` }} />
      </div>
      <span className="progress-value">{value}%</span>
    </div>
  );
}

export function StudentTable({ students }: { students: Student[] }) {
  return (
    <>
      <div className="student-table-wrap">
        <table className="student-table">
          <thead><tr><th>Murid</th><th>Kelas</th><th>Hafazan</th><th>Kemajuan</th><th>Pengesahan</th><th>Aktiviti terkini</th><th><span className="sr-only">Lihat murid</span></th></tr></thead>
          <tbody>
            {students.map((student) => {
              const count = student.progress.filter((item) => item.status === "memorized").length;
              const pending = verificationCount(student.progress);
              return (
                <tr key={student.id}>
                  <td><Link to={`/students/${student.id}`} className="student-name-link"><span className="student-avatar">{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span>{student.name}</span></Link></td>
                  <td>{student.className}</td>
                  <td>{count} <span className="table-muted">/ 10 surah</span></td>
                  <td><ProgressBar value={progressPercent(student.progress)} label={`Kemajuan hafazan ${student.name}`} /></td>
                  <td><span className={pending ? "table-pending" : "table-verified"}>{pending ? `${pending} menunggu pengesahan` : "Semua telah disahkan"}</span></td>
                  <td className="table-muted">{student.lastActivity}</td>
                  <td><Link to={`/students/${student.id}`} className="table-action" aria-label={`Lihat kemajuan ${student.name}`}><ArrowRight size={16} /></Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="student-cards">
        {students.map((student) => {
          const count = student.progress.filter((item) => item.status === "memorized").length;
          const pending = verificationCount(student.progress);
          return (
            <Link to={`/students/${student.id}`} className="student-card" key={student.id}>
              <div className="student-card-heading"><span className="student-avatar">{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span className="student-card-name"><strong>{student.name}</strong><span>{student.className} · {student.lastActivity}</span></span><ArrowRight size={17} className="student-card-arrow" /></div>
              <div className="student-card-progress"><span>{count} daripada 10 surah</span><ProgressBar value={progressPercent(student.progress)} label={`Kemajuan hafazan ${student.name}`} /></div>
              <span className={`status-badge ${pending ? "status-badge--in-progress" : "status-badge--verified"}`}>{pending ? `${pending} menunggu pengesahan` : "Semua telah disahkan"}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}

export function EmptyState({ query, onClear }: { query: string; onClear: () => void }) {
  return (
    <div className="empty-state"><span className="empty-icon"><Search size={22} /></span><h3>Murid tidak ditemui</h3><p>{query ? `Tiada padanan untuk “${query}”. Cuba nama atau tapisan lain.` : "Belum ada murid dalam paparan ini."}</p>{query && <button className="text-button" onClick={onClear}>Kosongkan carian <ArrowRight size={14} /></button>}</div>
  );
}

export function SectionTitle({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return <div className="section-title"><div><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{action}</div>;
}

export function VerificationSummary({ count }: { count: number }) {
  return <span className="verification-summary"><ClipboardCheck size={15} aria-hidden="true" />{count} menunggu pengesahan</span>;
}
