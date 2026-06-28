import React, { useMemo, useState } from "react";
import { Loader2, QrCode, Wallet, Zap } from "lucide-react";
import { S } from "../styles";
import { buildUpiString, money } from "../shared";
import { useT } from "../i18n";
import { Modal, UpiQR } from "./ui";

export default function CheckoutModal({ items, subtotal, settings, wallet, onClose, onConfirm, onWalletPay, onDone }) {
  const [order, setOrder] = useState(null); const [creating, setCreating] = useState(false);
  const hasUpi = settings?.upi_id?.trim(); const canWallet = wallet >= subtotal && subtotal > 0;
  async function startQR() { setCreating(true); const o = await onConfirm(); setCreating(false); if (o) setOrder(o); }
  const upiString = useMemo(() => hasUpi ? buildUpiString({ upiId: settings.upi_id, payeeName: settings.payee_name, amount: subtotal, note: order ? `Vaayanam #${order.id}` : "Vaayanam cart" }) : "", [hasUpi, settings, subtotal, order]);
  return (
    <Modal onClose={onClose}>
      <h3 style={S.modalTitle}>Checkout</h3>
      <div style={S.checkoutRows}>{items.map((i) => <div key={i.id} style={S.checkoutRow}><span>{i.name} ×{i.qty}</span><span>{money(i.price * i.qty)}</span></div>)}</div>
      <div style={S.payBox}>
        <div style={{ ...S.payLine, ...S.payTotal }}><span>Total</span><span>{money(subtotal)}</span></div>
        <div style={S.payLine}><span>Wallet balance</span><span>{money(wallet)}</span></div>
        {subtotal > 2000 && <div style={{ ...S.payLine, color: "#1faa6b", fontWeight: 800 }}><span>🎁 Reward on approval</span><span>+₹50</span></div>}
      </div>
      {canWallet && <button className="cta full" style={{ marginBottom: 12 }} onClick={onWalletPay}><Zap size={16} /> Pay {money(subtotal)} from wallet</button>}
      {!hasUpi ? <div style={S.warn}>No UPI ID set up yet. {canWallet ? "Pay from wallet above." : "Ask the shop to add one."}</div> :
        !order ? <button className="ghostbtn" style={{ width: "100%", padding: 13 }} disabled={creating} onClick={startQR}>{creating ? <Loader2 className="spin" size={16} /> : <QrCode size={16} />} Pay by UPI QR instead</button> : (
        <div style={{ textAlign: "center" }}>
          <div style={S.qrWrap}><UpiQR value={upiString} size={210} /></div>
          <div style={S.qrHint}>Scan to pay {money(subtotal)} to <b>{settings.upi_id}</b></div>
          <a className="cta full" href={upiString} style={{ textDecoration: "none", marginBottom: 10 }}>Open in UPI app</a>
          <p style={S.qrNote}>Order #{order.id} is <b>pending</b> until the shop confirms payment.</p>
          <button className="ghostbtn" style={{ width: "100%", padding: 12 }} onClick={onDone}>I've paid — place order</button>
        </div>
      )}
    </Modal>
  );
}
