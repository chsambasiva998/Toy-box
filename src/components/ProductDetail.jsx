import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Minus, Plus, Star } from "lucide-react";
import { S } from "../styles";
import { imagesFor, money } from "../shared";
import { useT } from "../i18n";
import { Modal } from "./ui";
import Reviews from "./Reviews";

export default function ProductDetail({ p, qty, onClose, onInc, onDec, userId, flash }) {
  const imgs = imagesFor(p);
  const [idx, setIdx] = useState(0);
  const has = imgs.length > 0;
  return (
    <Modal onClose={onClose} wide>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={S.carousel}>
          {has ? <img src={imgs[idx]} alt={p.name} style={S.carouselImg} /> : <div style={{ fontSize: 90 }}>{p.emoji}</div>}
          {imgs.length > 1 && (
            <>
              <button className="carbtn carbtn-l" onClick={() => setIdx((i) => (i - 1 + imgs.length) % imgs.length)}><ChevronLeft size={20} /></button>
              <button className="carbtn carbtn-r" onClick={() => setIdx((i) => (i + 1) % imgs.length)}><ChevronRight size={20} /></button>
            </>
          )}
        </div>
        {imgs.length > 1 && (
          <div style={S.thumbs}>{imgs.map((u, i) => (
            <img key={i} src={u} alt="" onClick={() => setIdx(i)} style={{ ...S.thumb, ...(i === idx ? S.thumbOn : {}) }} />
          ))}</div>
        )}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <h3 style={{ ...S.modalTitle, margin: 0 }}>{p.name}</h3>
            <span style={S.cat}>{p.category}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "8px 0" }}>
            <span style={{ ...S.price, fontSize: 24 }}>{money(p.price)}</span>
            <span style={S.rating}><Star size={14} fill="#E8A33D" color="#E8A33D" /> {p.rating}</span>
            <span style={S.cardMeta}>Ages {p.age_range}</span>
          </div>
          {p.description && <p style={{ fontSize: 14.5, color: "#5b5066", lineHeight: 1.55 }}>{p.description}</p>}
          <div style={{ marginTop: 16 }}>
            {qty === 0 ? <button className="cta full" onClick={onInc}><Plus size={16} /> Add to cart</button> : (
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={S.stepper}><button className="qtybtn" onClick={onDec}><Minus size={14} /></button><span style={S.qty}>{qty}</span><button className="qtybtn" onClick={onInc}><Plus size={14} /></button></div>
                <span style={{ fontWeight: 900, fontSize: 18 }}>{money(p.price * qty)}</span>
              </div>
            )}
          </div>
        </div>
        <Reviews productId={p.id} userId={userId} flash={flash} />
      </div>
    </Modal>
  );
}
