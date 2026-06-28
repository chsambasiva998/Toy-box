import React, { useState } from "react";
import { Check, Loader2, User } from "lucide-react";
import { S } from "../styles";
import { useT } from "../i18n";

export default function ProfilePanel({ profile, onSaveProfile }) {
  const { t } = useT();
  const [fn, setFn] = useState(profile?.full_name || "");
  const [ph, setPh] = useState(profile?.phone || "");
  const [ad, setAd] = useState(profile?.address || "");
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!fn.trim() || !ph.trim() || !ad.trim()) return;
    setSaving(true);
    await onSaveProfile({ full_name: fn.trim(), phone: ph.trim(), address: ad.trim() });
    setSaving(false);
  }

  return (
    <>
      <h2 style={S.sectionTitle}>{t("profile_title")}</h2>
      <p style={S.sectionSub}>{t("profile_sub")}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <span style={{ ...S.occIcon, width: 48, height: 48, background: "#FCE6DF", color: "#C1432E" }}><User size={24} /></span>
        <div style={{ fontWeight: 800, fontSize: 16 }}>{t("delivery_details")}</div>
      </div>
      <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={S.adminLabel}>{t("full_name")}</div>
          <input style={{ ...S.input, width: "100%" }} placeholder={t("full_name")} value={fn} onChange={(e) => setFn(e.target.value)} />
        </div>
        <div>
          <div style={S.adminLabel}>{t("phone")}</div>
          <input style={{ ...S.input, width: "100%" }} placeholder={t("phone")} value={ph} onChange={(e) => setPh(e.target.value)} />
        </div>
        <div>
          <div style={S.adminLabel}>{t("address_ph")}</div>
          <textarea style={{ ...S.input, width: "100%", minHeight: 90, resize: "vertical" }} placeholder={t("address_ph")} value={ad} onChange={(e) => setAd(e.target.value)} />
        </div>
        <button className="cta" disabled={saving || !fn.trim() || !ph.trim() || !ad.trim()} onClick={save}>
          {saving ? <Loader2 className="spin" size={16} /> : <Check size={16} />} {t("save_delivery")}
        </button>
      </div>
    </>
  );
}
