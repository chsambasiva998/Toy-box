import React from "react";
import { S } from "../styles";
import { money, prettyDateTime } from "../shared";
import { useT } from "../i18n";
import OrderTracker from "./OrderTracker";

export default function OrderCard({ o }) {
  return (
    <div style={S.myOrderCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontWeight: 800 }}>Order #{o.id} · {money(o.total)}</div>
        <div style={{ fontSize: 12.5, color: "#9a8da5" }}>{prettyDateTime(o.created_at)}</div>
      </div>
      <div style={{ fontSize: 13, color: "#5b5066", margin: "6px 0 14px" }}>{(o.items || []).map((it, n) => <span key={n}>{it.name} ×{it.qty}{n < o.items.length - 1 ? ", " : ""}</span>)}</div>
      <OrderTracker stage={o.stage || o.status} />
      {o.courier && (o.stage === "shipped" || o.stage === "out_for_delivery" || o.stage === "delivered") && (
        <div style={S.courierBox}>
          🚚 <b>{o.courier}</b>
          {o.tracking_link && <> · <a href={o.tracking_link} target="_blank" rel="noopener noreferrer" style={{ color: "#C1432E", fontWeight: 800 }}>Track package</a></>}
        </div>
      )}
    </div>
  );
}
