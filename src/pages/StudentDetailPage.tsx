import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BookOpen, Check, Circle, Clock3, NotebookPen, ShieldCheck, Sparkles } from "lucide-react";
import { completionCount, demoStudents, formatMemorizationStatus, progressPercent, surahs, verificationCount } from "../data/demoData";
import { DemoBanner, PageHeader, ProgressBar } from "../components/ui";
import type { MemorizationStatus, Student, SurahProgress } from "../types";

export function StudentDetailRoute() {
  return <StudentDetailPage />;
}

function StudentDetailPage() {
  const { studentId } = useParams();
  const student = demoStudents.find((item) => item.id === studentId);

  if (!student) {
    return <div className="page"><Link to="/students" className="back-link"><ArrowLeft size={15} /> Kembali ke senarai murid</Link><div className="empty-state"><h3>Murid tidak ditemui</h3><p>Murid ini tiada dalam data demo.</p><Link className="section-link" to="/students">Lihat senarai murid <ArrowLeft size={15} /></Link></div></div>;
  }
  return <SurahChecklist key={student.id} student={student} />;
}

function SurahChecklist({ student }: { student: Student }) {
  const [progress, setProgress] = useState<SurahProgress[]>(student.progress);
  const completed = completionCount(progress);
  const pending = verificationCount(progress);
  const updateStatus = (surahNumber: number, status: MemorizationStatus) => {
    setProgress((current) => current.map((item) => item.surahNumber === surahNumber ? {
      ...item,
      status,
      memorizedOn: status === "memorized" ? item.memorizedOn ?? new Date().toISOString().slice(0, 10) : null,
      verified: status === "memorized" ? item.verified : false,
      mastery: status === "memorized" ? Math.max(item.mastery, 3) : status === "in-progress" ? Math.max(item.mastery, 1) : 0,
    } : item));
  };
  const toggleVerified = (surahNumber: number) => {
    setProgress((current) => current.map((item) => item.surahNumber === surahNumber ? { ...item, verified: !item.verified } : item));
  };

  return (
    <div className="page checklist-page">
      <DemoBanner />
      <Link to="/students" className="back-link"><ArrowLeft size={15} /> Semua murid</Link>
      <PageHeader eyebrow={`SENARAI SEMAK HAFAZAN · ${student.className.toUpperCase()}`} title={student.name} description="Senarai semak hafazan peribadi · murid contoh dalam ruang demo" />
      <section className="checklist-summary">
        <div className="checklist-summary-icon"><BookOpen size={22} /></div>
        <div className="checklist-summary-copy"><strong>{completed} <span>daripada {surahs.length} surah telah dihafaz</span></strong><span>Raikan setiap langkah kemajuan.</span></div>
        <ProgressBar value={progressPercent(progress)} label={`Kemajuan hafazan ${student.name}`} />
      </section>
      <div className="checklist-note"><Sparkles size={16} /><span>Hafazan dan pengesahan guru ialah dua langkah berasingan. Perubahan di sini hanya pada halaman ini dan tidak disimpan.</span></div>
      <div className="checklist-heading"><div><p className="eyebrow">SURAH PENDEK · JUZUK AMMA</p><h2>Perjalanan hafazan</h2><p>Kemas kini status hafazan dan catat semakan guru.</p></div><span className="checklist-pending"><Clock3 size={15} /> {pending} menunggu pengesahan</span></div>
      <div className="surah-list">
        {surahs.map((surah) => {
          const item = progress.find((entry) => entry.surahNumber === surah.number);
          if (!item) return null;
          return (
            <article className={`surah-row surah-row--${item.status}`} key={surah.number}>
              <span className={`surah-number${item.status !== "not-started" ? " is-started" : ""}`}><span>{surah.number}</span></span>
              <div className="surah-copy"><strong>{surah.name} <span className="surah-arabic" lang="ar" dir="rtl">{surah.arabicName}</span></strong><span>{surah.meaning} <span className="surah-dot">·</span> {surah.verses} ayat</span></div>
              <div className="surah-mastery"><span>Penguasaan</span><div className="mastery-dots" aria-label={`Tahap penguasaan ${item.mastery} daripada 5`}>{[1, 2, 3, 4, 5].map((level) => <span key={level} className={level <= item.mastery ? "is-filled" : ""} />)}</div></div>
              <label className="surah-status-control"><span className="sr-only">Status hafazan surah {surah.name}</span><select value={item.status} onChange={(event) => updateStatus(surah.number, event.target.value as MemorizationStatus)} className={`surah-status-select surah-status-select--${item.status}`}><option value="not-started">{formatMemorizationStatus("not-started")}</option><option value="in-progress">{formatMemorizationStatus("in-progress")}</option><option value="memorized">{formatMemorizationStatus("memorized")}</option></select></label>
              <div className="surah-date"><span>Tarikh hafazan</span><span>{item.memorizedOn ? new Date(`${item.memorizedOn}T12:00:00`).toLocaleDateString("ms-MY", { day: "numeric", month: "short", year: "numeric" }) : "—"}</span></div>
              <button className={`verify-button${item.verified ? " is-verified" : ""}`} type="button" disabled={item.status !== "memorized"} onClick={() => toggleVerified(surah.number)} aria-label={`${item.verified ? "Batalkan pengesahan guru untuk" : "Sahkan hafazan"} ${surah.name}`} title={item.status !== "memorized" ? "Tandakan telah dihafaz sebelum pengesahan" : item.verified ? "Telah disahkan guru — tekan untuk batalkan" : "Tandakan telah disahkan guru"}>
                <span className="verify-icon">{item.verified ? <Check size={13} /> : item.status === "memorized" ? <ShieldCheck size={14} /> : <Circle size={14} />}</span><span>{item.verified ? "Disahkan guru" : "Semakan guru"}</span>
              </button>
              <div className="surah-note">{item.note ? <><NotebookPen size={12} /><span>{item.note}</span></> : <span className="note-empty">No note added</span>}</div>
            </article>
          );
        })}
      </div>
      <p className="page-footnote">Data demo untuk gambaran sahaja · Perubahan senarai semak hanya pada halaman ini</p>
    </div>
  );
}
