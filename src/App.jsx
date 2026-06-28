import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { supabase } from "./lib/supabaseClient";
import { S } from "./styles";
import { I18nProvider } from "./i18n";
import AuthScreen from "./components/AuthScreen";
import Store from "./components/Store";

function AppInner() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (!ready) return <div style={S.center}><Loader2 className="spin" size={32} color="#C1432E" /></div>;
  return session ? <Store session={session} /> : <AuthScreen />;
}

export default function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}
