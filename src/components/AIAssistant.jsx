import React, { useEffect, useRef, useState } from "react";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { S } from "../styles";
import { useT } from "../i18n";

export default function AIAssistant({ products, onClose }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Namaste! 🪔 I'm your Vaayanam assistant. Ask me about toys, gifts, or festival ideas." }]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);
  async function send() {
    const text = input.trim(); if (!text || busy) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next); setInput(""); setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", { body: { messages: next, products: products.map((p) => ({ name: p.name, price: p.price, category: p.category, age_range: p.age_range, description: p.description })) } });
      if (error) throw error;
      setMessages((m) => [...m, { role: "assistant", content: data.text || "Sorry, I couldn't respond." }]);
    } catch { setMessages((m) => [...m, { role: "assistant", content: "I'm having trouble connecting right now. Please try again." }]); }
    finally { setBusy(false); }
  }
  return (
    <div className="aiPanel">
      <div style={S.aiHead}><div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900 }}><MessageCircle size={18} color="#C1432E" /> Vaayanam Assistant</div><button className="iconbtn" onClick={onClose}><X size={18} /></button></div>
      <div style={S.aiBody}>
        {messages.map((m, i) => <div key={i} style={{ ...S.bubble, ...(m.role === "user" ? S.bubbleUser : S.bubbleBot) }}>{m.content}</div>)}
        {busy && <div style={{ ...S.bubble, ...S.bubbleBot }}><Loader2 className="spin" size={16} /></div>}
        <div ref={endRef} />
      </div>
      <div style={S.aiInputRow}><input style={{ ...S.input, flex: 1 }} placeholder="Ask about a gift…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} /><button className="cta" style={{ padding: "11px 16px" }} disabled={busy} onClick={send}><Send size={16} /></button></div>
    </div>
  );
}
