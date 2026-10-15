import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpenCheck, CheckCircle2, Clock3, Download, Search, ShieldCheck, UsersRound } from "lucide-react";
import { completionCount, demoStudents, progressPercent, surahs, verificationCount } from "../data/demoData";
import { DemoBanner, EmptyState, MetricCard, PageHeader, SectionTitle, StudentTable } from "../components/ui";

type ClassFilter = "all" | "Tahun 1" | "Tahun 2" | "Tahun 3";

export function TeacherDashboardPage() {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState<ClassFilter>("all");
  const pendingStudents = demoStudents.filter((student) => verificationCount(student.progress) > 0);
  const visiblePending = pendingStudents.filter((student) => {
    const matchesSearch = `${student.name} ${student.className}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesClass = classFilter === "all" || student.className === classFilter;
    return matchesSearch && matchesClass;
  });
  const totalMemorized = demoStudents.reduce((sum, student) => sum + completionCount(student.progress), 0);
  const averageProgress = Math.round(demoStudents.reduce((sum, student) => sum + progressPercent(student.progress), 0) / demoStudents.length);

  return (
    <div className="page">
      <DemoBanner />
      <PageHeader eyebrow="RUANG KERJA GURU" title="Ruang guru" description="Imbasan kemajuan kumpulan belajar, supaya setiap pencapaian kecil diraikan." action={<button type="button" className="secondary-button" disabled title="Laporan akan tersedia dalam keluaran akan datang"><Download size={16} /> Eksport laporan <span className="soon-tag">Akan datang</span></button>} />
      <div className="metrics-grid teacher-metrics">
        <MetricCard label="Murid dalam bimbingan" value={demoStudents.length} supporting="Dalam 3 kumpulan belajar" icon={UsersRound} />
        <MetricCard label="Menunggu pengesahan" value={demoStudents.reduce((sum, student) => sum + verificationCount(student.progress), 0)} supporting="Menunggu semakan guru" icon={Clock3} tone="rose" />
        <MetricCard label="Surah telah dihafaz" value={totalMemorized} supporting="Pengesahan guru dikira berasingan" icon={BookOpenCheck} tone="green" />
        <MetricCard label="Kemajuan kumpulan" value={`${averageProgress}%`} supporting="Purata kemajuan hafazan" icon={CheckCircle2} tone="blue" />
      </div>
      <section className="panel teacher-review-panel">
        <SectionTitle title="Pengesahan guru" detail="Surah yang telah dihafaz dan menunggu semakan guru" action={<span className="review-count"><ShieldCheck size={15} /> {pendingStudents.length} orang murid</span>} />
        <div className="filter-bar teacher-filter-bar">
          <label className="search-control"><Search size={17} aria-hidden="true" /><span className="sr-only">Cari murid yang menunggu pengesahan</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama murid…" /></label>
          <label className="select-control"><span className="sr-only">Tapis murid mengikut kelas</span><select value={classFilter} onChange={(event) => setClassFilter(event.target.value as ClassFilter)}><option value="all">Semua kelas</option><option value="Tahun 1">Tahun 1</option><option value="Tahun 2">Tahun 2</option><option value="Tahun 3">Tahun 3</option></select></label>
        </div>
        {visiblePending.length ? (
          <div className="pending-list">{visiblePending.map((student) => {
            const pending = verificationCount(student.progress);
            const surah = student.progress.find((item) => item.status === "memorized" && !item.verified);
            const displayName = surah ? surahs.find((item) => item.number === surah.surahNumber)?.name : undefined;
            return <Link to={`/students/${student.id}`} className="pending-row" key={student.id}><span className="student-avatar">{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span className="pending-copy"><strong>{student.name}</strong><span>{student.className} · {displayName ?? "Hafazan"} sedia untuk disemak</span></span><span className="pending-badge"><Clock3 size={13} /> {pending} menunggu pengesahan</span><ArrowRight size={17} className="pending-arrow" /><span className="sr-only">Semak senarai hafazan {student.name}</span></Link>;
          })}</div>
        ) : <EmptyState query={query || (classFilter !== "all" ? classFilter : "")} onClear={() => { setQuery(""); setClassFilter("all"); }} />}
      </section>
      <section className="panel teacher-overview">
        <SectionTitle title="Semua murid" detail="Imbasan kemajuan hafazan setiap murid" action={<Link className="section-link" to="/students">Lihat semua <ArrowRight size={15} /></Link>} />
        <StudentTable students={demoStudents} />
      </section>
      <p className="page-footnote">Data demo untuk gambaran sahaja · Tindakan guru tidak disimpan</p>
    </div>
  );
}
