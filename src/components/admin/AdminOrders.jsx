import React, { useEffect, useState } from "react";
import { Check, ClipboardList, Loader2 } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { S } from "../../styles";
import { STAGE_LABELS, money, prettyDateTime } from "../../shared";
import { useT } from "../../i18n";
import AdminOrderControls from "./AdminOrderControls";

export default function AdminOrders({ flash }) {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true); const [filter, setFilter] = useState("pending"); const [workingId, setWorkingId] = useState(null);
  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false }); if (error) flash("Load failed: " + error.message); setOrders(data || []); setLoading(false); }
  async function approve(o) { setWorkingId(o.id); const { error } = await supabase.rpc("approve_order", { p_order_id: o.id }); setWorkingId(null); if (error) { flash("Approve failed: " + error.message); return; } flash(`Approved · ${money(o.total)}${o.total > 2000 ? " +₹50" : ""} credited ✓`); load(); }
  async function cancel(id) { const { error } = await supabase.from("orders").update({ status: "cancelled", stage: "cancelled" }).eq("id", id); if (error) flash("Failed: " + error.message); else { flash("Cancelled"); load(); } }
  async function setStage(o, stage) {
    const { error } = await supabase.from("orders").update({ stage }).eq("id", o.id);
    if (error) flash("Failed: " + error.message); else { flash("Updated to " + (STAGE_LABELS[stage] || stage)); load(); }
  }
  async function saveCourier(o, courier, tracking_link) {
    const { error } = await supabase.from("orders").update({ courier, tracking_link }).eq("id", o.id);
    if (error) flash("Failed: " + error.message); else { flash("Tracking saved"); load(); }
  }
  const shown = orders.filter((o) => filter === "all" ? true : o.status === filter);
  if (loading) return <div style={S.center}><Loader2 className="spin" size={28} color="#C1432E" /></div>;
  return (
    <>
      <h2 style={S.sectionTitle}>Orders</h2>
      <p style={S.sectionSub}>Confirm a payment only after you see it in your UPI app. Approving credits the buyer's wallet.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>{["pending", "paid", "all"].map((f) => <button key={f} className={`subtab ${filter === f ? "subtab-on" : ""}`} style={{ textTransform: "capitalize" }} onClick={() => setFilter(f)}>{f}</button>)}</div>
      {shown.length === 0 ? <div style={S.empty}><ClipboardList size={30} color="#d6c9dd" /><p>No {filter === "all" ? "" : filter} orders.</p></div> : (
        <div style={S.adminList}>{shown.map((o) => (
          <div key={o.id} style={S.orderRow}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>Order #{o.id} · {money(o.total)}<span style={{ ...S.statusPill, ...(o.status === "paid" ? S.pillPaid : o.status === "cancelled" ? S.pillCancel : S.pillPending) }}>{o.status}</span></div>
              <div style={{ fontSize: 13, color: "#9a8da5", margin: "3px 0" }}>{prettyDateTime(o.created_at)}</div>
              <div style={{ fontSize: 13, color: "#5b5066" }}>{(o.items || []).map((it, n) => <span key={n}>{it.name} ×{it.qty}{n < o.items.length - 1 ? ", " : ""}</span>)}</div>
              {o.ship_address && <div style={S.shipBox}><b>Ship to:</b> {o.ship_name}{o.ship_phone ? ` · ${o.ship_phone}` : ""}<br/>{o.ship_address}</div>}
            </div>
            {o.status === "pending" && <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><button className="cta" style={{ padding: "8px 14px", fontSize: 13 }} disabled={workingId === o.id} onClick={() => approve(o)}>{workingId === o.id ? <Loader2 className="spin" size={14} /> : <Check size={14} />} Approve & credit</button><button className="ghostbtn" onClick={() => cancel(o.id)}>Cancel</button></div>}
            {o.status === "paid" && <AdminOrderControls o={o} onStage={setStage} onCourier={saveCourier} />}
          </div>
        ))}</div>
      )}
    </>
  );
}
