import React, { useState } from "react";
import { Download, Loader2, Wand2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { S } from "../styles";
import { EXTRA_PROMPT_IDEAS, FESTIVALS } from "../shared";
import { useT } from "../i18n";

export default function DesignStudio({ flash }) {
  const [festival, setFestival] = useState(FESTIVALS[0].id);
  const [prompt, setPrompt] = useState(""); const [image, setImage] = useState(null); const [busy, setBusy] = useState(false);
  const fest = FESTIVALS.find((f) => f.id === festival);
  async function generate() {
    const p = prompt.trim(); if (!p) { flash("Type or pick a prompt first"); return; }
    setBusy(true); setImage(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-toy-image", { body: { prompt: p } });
      if (error) throw error;
      if (data?.image) setImage(data.image); else throw new Error(data?.error || "No image returned");
    } catch (e) { flash("Image generation failed: " + (e.message || e)); }
    finally { setBusy(false); }
  }
  return (
    <>
      <h2 style={S.sectionTitle}>Design your own toy <Wand2 size={22} style={{ verticalAlign: "-3px" }} /></h2>
      <p style={S.sectionSub}>Pick a festival theme or write your own idea. We'll generate a concept image to share with our toy makers.</p>
      <div style={S.adminLabel}>Festival theme</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>{FESTIVALS.map((f) => (
        <button key={f.id} className={`festchip ${festival === f.id ? "festchip-on" : ""}`} onClick={() => setFestival(f.id)}><span style={{ fontSize: 16 }}>{f.emoji}</span> {f.name}</button>
      ))}</div>
      <div style={S.adminLabel}>Theme prompts for {fest.name} — tap to use</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>{fest.prompts.map((pr, i) => <button key={i} className="promptchip" onClick={() => setPrompt(pr)}>{pr}</button>)}</div>
      <div style={S.adminLabel}>More ideas</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>{EXTRA_PROMPT_IDEAS.map((pr, i) => <button key={i} className="tagchip" style={{ textTransform: "none" }} onClick={() => setPrompt(pr)}>{pr}</button>)}</div>
      <textarea style={{ ...S.input, width: "100%", minHeight: 80, resize: "vertical", marginBottom: 12 }} placeholder="Describe your toy idea…" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button className="cta" disabled={busy} onClick={generate}>{busy ? <Loader2 className="spin" size={16} /> : <Wand2 size={16} />} Generate concept</button>
      {busy && <div style={{ ...S.empty, padding: "40px 0" }}><Loader2 className="spin" size={28} color="#C1432E" /><p>Designing your toy…</p></div>}
      {image && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <img src={image} alt="Toy concept" style={{ maxWidth: "100%", width: 380, borderRadius: 18, border: "1px solid #efe3f0" }} />
          <div style={{ marginTop: 12 }}><a className="cta" href={image} download="vaayanam-toy-concept.png" style={{ textDecoration: "none" }}><Download size={16} /> Download concept</a></div>
          <p style={S.qrNote}>AI concept image for inspiration. Share with our toy makers to customize.</p>
        </div>
      )}
    </>
  );
}
