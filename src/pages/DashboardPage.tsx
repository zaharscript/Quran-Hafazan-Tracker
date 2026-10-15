import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BookOpen, CheckCircle2, Clock3, GraduationCap, Sparkles, Users } from "lucide-react";
import { completionCount, demoStudents, progressPercent, verificationCount } from "../data/demoData";
import { DemoBanner, MetricCard, PageHeader, ProgressBar, SectionTitle, StatusBadge } from "../components/ui";

export function DashboardPage() {
  const totalMemorized = demoStudents.reduce((sum, student) => sum + completionCount(student.progress), 0);
  const pendingChecks = demoStudents.reduce((sum, student) => sum + verificationCount(student.progress), 0);
  const recentStudents = demoStudents.slice(0, 4);

  return (
    <div className="page page-dashboard">
      <DemoBanner />
      <PageHeader eyebrow="KHAMIS, 15 OKTOBER" title={<span dir="rtl" lang="ar" className="greeting-arabic">السَّلَامُ عَلَيْكُمْ</span>} description="Setiap langkah kecil mendekatkan anak-anak kepada ayat suci yang dihafaz." action={<span className="greeting-pill"><Sparkles size={15} /> Semoga hari ini diberkati</span>} />
      <section className="welcome-panel" aria-label="Selamat datang ke Surau Seri Dahlia">
        <div className="welcome-content">
          <span className="welcome-kicker"><span className="gold-dot" /> SURAU SERI DAHLIA · JEJAK HAFAZAN</span>
          <h2>Menyubur jiwa,<br /><em>selangkah demi selangkah.</em></h2>
          <p>Ruang yang mendamaikan untuk meraikan perjalanan setiap murid menghafaz al-Quran.</p>
          <Link to="/students" className="welcome-action">Lihat senarai murid <ArrowRight size={16} /></Link>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <span className="art-ring art-ring--outer" /><span className="art-ring art-ring--inner" />
          <span className="art-moon">☾</span><span className="art-star art-star--one">✳</span><span className="art-star art-star--two">✧</span><span className="art-star art-star--three">·</span>
          <span className="art-verse" lang="ar" dir="rtl">وَقُل رَّبِّ زِدْنِي عِلْمًا</span>
          <span className="art-translation">“Wahai Tuhanku, tambahkanlah ilmuku.”</span>
          <span className="art-verse-ref">TA-HA · 20:114</span>
        </div>
        <span className="welcome-ornament" aria-hidden="true">✳</span>
      </section>
      <div className="metrics-grid">
        <MetricCard label="Murid dalam bimbingan" value={demoStudents.length} supporting="Merentas 3 kumpulan belajar" icon={Users} />
        <MetricCard label="Surah telah dihafaz" value={totalMemorized} supporting="Jumlah semua murid" icon={BookOpen} tone="green" />
        <MetricCard label="Menunggu pengesahan" value={pendingChecks} supporting="Sedia untuk semakan guru" icon={Clock3} tone="rose" />
        <MetricCard label="Kemajuan terkini" value="Minggu ini" supporting="Murid terus maju" icon={CheckCircle2} tone="blue" />
      </div>
      <div className="dashboard-lower">
        <section className="panel recent-panel">
          <SectionTitle title="Langkah kecil yang bermakna" detail="Aktiviti terkini murid" action={<Link className="section-link" to="/students">Semua murid <ArrowRight size={15} /></Link>} />
          <div className="activity-list">
            {recentStudents.map((student, index) => {
              const count = completionCount(student.progress);
              const pending = verificationCount(student.progress);
              return (
                <Link to={`/students/${student.id}`} className="activity-row" key={student.id}>
                  <span className="student-avatar">{student.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span>
                  <span className="activity-copy"><strong>{student.name}</strong><small>{student.className} · {student.lastActivity.toLowerCase()}</small></span>
                  <span className="activity-result"><span>{count} surah</span><StatusBadge status={pending ? "in-progress" : "memorized"} verified={!pending} /></span>
                  {index === 0 && <span className="activity-spark" aria-label="Aktiviti baharu"><Sparkles size={13} /></span>}
                </Link>
              );
            })}
          </div>
        </section>
        <section className="panel focus-panel">
          <SectionTitle title="Sejenak buat guru" detail="Perhatian kecil membawa makna besar" />
          <div className="focus-icon"><GraduationCap size={21} /></div>
          <p className="focus-quote">“Sebaik-baik kamu ialah orang yang mempelajari al-Quran dan mengajarkannya.”</p>
          <p className="focus-attribution">SAHIH AL-BUKHARI · 5027</p>
          <div className="focus-divider" />
          <div className="focus-stat"><span><Clock3 size={15} /> Sedia untuk disemak</span><strong>{pendingChecks}</strong></div>
          <Link className="focus-action" to="/teacher">Buka ruang guru <ArrowUpRight size={15} /></Link>
        </section>
      </div>
      <section className="panel progress-panel">
        <SectionTitle title="Imbasan perjalanan hafazan" detail="Kemajuan merentas kumpulan belajar" action={<Link className="section-link" to="/teacher">Lihat ruang guru <ArrowRight size={15} /></Link>} />
        <div className="group-progress-list">
          {["Tahun 1", "Tahun 2", "Tahun 3"].map((className) => {
            const group = demoStudents.filter((student) => student.className === className);
            const percent = Math.round(group.reduce((sum, student) => sum + progressPercent(student.progress), 0) / group.length);
            return <div className="group-progress" key={className}><span>{className}</span>            <ProgressBar value={percent} label={`Purata kemajuan hafazan ${className}`} />            <span className="group-count">{group.length} murid</span></div>;
          })}
        </div>
      </section>
      <p className="page-footnote">Data demo untuk gambaran sahaja · Perubahan senarai hafazan tidak disimpan</p>
    </div>
  );
}
