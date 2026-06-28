import React, { useEffect, useState } from "react";
import { Check, CreditCard, Loader2, User, Wallet } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { S } from "../../styles";
import { money, prettyDateTime } from "../../shared";
import { useT } from "../../i18n";

export default function AdminTopups({ flash }) {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); const [workingId, setWorkingId] = useState(null);
  useEffect(() => { load(); }, []);
  async function load() { setLoading(true); const { data, error } = await supabase.from("topup_requests").select("*").order("created_at", { ascending: false }); if (error) flash("Load failed: " + error.message); setRows(data || []); setLoading(false); }
  async function approve(id) { setWorkingId(id); const { error } = await supabase.rpc("approve_topup", { p_topup_id: id }); setWorkingId(null); if (error) flash("Approve failed: " + error.message); else { flash("Wallet credited ✓"); load(); } }
  async function reject(id) { const { error } = await supabase.from("topup_requests").update({ status: "rejected" }).eq("id", id); if (error) flash(error.message); else { flash("Rejected"); load(); } }
  const shown = rows.filter((r) => filter === "all" ? true : r.status === filter);
  if (loading) return <div style={S.center}><Loader2 className="spin" size={28} color="#C1432E" /></div>;
  return (
    <>
      <h2 style={S.sectionTitle}>Wallet recharges</h2>
      <p style={S.sectionSub}>Approve only after you see the UPI payment in your account. Approving credits the wallet instantly.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>{["pending", "approved", "all"].map((f) => <button key={f} className={`subtab ${filter === f ? "subtab-on" : ""}`} style={{ textTransform: "capitalize" }} onClick={() => setFilter(f)}>{f}</button>)}</div>
      {shown.length === 0 ? <div style={S.empty}><CreditCard size={30} color="#d6c9dd" /><p>No {filter === "all" ? "" : filter} recharges.</p></div> : (
        <div style={S.adminList}>{shown.map((r) => (
          <div key={r.id} style={S.orderRow}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>{money(r.amount)}<span style={{ ...S.statusPill, ...(r.status === "approved" ? S.pillPaid : r.status === "rejected" ? S.pillCancel : S.pillPending) }}>{r.status}</span></div>
              <div style={{ fontSize: 13, color: "#9a8da5", margin: "3px 0" }}>{prettyDateTime(r.created_at)}</div>
              <div style={{ fontSize: 12, color: "#9a8da5" }}>User: {r.user_id.slice(0, 8)}…</div>
            </div>
            {r.status === "pending" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button className="cta" style={{ padding: "8px 14px", fontSize: 13 }} disabled={workingId === r.id} onClick={() => approve(r.id)}>{workingId === r.id ? <Loader2 className="spin" size={14} /> : <Check size={14} />} Approve & credit</button>
                <button className="ghostbtn" onClick={() => reject(r.id)}>Reject</button>
              </div>
            )}
          </div>
        ))}</div>
      )}
    </>
  );
}
