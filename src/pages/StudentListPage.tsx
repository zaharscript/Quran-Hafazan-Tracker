import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Users } from "lucide-react";
import { demoStudents, verificationCount } from "../data/demoData";
import { DemoBanner, EmptyState, MetricCard, PageHeader, SectionTitle, StudentTable, VerificationSummary } from "../components/ui";

type ReviewFilter = "all" | "needs-review" | "up-to-date";

export function StudentListPage() {
  const [query, setQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [reviewFilter, setReviewFilter] = useState<ReviewFilter>("all");

  const students = useMemo(() => demoStudents.filter((student) => {
    const matchesSearch = `${student.name} ${student.className}`.toLowerCase().includes(query.trim().toLowerCase());
    const matchesClass = classFilter === "all" || student.className === classFilter;
    const needsReview = verificationCount(student.progress) > 0;
    const matchesReview = reviewFilter === "all" || (reviewFilter === "needs-review" ? needsReview : !needsReview);
    return matchesSearch && matchesClass && matchesReview;
  }), [query, classFilter, reviewFilter]);

  const hasSearch = Boolean(query || classFilter !== "all" || reviewFilter !== "all");

  return (
    <div className="page">
      <DemoBanner />
      <PageHeader eyebrow="KUMPULAN BELAJAR" title="Senarai murid" description="Setiap murid mempunyai rentak, kisah dan kemajuan hafazan yang tersendiri." />
      <div className="list-highlights">
        <MetricCard label="Dalam kumpulan kami" value={demoStudents.length} supporting="Murid rekaan untuk demonstrasi" icon={Users} />
        <div className="highlight-note"><span className="highlight-icon"><SlidersHorizontal size={18} /></span><div><strong>Mengikut rentak sendiri</strong><p>Hafazan ialah perjalanan, bukan perlumbaan. Setiap murid ada senarai semakan tersendiri.</p></div></div>
        <div className="highlight-review"><span className="highlight-icon"><VerificationSummary count={demoStudents.reduce((sum, student) => sum + verificationCount(student.progress), 0)} /></span></div>
      </div>
      <section className="panel roster-panel">
        <SectionTitle title="Kumpulan belajar" detail={`${students.length} orang murid · Pilih nama untuk membuka senarai semakan hafazan`} />
        <div className="filter-bar">
          <label className="search-control"><Search size={17} aria-hidden="true" /><span className="sr-only">Cari murid</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari nama atau kelas…" /></label>
          <label className="select-control"><span className="sr-only">Tapis mengikut kelas</span><select value={classFilter} onChange={(event) => setClassFilter(event.target.value)}><option value="all">Semua kelas</option><option value="Tahun 1">Tahun 1</option><option value="Tahun 2">Tahun 2</option><option value="Tahun 3">Tahun 3</option></select></label>
          <label className="select-control"><span className="sr-only">Tapis mengikut status pengesahan</span><select value={reviewFilter} onChange={(event) => setReviewFilter(event.target.value as ReviewFilter)}><option value="all">Semua kemajuan</option><option value="needs-review">Menunggu pengesahan</option><option value="up-to-date">Tiada pengesahan tertunggak</option></select></label>
        </div>
        {students.length ? <StudentTable students={students} /> : <EmptyState query={hasSearch ? query || "tapisan yang dipilih" : ""} onClear={() => { setQuery(""); setClassFilter("all"); setReviewFilter("all"); }} />}
      </section>
      <p className="page-footnote">Data demo untuk gambaran sahaja · Carian dan tapisan berfungsi setempat</p>
    </div>
  );
}
