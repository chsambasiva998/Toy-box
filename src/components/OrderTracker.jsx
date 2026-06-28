import React from "react";
import { Check } from "lucide-react";
import { S } from "../styles";
import { ORDER_STAGES, STAGE_LABELS } from "../shared";
import { useT } from "../i18n";

export default function OrderTracker({ stage }) {
  if (stage === "cancelled") return <div style={{ ...S.trackPill, background: "#fdeceb", color: "#C1432E" }}>Cancelled</div>;
  if (stage === "pending") return <div style={{ ...S.trackPill, background: "#fff0e0", color: "#E8A33D" }}>Awaiting payment confirmation</div>;
  const idx = ORDER_STAGES.indexOf(stage);
  return (
    <div style={S.trackRow}>
      {ORDER_STAGES.map((st, i) => (
        <div key={st} style={S.trackStep}>
          <div style={{ ...S.trackDot, background: i <= idx ? "#1faa6b" : "#e4d9e0", color: i <= idx ? "#fff" : "#9a8da5" }}>{i < idx ? <Check size={12} /> : i + 1}</div>
          <div style={{ ...S.trackLabel, color: i <= idx ? "#3a2150" : "#9a8da5", fontWeight: i === idx ? 800 : 600 }}>{STAGE_LABELS[st]}</div>
          {i < ORDER_STAGES.length - 1 && <div style={{ ...S.trackLine, background: i < idx ? "#1faa6b" : "#e4d9e0" }} />}
        </div>
      ))}
    </div>
  );
}
