import React from "react";
import { ClipboardList } from "lucide-react";
import { S } from "../styles";
import { useT } from "../i18n";
import OrderCard from "./OrderCard";

export default function MyOrders({ orders, onShop }) {
  if (!orders || orders.length === 0)
    return <div style={S.empty}><ClipboardList size={32} color="#d6c9dd" /><p>No orders yet.</p><button className="cta" onClick={onShop}>Start shopping</button></div>;
  return (
    <>
      <h2 style={S.sectionTitle}>My orders</h2>
      <p style={S.sectionSub}>Track each order from payment to delivery.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{orders.map((o) => <OrderCard key={o.id} o={o} />)}</div>
    </>
  );
}
