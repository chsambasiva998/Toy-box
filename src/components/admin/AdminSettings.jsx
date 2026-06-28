import React, { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { S } from "../../styles";
import { money } from "../../shared";
import { useT } from "../../i18n";

export default function AdminSettings({ flash, onChanged, settings }) {
  const [upiId, setUpiId] = useState(settings?.upi_id || ""); const [payeeName, setPayeeName] = useState(settings?.payee_name || ""); const [busy, setBusy] = useState(false);
  const [brandName, setBrandName] = useState(settings?.brand_name || "");
  const [taglineEn, setTaglineEn] = useState(settings?.tagline_en || "");
  const [taglineTe, setTaglineTe] = useState(settings?.tagline_te || "");
  const [logoUrl, setLogoUrl] = useState(settings?.logo_url || "");
  const [logoBusy, setLogoBusy] = useState(false);
  async function save() {
    if (!upiId.trim()) { flash("Enter your UPI ID"); return; }
    setBusy(true);
    const { error } = await supabase.from("store_settings").upsert({
      id: 1, upi_id: upiId.trim(), payee_name: payeeName.trim(),
      brand_name: brandName.trim() || "Vaayanam", tagline_en: taglineEn.trim(), tagline_te: taglineTe.trim(),
      logo_url: logoUrl || null, updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) { flash("Save failed: " + error.message); return; }
    flash("Saved"); onChanged();
  }
  async function uploadLogo(file) {
    if (!file) return;
    setLogoBusy(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const url = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
      setLogoUrl(url);
      flash("Logo uploaded — click Save to apply");
    } catch (e) { flash("Logo upload failed: " + e.message); }
    finally { setLogoBusy(false); }
  }
  return (
    <>
      <h2 style={S.sectionTitle}>Store settings</h2>
      <p style={S.sectionSub}>Branding, payment, and how money works.</p>

      <h3 style={S.subhead}>Branding</h3>
      <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 }}>
        <div>
          <div style={S.adminLabel}>Logo image</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {logoUrl ? <img src={logoUrl} alt="Logo" style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 10, border: "1px solid #f0e3ec" }} /> : <span style={{ fontSize: 40 }}>🪔</span>}
            <div>
              <input type="file" accept="image/*" onChange={(e) => uploadLogo(e.target.files?.[0])} />
              {logoBusy && <Loader2 className="spin" size={16} color="#C1432E" />}
              {logoUrl && <button className="linkbtn" style={{ display: "block", marginTop: 6 }} onClick={() => setLogoUrl("")}>Remove logo (use emoji)</button>}
            </div>
          </div>
        </div>
        <div><div style={S.adminLabel}>Brand name</div><input style={{ ...S.input, width: "100%" }} placeholder="Vaayanam" value={brandName} onChange={(e) => setBrandName(e.target.value)} /></div>
        <div><div style={S.adminLabel}>Tagline (English)</div><input style={{ ...S.input, width: "100%" }} placeholder="A Telugu Way of Giving Love and Respect" value={taglineEn} onChange={(e) => setTaglineEn(e.target.value)} /></div>
        <div><div style={S.adminLabel}>Tagline (Telugu)</div><input style={{ ...S.input, width: "100%" }} placeholder="ప్రేమను, గౌరవాన్ని పంచే తెలుగు మార్గం" value={taglineTe} onChange={(e) => setTaglineTe(e.target.value)} /></div>
      </div>

      <h3 style={S.subhead}>Payment</h3>
      <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 12 }}>
        <div><div style={S.adminLabel}>UPI ID (VPA)</div><input style={{ ...S.input, width: "100%" }} placeholder="yourname@okbank" value={upiId} onChange={(e) => setUpiId(e.target.value)} /></div>
        <div><div style={S.adminLabel}>Payee name</div><input style={{ ...S.input, width: "100%" }} placeholder="Vaayanam" value={payeeName} onChange={(e) => setPayeeName(e.target.value)} /></div>
        <button className="cta" disabled={busy} onClick={save}>{busy ? <Loader2 className="spin" size={16} /> : <Check size={16} />} Save all settings</button>
      </div>
      <div style={S.securityNote}><b>How money works:</b> customers pay your UPI directly. Everything stays <b>pending</b> until you confirm receipt and approve it here. Approving credits the customer's wallet (purchases over ₹2000 add a ₹50 reward).</div>
    </>
  );
}
