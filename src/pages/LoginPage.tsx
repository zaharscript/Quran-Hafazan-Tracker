import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, BookOpen, Eye, EyeOff, LockKeyhole, Mail, Moon, Sparkles, UserPlus } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const { user, loading, authError, isDemoMode, signIn, signUp } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const destination = (location.state as { from?: string } | null)?.from ?? "/";

  if (loading) return <main className="loading-page" role="status"><span className="loading-mark" /><span>Sedang membuka ruang belajar…</span></main>;
  if (!isDemoMode && user) return <Navigate to="/" replace />;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    if (password.length < 8) {
      setErrorMessage("Kata laluan mestilah sekurang-kurangnya 8 aksara.");
      return;
    }
    setIsSubmitting(true);
    try {
      const result = isSignUp ? await signUp(email, password) : await signIn(email, password);
      if (result.error) setErrorMessage(result.error);
      else if (isSignUp && result.message) setSuccessMessage(result.message);
      else navigate(destination, { replace: true });
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : "Tidak dapat membuat sambungan. Sila cuba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-backdrop" aria-hidden="true"><span className="login-motif login-motif--one" /><span className="login-motif login-motif--two" /><span className="login-motif login-motif--three" /></div>
      <Link to="/" className="login-brand"><span className="login-logo"><BookOpen size={20} /></span><span><strong>hafazan</strong><small>SURAU SERI DAHLIA</small></span></Link>
      <div className="login-shell">
        <section className="login-aside">
          <span className="login-aside-tag"><Sparkles size={14} /> Ruang untuk belajar dan membesar</span>
          <div className="login-aside-copy"><h1>Setiap ayat<br />menemui <em>tempatnya.</em></h1><p>Ruang yang mendamaikan untuk menyemai al-Quran dalam hati anak-anak — satu surah, satu langkah, setiap hari.</p></div>
          <div className="login-verse"><span className="login-verse-arabic" lang="ar" dir="rtl">وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ</span><span>“Dan sesungguhnya Kami mudahkan al-Quran untuk peringatan.”</span><small>AL-QAMAR · 54:17</small></div>
          <div className="login-aside-bottom"><span className="login-aside-mark"><Moon size={15} /></span><span>Dibina dengan penuh kasih untuk warga Surau Seri Dahlia</span></div>
        </section>
        <section className="login-card" aria-labelledby="login-heading">
          <div className="login-card-top"><span className="login-welcome">{isSignUp ? "PERMULAAN BAHARU" : "SELAMAT KEMBALI"}</span><span className="login-card-symbol"><BookOpen size={19} /></span></div>
          <h2 id="login-heading">{isSignUp ? "Sertai kumpulan kami." : "Selamat datang semula."}</h2>
          <p className="login-intro">{isSignUp ? "Daftar akaun untuk memulakan perjalanan hafazan anda." : "Kumpulan belajar anda menanti kepulangan anda."}</p>
          {isDemoMode && <div className="login-demo"><span className="login-demo-dot" /><span><strong>Mod demo</strong> · Supabase belum disambungkan. Akaun tidak akan dicipta.</span></div>}
          {authError && <p className="form-message form-message--error" role="alert">{authError}</p>}
          <form className="login-form" onSubmit={handleSubmit}>
            <label htmlFor="login-email">Alamat e-mel</label>
            <span className="login-input-wrap"><Mail size={17} aria-hidden="true" /><input id="login-email" name="email" type="email" autoComplete="email" placeholder="nama@contoh.com" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={isDemoMode || isSubmitting} /></span>
            <label htmlFor="login-password">Kata laluan</label>
            <span className="login-input-wrap"><LockKeyhole size={17} aria-hidden="true" /><input id="login-password" name="password" type={showPassword ? "text" : "password"} autoComplete={isSignUp ? "new-password" : "current-password"} placeholder="Sekurang-kurangnya 8 aksara" value={password} onChange={(event) => setPassword(event.target.value)} minLength={8} required disabled={isDemoMode || isSubmitting} /><button className="password-toggle" type="button" aria-label={showPassword ? "Sembunyikan kata laluan" : "Papar kata laluan"} onClick={() => setShowPassword((visible) => !visible)} disabled={isDemoMode || isSubmitting}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>
            {errorMessage && <p className="form-message form-message--error" role="alert">{errorMessage}</p>}
            {successMessage && <p className="form-message form-message--success" role="status">{successMessage}</p>}
            <button className="login-submit" type="submit" disabled={isDemoMode || isSubmitting}><span>{isSubmitting ? "Sila tunggu…" : isSignUp ? "Daftar akaun" : "Log masuk"}</span><ArrowRight size={17} /></button>
          </form>
          <div className="login-switch">{isSignUp ? "Sudah menyertai kumpulan ini?" : "Baharu menyertai kumpulan belajar?"} <button type="button" onClick={() => { setIsSignUp((current) => !current); setErrorMessage(""); setSuccessMessage(""); }}>{isSignUp ? "Log masuk" : "Daftar akaun"} {isSignUp ? <ArrowRight size={13} /> : <UserPlus size={13} />}</button></div>
          {isDemoMode && <Link to="/" className="demo-entry">Masuk ke mod demo <ArrowRight size={15} /></Link>}
          <p className="login-footer">Setiap surah membawa langkah bermakna.</p>
        </section>
      </div>
      <p className="login-copyright">SURAU SERI DAHLIA <span>·</span> PENJEJAK HAFAZAN AL-QURAN</p>
    </main>
  );
}
