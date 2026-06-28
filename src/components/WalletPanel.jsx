import React, { useState } from "react";
import { Check, CreditCard, Loader2, QrCode } from "lucide-react";
import { S } from "../styles";
import { money, prettyDateTime } from "../shared";
import { useT } from "../i18n";
import OrderCard from "./OrderCard";

export default function WalletPanel({ wallet, log, onRecharge, hasUpi, orders }) {
  const { t } = useT();
  return (
    <>
      <h2 style={S.sectionTitle}>{t("your_wallet")}</h2>
      <p style={S.sectionSub}>{t("wallet_sub")}</p>
      <div style={S.walletCard}>
        <div style={S.walletGlow} />
        <div style={S.walletLabel}><CreditCard size={16} /> {t("balance")}</div>
        <div style={S.walletBalance}>{money(wallet)}</div>
        <button className="topup" onClick={onRecharge} disabled={!hasUpi}><QrCode size={15} style={{ verticalAlign: "-2px" }} /> {t("recharge_upi")}</button>
        {!hasUpi && <div style={{ fontSize: 12, marginTop: 10, opacity: .85 }}>{t("recharge_when_upi")}</div>}
      </div>
      <h3 style={S.subhead}>{t("activity")}</h3>
      <div style={S.logList}>{log.length === 0 ? <div style={{ ...S.empty, padding: "30px 0" }}><p>{t("no_activity")}</p></div> : log.map((e) => (
        <div key={e.id} style={S.logRow}>
          <div><div style={S.logType}>{e.type}</div><div style={S.logWhen}>{prettyDateTime(e.created_at)}</div></div>
          <div style={{ ...S.logAmt, color: e.amount < 0 ? "#C1432E" : "#1faa6b" }}>{e.amount < 0 ? "-" : "+"}{money(Math.abs(e.amount))}</div>
        </div>
      ))}</div>
      <h3 style={S.subhead}>{t("recent_orders")}</h3>
      {(!orders || orders.length === 0) ? <p style={{ color: "#9a8da5", fontSize: 14 }}>{t("no_orders")}</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{orders.slice(0, 5).map((o) => <OrderCard key={o.id} o={o} />)}</div>
      )}
    </>
  );
}
