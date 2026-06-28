import React, { useState } from "react";
import { Bell, Gift, Plus, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { S } from "../styles";
import { OCCASIONS, daysUntilYearly, nextYearlyDate, prettyDate } from "../shared";
import { useT } from "../i18n";

export default function RemindersPanel({ userId, reminders, setReminders, flash, onShop }) {
  const [title, setTitle] = useState(""); const [date, setDate] = useState(""); const [occ, setOcc] = useState("birthday");
  const [customOcc, setCustomOcc] = useState("");
  async function add() {
    if (!title.trim() || !date) { flash("Add a name and a date"); return; }
    const occLabel = occ === "other" ? (customOcc.trim() || "Other") : occ;
    const { data, error } = await supabase.from("reminders").insert({ user_id: userId, title: title.trim(), remind_date: date, occasion: occLabel }).select().single();
    if (error) { flash(error.message); return; }
    setReminders((r) => [...r, data]);
    setTitle(""); setDate(""); setCustomOcc(""); flash("Reminder saved 🔔 — repeats every year");
  }
  async function remove(id) { setReminders((r) => r.filter((x) => x.id !== id)); await supabase.from("reminders").delete().eq("id", id); }

  const sorted = [...reminders].sort((a, b) => daysUntilYearly(a.remind_date) - daysUntilYearly(b.remind_date));

  return (
    <>
      <h2 style={S.sectionTitle}>Gift reminders</h2>
      <p style={S.sectionSub}>Reminders repeat every year on the same date. We'll surface upcoming ones when you visit.</p>
      <div style={S.reminderForm}>
        <input style={S.input} placeholder="Whose moment? e.g. Amma's birthday" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input style={S.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select style={S.input} value={occ} onChange={(e) => setOcc(e.target.value)}>{OCCASIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select>
        <button className="cta" onClick={add}><Plus size={16} /> Add reminder</button>
      </div>
      {occ === "other" && (
        <input style={{ ...S.input, width: "100%", marginBottom: 18 }} placeholder="Name your occasion, e.g. Mom & Dad's wedding day" value={customOcc} onChange={(e) => setCustomOcc(e.target.value)} />
      )}
      <div style={S.reminderList}>
        {sorted.length === 0 && <div style={S.empty}><Bell size={28} color="#d6c9dd" /><p>No reminders yet.</p></div>}
        {sorted.map((r) => {
          const o = OCCASIONS.find((x) => x.id === r.occasion);
          const hue = o?.hue || "#9a8da5"; const Icon = o?.icon || Gift;
          const days = daysUntilYearly(r.remind_date);
          const occId = o?.id || "birthday";
          return (
            <div key={r.id} className="reminderCard">
              <span style={{ ...S.occIcon, background: hue + "22", color: hue }}><Icon size={20} /></span>
              <div style={{ flex: 1 }}>
                <div style={S.reminderTitle}>{r.title}</div>
                <div style={S.reminderMeta}>{(o?.label || r.occasion)} · {prettyDate(nextYearlyDate(r.remind_date))} · {days === 0 ? "today! 🎉" : `in ${days} day${days > 1 ? "s" : ""}`}</div>
              </div>
              <button className="ghostbtn" onClick={() => onShop(occId)}>Find gifts</button>
              <button className="iconbtn" onClick={() => remove(r.id)}><Trash2 size={16} /></button>
            </div>
          );
        })}
      </div>
    </>
  );
}
