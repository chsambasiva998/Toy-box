import React, { useEffect, useState } from "react";
import { Check, Loader2, Send } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { S, CSS } from "../styles";
import { useT } from "../i18n";

export default function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  const [msg, setMsg] = useState(null); const [busy, setBusy] = useState(false);
  const [brand, setBrand] = useState(null);
  useEffect(() => {
    supabase.from("store_settings").select("brand_name, tagline_en, tagline_te, logo_url").eq("id", 1).maybeSingle()
      .then(({ data }) => setBrand(data || {}));
  }, []);
  const bName = brand?.brand_name || "Vaayanam";
  const bEn = brand?.tagline_en || "A Telugu Way of Giving Love and Respect";
  const bTe = brand?.tagline_te || "";
  const bLogo = brand?.logo_url || null;
  async function submit() {
    setBusy(true); setMsg(null);
    try {
      if (mode === "reset") { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); if (error) throw error; setMsg("Reset link sent — check your email."); }
      else if (mode === "signin") { const { error } = await supabase.auth.signInWithPassword({ email, password: pass }); if (error) throw error; }
      else { const { error } = await supabase.auth.signUp({ email, password: pass }); if (error) throw error; setMsg("Check your email to confirm, then sign in."); }
    } catch (e) { setMsg(e.message); }
    setBusy(false);
  }
  return (
    <div style={S.app}><style>{CSS}</style>
      <div style={S.authWrap}><div style={S.authCard}>
        {bLogo ? <img src={bLogo} alt={bName} style={{ width: 64, height: 64, objectFit: "contain", margin: "0 auto", display: "block" }} /> : <div style={{ fontSize: 40, textAlign: "center" }}>🪔</div>}
        <div style={S.authBrand}>{bName}</div>
        <div style={S.authMotto}>{bEn}</div>
        {bTe && <div style={{ ...S.authMotto, marginTop: 0 }}>{bTe}</div>}
        <div style={S.authTag}>{mode === "signin" ? "Welcome back." : mode === "signup" ? "Create your account." : "Reset your password."}</div>
        <input style={S.input} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        {mode !== "reset" && <input style={S.input} type="password" placeholder="Password (6+ chars)" value={pass} onChange={(e) => setPass(e.target.value)} />}
        <button className="cta full" disabled={busy} onClick={submit}>{busy ? <Loader2 className="spin" size={16} /> : mode === "signin" ? "Sign in" : mode === "signup" ? "Sign up" : "Send reset link"}</button>
        {msg && <div style={S.authMsg}>{msg}</div>}
        {mode === "signin" && <div style={S.authSwitch}><button className="linkbtn" onClick={() => { setMode("reset"); setMsg(null); }}>Forgot password?</button></div>}
        <div style={S.authSwitch}>{mode === "signin" ? "New here? " : "Have an account? "}<button className="linkbtn" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(null); }}>{mode === "signin" ? "Create one" : "Sign in"}</button></div>
      </div></div>
    </div>
  );
}
