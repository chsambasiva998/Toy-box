import React, { useState } from "react";
import { S } from "../../styles";
import { ORDER_STAGES, STAGE_LABELS } from "../../shared";
import { useT } from "../../i18n";

export default function AdminOrderControls({ o, onStage, onCourier }) {
  const [courier, setCourier] = useState(o.courier || "");
  const [link, setLink] = useState(o.tracking_link || "");
  const current = o.stage && o.stage !== "pending" ? o.stage : "paid";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 220 }}>
      <select style={{ ...S.input, padding: "8px 10px" }} value={current} onChange={(e) => onStage(o, e.target.value)}>
        {ORDER_STAGES.map((st) => <option key={st} value={st}>{STAGE_LABELS[st]}</option>)}
      </select>
      <input style={{ ...S.input, padding: "8px 10px" }} placeholder="Courier name" value={courier} onChange={(e) => setCourier(e.target.value)} />
      <input style={{ ...S.input, padding: "8px 10px" }} placeholder="Tracking link (optional)" value={link} onChange={(e) => setLink(e.target.value)} />
      <button className="ghostbtn" onClick={() => onCourier(o, courier.trim(), link.trim())}>Save tracking</button>
    </div>
  );
}
