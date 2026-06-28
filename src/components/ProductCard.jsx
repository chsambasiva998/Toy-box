import React from "react";
import { Heart, Minus, Plus, Star } from "lucide-react";
import { S } from "../styles";
import { imagesFor, isNew, money } from "../shared";
import { useT } from "../i18n";

export default function ProductCard({ p, qty, fav, onFav, onInc, onDec, onOpen }) {
  const imgs = imagesFor(p);
  return (
    <div className="card">
      {isNew(p.created_at) && <span className="newbadge">NEW</span>}
      <button className={`favbtn ${fav ? "favon" : ""}`} onClick={(e) => { e.stopPropagation(); onFav(); }}><Heart size={16} fill={fav ? "#C1432E" : "none"} /></button>
      <div className="cardArt" style={{ cursor: "pointer" }} onClick={onOpen}>
        {imgs.length ? <img src={imgs[0]} alt={p.name} className="cardImg" /> : p.emoji}
        {imgs.length > 1 && <span className="imgcount">{imgs.length} 📷</span>}
      </div>
      <div style={S.cardBody}>
        <div style={S.cardTop}><span style={S.cat}>{p.category}</span><span style={S.rating}><Star size={12} fill="#E8A33D" color="#E8A33D" /> {p.rating}</span></div>
        <div style={S.cardName} onClick={onOpen}>{p.name}</div>
        {p.description && <div style={S.cardDesc}>{p.description}</div>}
        <div style={S.cardMeta}>Ages {p.age_range}</div>
        <div style={S.cardFoot}>
          <span style={S.price}>{money(p.price)}{qty > 0 && <span style={S.lineHint}> · {qty} = {money(p.price * qty)}</span>}</span>
          {qty === 0 ? <button className="addbtn" onClick={onInc}><Plus size={15} /> Add</button> : (
            <div style={S.stepper}><button className="qtybtn" onClick={onDec}><Minus size={14} /></button><span style={S.qty}>{qty}</span><button className="qtybtn" onClick={onInc}><Plus size={14} /></button></div>
          )}
        </div>
      </div>
    </div>
  );
}
