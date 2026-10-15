import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export function NotFoundPage() {
  return <main className="not-found-page"><span className="not-found-icon"><BookOpen size={24} /></span><p className="eyebrow">TERSASAR SEKEJAP</p><h1>Halaman ini tidak ditemui.</h1><p>Mari kembali ke kumpulan belajar.</p><Link to="/" className="primary-link"><ArrowLeft size={16} /> Kembali ke papan pemuka</Link></main>;
}
