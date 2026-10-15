import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "../lib/supabaseConfig";

type AuthResult = {
  error: string | null;
  message?: string;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  authError: string | null;
  isDemoMode: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  signOut: () => Promise<AuthResult>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function getLocalizedError(error: unknown): string {
  const message = error instanceof Error ? error.message.toLowerCase() : "";

  if (message.includes("invalid login credentials") || message.includes("invalid email or password")) {
    return "Alamat e-mel atau kata laluan tidak tepat. Sila semak dan cuba lagi.";
  }
  if (message.includes("email not confirmed")) {
    return "E-mel anda belum disahkan. Sila semak peti masuk untuk pautan pengesahan.";
  }
  if (message.includes("user already registered") || message.includes("already registered")) {
    return "E-mel ini sudah didaftarkan. Sila log masuk atau gunakan alamat e-mel lain.";
  }
  if (message.includes("password") && (message.includes("short") || message.includes("least"))) {
    return "Kata laluan terlalu pendek. Sila pilih kata laluan yang lebih panjang.";
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return "Terlalu banyak percubaan. Sila tunggu sebentar sebelum mencuba lagi.";
  }
  if (message.includes("fetch") || message.includes("network") || message.includes("failed to connect")) {
    return "Tidak dapat membuat sambungan. Semak sambungan Internet dan cuba lagi.";
  }
  return "Permintaan tidak berjaya. Sila semak maklumat anda dan cuba lagi.";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let active = true;
    let unsubscribe = () => {};

    void import("../lib/supabase")
      .then(({ supabase }) => {
        if (!supabase) throw new Error("Sambungan Supabase tidak tersedia.");
        if (!active) return null;
        const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
          if (!active) return;
          setSession(nextSession);
          setLoading(false);
        });
        unsubscribe = () => listener.subscription.unsubscribe();
        return supabase.auth.getSession();
      })
      .then((result) => {
        if (!active) return;
        if (result) {
          if (result.error) {
            setAuthError(`Tidak dapat memulihkan sesi anda. ${getLocalizedError(result.error)}`);
          }
          setSession(result.data.session);
        }
      })
      .catch((error: unknown) => {
        if (active) setAuthError(`Tidak dapat menyambung ke Supabase. ${getLocalizedError(error)}`);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) return { error: "Log masuk tidak tersedia dalam mod demo. Tiada akaun dicipta." };
    try {
      const { supabase } = await import("../lib/supabase");
      if (!supabase) return { error: "Sambungan Supabase tidak tersedia. Tiada akaun dicipta." };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error) setAuthError(null);
      return { error: error ? getLocalizedError(error) : null };
    } catch (error: unknown) {
      return { error: getLocalizedError(error) };
    }
  };

  const signUp = async (email: string, password: string): Promise<AuthResult> => {
    if (!isSupabaseConfigured) return { error: "Pendaftaran tidak tersedia dalam mod demo. Tiada akaun dicipta." };
    try {
      const { supabase } = await import("../lib/supabase");
      if (!supabase) return { error: "Sambungan Supabase tidak tersedia. Tiada akaun dicipta." };
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) return { error: getLocalizedError(error) };
      return {
        error: null,
        message: data.session
          ? "Akaun anda sudah sedia."
          : "Semak peti masuk e-mel untuk mengesahkan akaun sebelum log masuk.",
      };
    } catch (error: unknown) {
      return { error: getLocalizedError(error) };
    }
  };

  const signOut = async (): Promise<AuthResult> => {
    if (!isSupabaseConfigured) return { error: "Log keluar tidak tersedia dalam mod demo." };
    try {
      const { supabase } = await import("../lib/supabase");
      if (!supabase) return { error: "Sambungan Supabase tidak tersedia." };
      const { error } = await supabase.auth.signOut();
      return { error: error ? getLocalizedError(error) : null };
    } catch (error: unknown) {
      return { error: getLocalizedError(error) };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user: session?.user ?? null, session, loading, authError, isDemoMode: !isSupabaseConfigured, signIn, signUp, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
