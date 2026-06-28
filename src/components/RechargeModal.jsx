import React, { useMemo, useState } from "react";
import { Loader2, QrCode } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { S } from "../styles";
import { buildUpiString, money } from "../shared";
import { useT } from "../i18n";
import { Modal, UpiQR } from "./ui";

export default function RechargeModal({ userId, settings, onClose, flash }) {
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState("amount");
  const [busy, setBusy] = useState(false);
  const hasUpi = settings?.upi_id?.trim();
  const upiString = useMemo(() => (hasUpi && amount) ? buildUpiString({ upiId: settings.upi_id, payeeName: settings.payee_name, amount: Number(amount), note: "Vaayanam wallet recharge" }) : "", [hasUpi, settings, amount]);
  async function startRecharge() {
    const amt = Number(amount);
    if (!amt || amt <= 0) { flash("Enter an amount"); return; }
    setBusy(true);
    const { error } = await supabase.from("topup_requests").insert({ user_id: userId, amount: amt, status: "pending" });
    setBusy(false);
    if (error) { flash(error.message); return; }
    setStage("qr");
  }
  return (
    <Modal onClose={onClose}>
      <h3 style={S.modalTitle}>Recharge wallet</h3>
      {stage === "amount" ? (
        <>
          {!hasUpi && <div style={S.warn}>The shop hasn't set a UPI ID yet — recharge isn't available.</div>}
          <div style={S.adminLabel}>Amount to add (₹)</div>
          <input style={{ ...S.input, width: "100%", marginBottom: 12 }} type="number" placeholder="e.g. 500" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {[100, 250, 500, 1000].map((a) => <button key={a} className="tagchip" style={{ textTransform: "none" }} onClick={() => setAmount(String(a))}>₹{a}</button>)}
          </div>
          <button className="cta full" disabled={busy || !hasUpi} onClick={startRecharge}>{busy ? <Loader2 className="spin" size={16} /> : <QrCode size={16} />} Generate recharge QR</button>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={S.qrWrap}><UpiQR value={upiString} size={210} /></div>
          <div style={S.qrHint}>Scan to pay {money(Number(amount))} to <b>{settings.upi_id}</b></div>
          <a className="cta full" href={upiString} style={{ textDecoration: "none", marginBottom: 10 }}>Open in UPI app</a>
          <p style={S.qrNote}>After you pay, the shop confirms it and <b>{money(Number(amount))}</b> is added to your wallet live.</p>
          <button className="ghostbtn" style={{ width: "100%", padding: 12 }} onClick={onClose}>Done</button>
        </div>
      )}
    </Modal>
  );
}
