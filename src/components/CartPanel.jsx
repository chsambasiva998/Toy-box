import React from "react";
import { ArrowRight, Minus, Plus, ShoppingCart, Wallet, X, Zap } from "lucide-react";
import { S } from "../styles";
import { imagesFor, money } from "../shared";
import { useT } from "../i18n";

export default function CartPanel({ items, subtotal, wallet, onSetQty, onCheckout, onWalletPay, onShop, hasAddress, onNeedAddress }) {
  if (items.length === 0) return <div style={S.empty}><ShoppingCart size={32} color="#d6c9dd" /><p>Your cart is empty.</p><button className="cta" onClick={onShop}>Start shopping</button></div>;
  const canWallet = wallet >= subtotal && subtotal > 0;
  return (
    <>
      <h2 style={S.sectionTitle}>Your cart</h2>
      <div style={S.cartList}>{items.map((i) => { const imgs = imagesFor(i); return (
        <div key={i.id} className="cartRow">
          <div className="cartArt">{imgs.length ? <img src={imgs[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} /> : i.emoji}</div>
          <div style={{ flex: 1 }}><div style={S.cardName}>{i.name}</div><div style={S.cardMeta}>{money(i.price)} each</div></div>
          <div style={S.stepper}><button className="qtybtn" onClick={() => onSetQty(i.id, i.qty - 1)}><Minus size={14} /></button><span style={S.qty}>{i.qty}</span><button className="qtybtn" onClick={() => onSetQty(i.id, i.qty + 1)}><Plus size={14} /></button></div>
          <div style={S.lineTotal}>{money(i.price * i.qty)}</div>
          <button className="iconbtn" onClick={() => onSetQty(i.id, 0)}><X size={16} /></button>
        </div>
      ); })}</div>
      <div style={S.summary}>
        <div style={S.sumLine}><span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span><span>{money(subtotal)}</span></div>
        <div style={S.sumLine}><span>Shipping</span><span style={{ color: "#1faa6b" }}>Free</span></div>
        {subtotal > 2000 && <div style={{ ...S.sumLine, color: "#1faa6b", fontWeight: 800 }}><span>🎁 Reward</span><span>+₹50 on approval</span></div>}
        <div style={{ ...S.sumLine, ...S.sumTotal }}><span>Total</span><span>{money(subtotal)}</span></div>
        <div style={S.walletNote}><Wallet size={14} /> Wallet: {money(wallet)}</div>
        {!hasAddress ? (
          <>
            <div style={S.warn}>Add a delivery address before checkout.</div>
            <button className="cta full" onClick={onNeedAddress}>Add delivery address <ArrowRight size={14} /></button>
          </>
        ) : (
          <>
            {canWallet && <button className="cta full" style={{ marginBottom: 10 }} onClick={onWalletPay}><Zap size={16} /> Pay from wallet</button>}
            <button className="ghostbtn" style={{ width: "100%", padding: 13 }} onClick={onCheckout}>Checkout with UPI <ArrowRight size={14} /></button>
          </>
        )}
      </div>
    </>
  );
}
