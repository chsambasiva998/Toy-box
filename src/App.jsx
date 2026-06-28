import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ShoppingCart, Wallet, Calendar, Gift, Search, Plus, Minus, X,
  Bell, Star, Trash2, Heart, Check, ArrowRight, Sparkles, Package,
  CreditCard, PartyPopper, CakeSlice, Baby, GraduationCap, LogOut, Loader2,
  QrCode, ClipboardList, Settings, Zap, MessageCircle, Wand2, Send, Download,
  ChevronLeft, ChevronRight, IndianRupee,
} from "lucide-react";
import QRCode from "qrcode";
import { supabase } from "./supabaseClient";

/* ============================================================
   VAAYANAM — "A Telugu Way of Giving Love and Respect"
   Multi-image products + carousel · live qty totals
   Wallet starts ₹0 · recharge via UPI QR (admin-approved)
   AI assistant + AI toy design via Gemini Edge Functions
   ============================================================ */

const OCCASIONS = [
  { id: "birthday", label: "Birthday", icon: CakeSlice, hue: "#FF6B9D", tags: ["fun", "celebration"] },
  { id: "newborn", label: "Newborn", icon: Baby, hue: "#7FD8BE", tags: ["baby", "soft"] },
  { id: "graduation", label: "Graduation", icon: GraduationCap, hue: "#6C8EFF", tags: ["milestone", "learning"] },
  { id: "holiday", label: "Holiday", icon: PartyPopper, hue: "#FFB454", tags: ["festive", "celebration"] },
];

const money = (n) => `₹${Number(n).toFixed(2)}`;
const ADMIN_EMAIL = "ch.sambasiva998@gmail.com";
const NEW_DAYS = 14;

const CATEGORIES = ["STEM & Learning","Plush & Soft Toys","Classic & Wooden","Creative & Arts","Pretend Play","Baby & Infant","Games & Puzzles","Festive & Decor","Keepsakes & Gifts","Outdoor & Active"];

const FESTIVALS = [
  { id: "dussehra", name: "Dussehra / Navaratri", emoji: "🛕", prompts: [
    "A festive home with all nine Navadurga goddesses displayed, family doing puja happily together",
    "Golu doll arrangement on tiered steps with little figurines, warm diya lighting",
    "Goddess Durga on a lion defeating Mahishasura, colorful and child-friendly" ]},
  { id: "diwali", name: "Diwali / Deepavali", emoji: "🪔", prompts: [
    "Happy family bursting colorful crackers and sparklers in a courtyard at night",
    "Family performing Lakshmi puja with diyas, rangoli, and sweets",
    "A row of glowing clay diyas with marigold decorations" ]},
  { id: "sankranti", name: "Sankranti / Pongal", emoji: "🪁", prompts: [
    "Children flying colorful kites on rooftops under a bright sky",
    "Pongal pot boiling over with decorated sugarcane and turmeric plants" ]},
  { id: "holi", name: "Holi", emoji: "🎨", prompts: [
    "Joyful children throwing colorful gulal powder, vibrant Holi celebration",
    "Family smeared in rainbow colors playing with water guns" ]},
  { id: "ugadi", name: "Ugadi", emoji: "🌿", prompts: [
    "Telugu family celebrating Ugadi with mango leaf torans and Ugadi pachadi" ]},
  { id: "ganesh", name: "Ganesh Chaturthi", emoji: "🐘", prompts: [
    "Cute Lord Ganesha idol with modak sweets, family doing puja joyfully" ]},
  { id: "christmas", name: "Christmas", emoji: "🎄", prompts: [
    "Decorated Christmas tree with family exchanging gifts by a fireplace",
    "Jolly Santa Claus with a sack of toys and reindeer" ]},
  { id: "eid", name: "Eid", emoji: "🌙", prompts: [
    "Family in festive attire celebrating Eid with crescent moon and lanterns" ]},
  { id: "newyear", name: "New Year", emoji: "🎆", prompts: [
    "Fireworks over a skyline with a cheering family celebrating midnight" ]},
];

const EXTRA_PROMPT_IDEAS = [
  "A plush teddy bear in traditional Telugu attire",
  "A wooden puzzle shaped like India's map",
  "A doll house decorated for Diwali",
  "A robot toy dressed as a dhol drummer",
  "A board game about Indian festivals",
];

function buildUpiString({ upiId, payeeName, amount, note }) {
  const params = new URLSearchParams({ pa: upiId, pn: payeeName || "Vaayanam", am: Number(amount).toFixed(2), cu: "INR", tn: note || "Vaayanam" });
  return `upi://pay?${params.toString()}`;
}
function isNew(c) { return c ? (Date.now() - new Date(c).getTime()) / 86400000 <= NEW_DAYS : false; }
function suggestForOccasion(occId, products) {
  const occ = OCCASIONS.find((o) => o.id === occId);
  if (!occ) return products.slice(0, 6);
  return [...products].map((p) => ({ p, score: (p.tags || []).filter((t) => occ.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating).slice(0, 6).map((x) => x.p);
}

function UpiQR({ value, size = 210 }) {
  const [dataUrl, setDataUrl] = useState(null);
  useEffect(() => {
    let alive = true; setDataUrl(null);
    QRCode.toDataURL(value, { width: size, margin: 1, color: { dark: "#2a1a3e", light: "#ffffff" } })
      .then((u) => { if (alive) setDataUrl(u); }).catch(() => { if (alive) setDataUrl(null); });
    return () => { alive = false; };
  }, [value, size]);
  if (!dataUrl) return <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 className="spin" size={24} color="#C1432E" /></div>;
  return <img src={dataUrl} alt="UPI QR" width={size} height={size} style={{ borderRadius: 12 }} />;
}

/* helper: all images for a product (gallery first, else single image_url, else emoji) */
function imagesFor(p) {
  const gallery = (p.product_images || []).slice().sort((a, b) => a.sort - b.sort).map((g) => g.url);
  if (gallery.length) return gallery;
  if (p.image_url) return [p.image_url];
  return [];
}

/* ===================== ROOT ===================== */
export default function App() {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (!ready) return <div style={S.center}><Loader2 className="spin" size={32} color="#C1432E" /></div>;
  return session ? <Store session={session} /> : <AuthScreen />;
}

/* ===================== AUTH ===================== */
function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  const [msg, setMsg] = useState(null); const [busy, setBusy] = useState(false);
  async function submit() {
    setBusy(true); setMsg(null);
    try {
      if (mode === "reset") { const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin }); if (error) throw error; setMsg("Reset link sent — check your email."); }
      else if (mode === "signin") { const { error } = await supabase.auth.signInWithPassword({ email, password: pass }); if (error) throw error; }
      else { const { error } = await supabase.auth.signUp({ email, password: pass }); if (error) throw error; setMsg("Check your email to confirm, then sign in."); }
    } catch (e) { setMsg(e.message); }
    setBusy(false);
  }
  return (
    <div style={S.app}><style>{CSS}</style>
      <div style={S.authWrap}><div style={S.authCard}>
        <div style={{ fontSize: 40, textAlign: "center" }}>🪔</div>
        <div style={S.authBrand}>Vaayanam</div>
        <div style={S.authMotto}>A Telugu Way of Giving Love and Respect</div>
        <div style={S.authTag}>{mode === "signin" ? "Welcome back." : mode === "signup" ? "Create your account." : "Reset your password."}</div>
        <input style={S.input} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        {mode !== "reset" && <input style={S.input} type="password" placeholder="Password (6+ chars)" value={pass} onChange={(e) => setPass(e.target.value)} />}
        <button className="cta full" disabled={busy} onClick={submit}>{busy ? <Loader2 className="spin" size={16} /> : mode === "signin" ? "Sign in" : mode === "signup" ? "Sign up" : "Send reset link"}</button>
        {msg && <div style={S.authMsg}>{msg}</div>}
        {mode === "signin" && <div style={S.authSwitch}><button className="linkbtn" onClick={() => { setMode("reset"); setMsg(null); }}>Forgot password?</button></div>}
        <div style={S.authSwitch}>{mode === "signin" ? "New here? " : "Have an account? "}<button className="linkbtn" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(null); }}>{mode === "signin" ? "Create one" : "Sign in"}</button></div>
      </div></div>
    </div>
  );
}

/* ===================== STORE ===================== */
function Store({ session }) {
  const userId = session.user.id;
  const isAdmin = session.user.email === ADMIN_EMAIL;
  const [tab, setTab] = useState("shop");
  const [query, setQuery] = useState("");
  const [activeOcc, setActiveOcc] = useState("birthday");
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [wallet, setWallet] = useState(0);
  const [walletLog, setWalletLog] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [settings, setSettings] = useState({ upi_id: "", payee_name: "" });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState(null);
  const [rechargeOpen, setRechargeOpen] = useState(false);

  function flash(m) { setToast(m); setTimeout(() => setToast(null), 2800); }

  useEffect(() => { loadAll(); }, []);
  useEffect(() => {
    const ch = supabase.channel("wallet-rt")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${userId}` }, (p) => { if (p.new?.wallet != null) setWallet(Number(p.new.wallet)); })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "wallet_log", filter: `user_id=eq.${userId}` }, (p) => setWalletLog((l) => [p.new, ...l]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [userId]);

  async function loadAll() {
    setLoading(true);
    const [prod, prof, log, c, rem, setg] = await Promise.all([
      supabase.from("products").select("*, product_images(*)").order("created_at", { ascending: false }),
      supabase.from("profiles").select("wallet").eq("id", userId).single(),
      supabase.from("wallet_log").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("cart_items").select("*").eq("user_id", userId),
      supabase.from("reminders").select("*").eq("user_id", userId).order("remind_date"),
      supabase.from("store_settings").select("*").eq("id", 1).maybeSingle(),
    ]);
    setProducts(prod.data || []);
    setWallet(prof.data?.wallet ?? 0);
    setWalletLog(log.data || []);
    setCart((c.data || []).map((r) => ({ product_id: r.product_id, qty: r.qty })));
    setReminders(rem.data || []);
    setSettings(setg.data || { upi_id: "", payee_name: "" });
    setLoading(false);
  }

  const cartDetailed = cart.map((c) => { const p = products.find((x) => x.id === c.product_id); return p ? { ...p, qty: c.qty } : null; }).filter(Boolean);
  const subtotal = cartDetailed.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const qtyOf = (pid) => cart.find((i) => i.product_id === pid)?.qty || 0;
  const suggestions = useMemo(() => suggestForOccasion(activeOcc, products), [activeOcc, products]);
  const results = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter((p) => p.name.toLowerCase().includes(q) || (p.category || "").toLowerCase().includes(q) || (p.description || "").toLowerCase().includes(q));
  }, [query, products]);

  async function setItemQty(pid, qty) {
    if (qty <= 0) {
      setCart((c) => c.filter((i) => i.product_id !== pid));
      await supabase.from("cart_items").delete().eq("user_id", userId).eq("product_id", pid);
      return;
    }
    setCart((c) => c.find((i) => i.product_id === pid) ? c.map((i) => i.product_id === pid ? { ...i, qty } : i) : [...c, { product_id: pid, qty }]);
    await supabase.from("cart_items").upsert({ user_id: userId, product_id: pid, qty }, { onConflict: "user_id,product_id" });
  }
  function toggleFav(id) { setFavorites((f) => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n; }); }

  async function createPendingOrder() {
    const items = cartDetailed.map((i) => ({ name: i.name, qty: i.qty, price: i.price }));
    const { data, error } = await supabase.from("orders").insert({ user_id: userId, total: subtotal, items, status: "pending" }).select().single();
    if (error) { flash(error.message); return null; }
    return data;
  }
  async function payWithWallet() {
    if (subtotal <= 0) return;
    const items = cartDetailed.map((i) => ({ name: i.name, qty: i.qty, price: i.price }));
    const { error } = await supabase.rpc("purchase_with_wallet", { p_items: items, p_total: subtotal });
    if (error) { flash(error.message); return; }
    await supabase.from("cart_items").delete().eq("user_id", userId);
    setCart([]); setCheckoutOpen(false); flash("Paid from wallet 🎉"); setTab("shop");
  }

  if (loading) return <div style={S.center}><Loader2 className="spin" size={32} color="#C1432E" /></div>;

  const navItems = [
    { id: "shop", label: "Shop", icon: Package }, { id: "occasions", label: "Occasions", icon: Gift },
    { id: "design", label: "Design a Toy", icon: Wand2 }, { id: "calendar", label: "Reminders", icon: Calendar },
    { id: "wallet", label: "Wallet", icon: Wallet },
  ];

  return (
    <div style={S.app}><style>{CSS}</style>
      <header style={S.header}>
        <div style={S.brand}><span style={S.logoMark}>🪔</span><div><div style={S.brandName}>Vaayanam</div><div style={S.brandTag}>A Telugu Way of Giving Love and Respect</div></div></div>
        <nav style={S.nav}>
          {navItems.map((t) => <button key={t.id} className={`navbtn ${tab === t.id ? "navbtn-on" : ""}`} onClick={() => setTab(t.id)}><t.icon size={17} /> {t.label}</button>)}
          {isAdmin && <button className={`navbtn ${tab === "admin" ? "navbtn-on" : ""}`} onClick={() => setTab("admin")}><Settings size={17} /> Admin</button>}
          <button className="walletchip" onClick={() => setTab("wallet")}><Wallet size={15} /> {money(wallet)}</button>
          <button className="cartbtn" onClick={() => setTab("cart")}><ShoppingCart size={18} />{cartCount > 0 && <span className="badge">{cartCount}</span>}</button>
          <button className="iconbtn" title="Sign out" onClick={() => supabase.auth.signOut()}><LogOut size={18} /></button>
        </nav>
      </header>

      <main style={S.main}>
        {tab === "shop" && (
          <>
            <section style={S.hero}>
              <div style={S.heroInner}>
                <div style={S.heroEyebrow}><Sparkles size={14} /> Gifts with meaning</div>
                <h1 style={S.heroTitle}>Give love and respect, the Telugu way.</h1>
                <p style={S.heroSub}>Toys, keepsakes, and festive gifts — and design your very own toy for any festival with AI.</p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <button className="cta" onClick={() => setTab("occasions")}>Shop by occasion <ArrowRight size={16} /></button>
                  <button className="ghostbtn" style={{ padding: "13px 20px" }} onClick={() => setTab("design")}><Wand2 size={16} /> Design a toy</button>
                </div>
              </div>
              <div style={S.heroArt}>{["🪔","🎨","🧸","🪁","🎁","🐘"].map((e, i) => <span key={i} className="float" style={{ animationDelay: `${i*0.4}s` }}>{e}</span>)}</div>
            </section>
            <div style={S.searchRow}>
              <div style={S.searchWrap}><Search size={18} color="#9a8da5" /><input style={S.search} placeholder="Search toys, categories…" value={query} onChange={(e) => setQuery(e.target.value)} /></div>
              <span style={S.resultCount}>{results.length} items</span>
            </div>
            {results.length === 0 ? (
              <div style={S.empty}><Package size={32} color="#d6c9dd" /><p>No toys yet.{isAdmin ? " Add some from the Admin tab." : ""}</p></div>
            ) : (
              <div style={S.grid}>{results.map((p) => (
                <ProductCard key={p.id} p={p} qty={qtyOf(p.id)} fav={favorites.has(p.id)} onFav={() => toggleFav(p.id)}
                  onInc={() => setItemQty(p.id, qtyOf(p.id) + 1)} onDec={() => setItemQty(p.id, qtyOf(p.id) - 1)} onOpen={() => setDetailProduct(p)} />
              ))}</div>
            )}
          </>
        )}

        {tab === "occasions" && (
          <>
            <h2 style={S.sectionTitle}>What are we celebrating?</h2>
            <p style={S.sectionSub}>Pick a moment and we'll match the perfect gifts.</p>
            <div style={S.occRow}>{OCCASIONS.map((o) => (
              <button key={o.id} className={`occchip ${activeOcc === o.id ? "occchip-on" : ""}`} style={activeOcc === o.id ? { borderColor: o.hue, background: o.hue + "1a" } : {}} onClick={() => setActiveOcc(o.id)}>
                <span style={{ ...S.occIcon, background: o.hue + "22", color: o.hue }}><o.icon size={20} /></span>{o.label}</button>
            ))}</div>
            <div style={S.suggestHead}><Sparkles size={16} color="#C1432E" /><span>Curated picks for {OCCASIONS.find((o) => o.id === activeOcc)?.label}</span></div>
            {suggestions.length === 0 ? <div style={S.empty}><Gift size={32} color="#d6c9dd" /><p>Add toys to see picks.</p></div> : (
              <div style={S.grid}>{suggestions.map((p) => (
                <ProductCard key={p.id} p={p} qty={qtyOf(p.id)} fav={favorites.has(p.id)} onFav={() => toggleFav(p.id)}
                  onInc={() => setItemQty(p.id, qtyOf(p.id) + 1)} onDec={() => setItemQty(p.id, qtyOf(p.id) - 1)} onOpen={() => setDetailProduct(p)} />
              ))}</div>
            )}
          </>
        )}

        {tab === "design" && <DesignStudio flash={flash} />}
        {tab === "calendar" && <RemindersPanel userId={userId} reminders={reminders} setReminders={setReminders} flash={flash} onShop={(occ) => { setActiveOcc(occ); setTab("occasions"); }} />}
        {tab === "wallet" && <WalletPanel wallet={wallet} log={walletLog} onRecharge={() => setRechargeOpen(true)} hasUpi={!!settings?.upi_id?.trim()} />}
        {tab === "cart" && <CartPanel items={cartDetailed} subtotal={subtotal} wallet={wallet} onSetQty={setItemQty} onCheckout={() => setCheckoutOpen(true)} onWalletPay={payWithWallet} onShop={() => setTab("shop")} />}
        {tab === "admin" && isAdmin && <AdminPanel flash={flash} onChanged={loadAll} products={products} settings={settings} />}
      </main>

      {detailProduct && (
        <ProductDetail p={detailProduct} qty={qtyOf(detailProduct.id)} onClose={() => setDetailProduct(null)}
          onInc={() => setItemQty(detailProduct.id, qtyOf(detailProduct.id) + 1)} onDec={() => setItemQty(detailProduct.id, qtyOf(detailProduct.id) - 1)} />
      )}

      {checkoutOpen && (
        <CheckoutModal items={cartDetailed} subtotal={subtotal} settings={settings} wallet={wallet}
          onClose={() => setCheckoutOpen(false)} onConfirm={createPendingOrder} onWalletPay={payWithWallet}
          onDone={async () => { await supabase.from("cart_items").delete().eq("user_id", userId); setCart([]); setCheckoutOpen(false); flash("Order placed — pending confirmation"); setTab("shop"); }} />
      )}

      {rechargeOpen && <RechargeModal userId={userId} settings={settings} onClose={() => setRechargeOpen(false)} flash={flash} />}

      <button className="aifab" onClick={() => setAiOpen(true)} title="Ask Vaayanam AI"><MessageCircle size={22} /></button>
      {aiOpen && <AIAssistant products={products} onClose={() => setAiOpen(false)} />}

      {toast && <div className="toast">{toast}</div>}
      <footer style={S.footer}><span>🪔 Vaayanam</span><span style={{ color: "#9a8da5" }}>Signed in as {session.user.email}</span></footer>
    </div>
  );
}

/* ===================== PRODUCT CARD ===================== */
function ProductCard({ p, qty, fav, onFav, onInc, onDec, onOpen }) {
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
          <span
