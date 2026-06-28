import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  ShoppingCart, Wallet, Calendar, Gift, Search, Plus, Minus, X,
  Bell, Star, Trash2, Heart, Check, ArrowRight, Sparkles, Package,
  CreditCard, PartyPopper, CakeSlice, Baby, GraduationCap, LogOut, Loader2,
  QrCode, ClipboardList, Settings, Zap, MessageCircle, Wand2, Send, Download,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import QRCode from "qrcode";
import { supabase } from "./supabaseClient";

/* ============================================================
   VAAYANAM — "A Telugu Way of Giving Love and Respect"
   ============================================================ */

const OCCASIONS = [
  { id: "birthday", label: "Birthday", icon: CakeSlice, hue: "#FF6B9D", tags: ["fun", "celebration"] },
  { id: "first_birthday", label: "First Birthday", icon: CakeSlice, hue: "#FF8FB1", tags: ["baby", "fun", "celebration"] },
  { id: "newborn", label: "Newborn / Baby Shower", icon: Baby, hue: "#7FD8BE", tags: ["baby", "soft"] },
  { id: "naming", label: "Naming Ceremony", icon: Baby, hue: "#6FCBb0", tags: ["baby", "soft", "celebration"] },
  { id: "graduation", label: "Graduation", icon: GraduationCap, hue: "#6C8EFF", tags: ["milestone", "learning"] },
  { id: "wedding", label: "Wedding", icon: Gift, hue: "#E8739B", tags: ["milestone", "celebration"] },
  { id: "anniversary", label: "Anniversary", icon: Heart, hue: "#E0567E", tags: ["celebration", "milestone"] },
  { id: "engagement", label: "Engagement", icon: Heart, hue: "#EC6A8C", tags: ["celebration", "milestone"] },
  { id: "housewarming", label: "Housewarming", icon: Gift, hue: "#C98A3D", tags: ["milestone", "celebration"] },
  { id: "retirement", label: "Retirement", icon: Star, hue: "#9B8AC4", tags: ["milestone", "celebration"] },
  { id: "farewell", label: "Farewell", icon: Star, hue: "#8A8FB0", tags: ["milestone", "celebration"] },
  { id: "promotion", label: "Promotion", icon: Star, hue: "#5BA8C9", tags: ["milestone", "celebration"] },
  { id: "party", label: "Party / Get-together", icon: PartyPopper, hue: "#FF9F45", tags: ["fun", "celebration"] },
  { id: "diwali", label: "Diwali", icon: PartyPopper, hue: "#FFB454", tags: ["festive", "celebration"] },
  { id: "dussehra", label: "Dussehra / Navaratri", icon: PartyPopper, hue: "#E8A33D", tags: ["festive", "celebration"] },
  { id: "sankranti", label: "Sankranti / Pongal", icon: PartyPopper, hue: "#F0A030", tags: ["festive", "fun"] },
  { id: "ugadi", label: "Ugadi", icon: Sparkles, hue: "#7FB069", tags: ["festive", "celebration"] },
  { id: "ganesh", label: "Ganesh Chaturthi", icon: PartyPopper, hue: "#E07A5F", tags: ["festive", "celebration"] },
  { id: "rakhi", label: "Raksha Bandhan", icon: Heart, hue: "#D45D79", tags: ["festive", "celebration"] },
  { id: "holi", label: "Holi", icon: Sparkles, hue: "#C77DFF", tags: ["festive", "fun"] },
  { id: "christmas", label: "Christmas", icon: Gift, hue: "#2A9D8F", tags: ["festive", "celebration"] },
  { id: "newyear", label: "New Year", icon: Sparkles, hue: "#6C8EFF", tags: ["festive", "celebration", "fun"] },
  { id: "eid", label: "Eid", icon: Sparkles, hue: "#5C8A6A", tags: ["festive", "celebration"] },
  { id: "onam", label: "Onam", icon: Sparkles, hue: "#E9943A", tags: ["festive", "celebration"] },
  { id: "other", label: "Other", icon: Gift, hue: "#9a8da5", tags: ["celebration", "fun"] },
];

const money = (n) => `₹${Number(n).toFixed(2)}`;
const ADMIN_EMAIL = "ch.sambasiva998@gmail.com";
const NEW_DAYS = 14;
const CATEGORIES = ["STEM & Learning","Plush & Soft Toys","Classic & Wooden","Creative & Arts","Pretend Play","Baby & Infant","Games & Puzzles","Festive & Decor","Keepsakes & Gifts","Outdoor & Active"];
const ORDER_STAGES = ["paid", "packed", "shipped", "out_for_delivery", "delivered"];
const STAGE_LABELS = { pending: "Awaiting payment", paid: "Paid", packed: "Packed", shipped: "Shipped", out_for_delivery: "Out for delivery", delivered: "Delivered", cancelled: "Cancelled" };

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
function imagesFor(p) {
  const gallery = (p.product_images || []).slice().sort((a, b) => a.sort - b.sort).map((g) => g.url);
  if (gallery.length) return gallery;
  if (p.image_url) return [p.image_url];
  return [];
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

function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  const [msg, setMsg] = useState(null); const [busy, setBusy] = useState(false);
  const [brand, setBrand] = useState(null);
  useEffect(() => {
    supabase.from("store_settings").select("brand_name, tagline_en, tagline_te, logo_url").eq("id", 1).maybeSingle()
      .then(({ data }) => setBrand(data || {}));
  }, []);
  const bName = brand?.brand_name || "Vaayanam";
  const bEn = brand?.tagline_en || "A Telugu Way of Giving Love and Respect";
  const bTe = brand?.tagline_te || "";
  const bLogo = brand?.logo_url || null;
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
        {bLogo ? <img src={bLogo} alt={bName} style={{ width: 64, height: 64, objectFit: "contain", margin: "0 auto", display: "block" }} /> : <div style={{ fontSize: 40, textAlign: "center" }}>🪔</div>}
        <div style={S.authBrand}>{bName}</div>
        <div style={S.authMotto}>{bEn}</div>
        {bTe && <div style={{ ...S.authMotto, marginTop: 0 }}>{bTe}</div>}
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
  const [myOrders, setMyOrders] = useState([]);
  const [profile, setProfile] = useState({ full_name: "", phone: "", address: "" });  

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
    const [prod, prof, log, c, rem, setg, myord] = await Promise.all([
      supabase.from("products").select("*, product_images(*)").order("created_at", { ascending: false }),
      supabase.from("profiles").select("wallet, full_name, phone, address").eq("id", userId).single(),
      supabase.from("wallet_log").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
      supabase.from("cart_items").select("*").eq("user_id", userId),
      supabase.from("reminders").select("*").eq("user_id", userId).order("remind_date"),
      supabase.from("store_settings").select("*").eq("id", 1).maybeSingle(),
      supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]);
    setProducts(prod.data || []);
    setWallet(prof.data?.wallet ?? 0);
    setProfile({ full_name: prof.data?.full_name || "", phone: prof.data?.phone || "", address: prof.data?.address || "" });
    setWalletLog(log.data || []);
    setCart((c.data || []).map((r) => ({ product_id: r.product_id, qty: r.qty })));
    setReminders(rem.data || []);
    setSettings(setg.data || { upi_id: "", payee_name: "" });
    setMyOrders(myord.data || []);
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
    setCart([]); setCheckoutOpen(false); flash("Paid from wallet 🎉"); loadAll(); setTab("orders");
  }

  async function saveProfile(p) {
    const { error } = await supabase.from("profiles").update({ full_name: p.full_name, phone: p.phone, address: p.address }).eq("id", userId);
    if (error) { flash("Address save failed: " + error.message); return false; }
    setProfile(p); flash("Delivery details saved"); return true;
  }
  }

  if (loading) return <div style={S.center}><Loader2 className="spin" size={32} color="#C1432E" /></div>;

  const navItems = [
    { id: "shop", label: "Shop", icon: Package }, { id: "occasions", label: "Occasions", icon: Gift },
    { id: "design", label: "Design a Toy", icon: Wand2 }, { id: "orders", label: "My Orders", icon: ClipboardList },
    { id: "calendar", label: "Reminders", icon: Calendar },
    { id: "wallet", label: "Wallet", icon: Wallet },
  ];

  return (
    <div style={S.app}><style>{CSS}</style>
      <header style={S.header}>
        <div style={{ ...S.brand, cursor: "pointer" }} onClick={() => setTab("shop")} title="Go to shop">
          {settings?.logo_url ? <img src={settings.logo_url} alt={settings?.brand_name || "Vaayanam"} style={{ width: 40, height: 40, objectFit: "contain", borderRadius: 8 }} /> : <span style={S.logoMark}>🪔</span>}
          <div>
            <div style={S.brandName}>{settings?.brand_name || "Vaayanam"}</div>
            <div style={S.brandTag}>{settings?.tagline_en || "A Telugu Way of Giving Love and Respect"}</div>
            {settings?.tagline_te && <div style={S.brandTagTe}>{settings.tagline_te}</div>}
          </div>
        </div>
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
            {(() => {
              const upcoming = reminders.filter((r) => daysUntilYearly(r.remind_date) <= 14).sort((a, b) => daysUntilYearly(a.remind_date) - daysUntilYearly(b.remind_date));
              if (upcoming.length === 0) return null;
              return (
                <div style={S.reminderBanner}>
                  <Bell size={18} color="#C1432E" />
                  <div style={{ flex: 1 }}>
                    <b>Coming up:</b>{" "}
                    {upcoming.slice(0, 3).map((r, i) => {
                      const d = daysUntilYearly(r.remind_date);
                      return <span key={r.id}>{r.title} ({d === 0 ? "today" : `${d}d`}){i < Math.min(upcoming.length, 3) - 1 ? ", " : ""}</span>;
                    })}
                    {upcoming.length > 3 && ` +${upcoming.length - 3} more`}
                  </div>
                  <button className="ghostbtn" onClick={() => setTab("calendar")}>View</button>
                </div>
              );
            })()}
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
        {tab === "orders" && <MyOrders orders={myOrders} onShop={() => setTab("shop")} />}
        {tab === "calendar" && <RemindersPanel userId={userId} reminders={reminders} setReminders={setReminders} flash={flash} onShop={(occ) => { setActiveOcc(occ); setTab("occasions"); }} />}
        {tab === "wallet" && <WalletPanel wallet={wallet} log={walletLog} onRecharge={() => setRechargeOpen(true)} hasUpi={!!settings?.upi_id?.trim()} orders={myOrders} profile={profile} onSaveProfile={saveProfile} />}
        {tab === "cart" && <CartPanel items={cartDetailed} subtotal={subtotal} wallet={wallet} onSetQty={setItemQty} onCheckout={() => setCheckoutOpen(true)} onWalletPay={payWithWallet} onShop={() => setTab("shop")} hasAddress={!!profile.address?.trim()} onNeedAddress={() => setTab("wallet")} />}
        {tab === "admin" && isAdmin && <AdminPanel flash={flash} onChanged={loadAll} products={products} settings={settings} />}
      </main>

      {detailProduct && (
        <ProductDetail p={detailProduct} qty={qtyOf(detailProduct.id)} onClose={() => setDetailProduct(null)}
          onInc={() => setItemQty(detailProduct.id, qtyOf(detailProduct.id) + 1)} onDec={() => setItemQty(detailProduct.id, qtyOf(detailProduct.id) - 1)} />
      )}
      {checkoutOpen && (
        <CheckoutModal items={cartDetailed} subtotal={subtotal} settings={settings} wallet={wallet}
          onClose={() => setCheckoutOpen(false)} onConfirm={createPendingOrder} onWalletPay={payWithWallet}
          onDone={async () => { await supabase.from("cart_items").delete().eq("user_id", userId); setCart([]); setCheckoutOpen(false); flash("Order placed — pending confirmation"); loadAll(); setTab("orders"); }} />
      )}
      {rechargeOpen && <RechargeModal userId={userId} settings={settings} onClose={() => setRechargeOpen(false)} flash={flash} />}

      <button className="aifab" onClick={() => setAiOpen(true)} title="Ask Vaayanam AI"><MessageCircle size={22} /></button>
      {aiOpen && <AIAssistant products={products} onClose={() => setAiOpen(false)} />}

      {toast && <div className="toast">{toast}</div>}
      <footer style={S.footer}><span>🪔 {settings?.brand_name || "Vaayanam"}</span><span style={{ color: "#9a8da5" }}>Signed in as {session.user.email}</span></footer>
    </div>
  );

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
          <span style={S.price}>{money(p.price)}{qty > 0 && <span style={S.lineHint}> · {qty} = {money(p.price * qty)}</span>}</span>
          {qty === 0 ? <button className="addbtn" onClick={onInc}><Plus size={15} /> Add</button> : (
            <div style={S.stepper}><button className="qtybtn" onClick={onDec}><Minus size={14} /></button><span style={S.qty}>{qty}</span><button className="qtybtn" onClick={onInc}><Plus size={14} /></button></div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProductDetail({ p, qty, onClose, onInc, onDec }) {
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
      </div>
    </Modal>
  );
}

function RechargeModal({ userId, settings, onClose, flash }) {
  const [amount, setAmount] = useState("");
  const [stage, setStage] = useState("amount");
  const [busy, setBusy] = useState(false);
  const hasUpi = settings?.upi_id?.trim();
  const upiString = useMemo(() => (hasUpi && amount) ? buildUpiString({ upiId: settings.upi_id, payeeName: settings.payee_name, amount: Number(amount), note: "Vaayanam wallet recharge" }) : "", [hasUpi, settings, amount]);
  async function startRecharge() {
    const amt = Number(amount);
    if (!amt || amt <= 0) { flash("Enter an amount"); return; }
    setBusy(true);
    const { error } = await supabase.from("topup_requests").insert({ user_id: userId, amount: amt, status: "pending" });
    setBusy(false);
    if (error) { flash(error.message); return; }
    setStage("qr");
  }
  return (
    <Modal onClose={onClose}>
      <h3 style={S.modalTitle}>Recharge wallet</h3>
      {stage === "amount" ? (
        <>
          {!hasUpi && <div style={S.warn}>The shop hasn't set a UPI ID yet — recharge isn't available.</div>}
          <div style={S.adminLabel}>Amount to add (₹)</div>
          <input style={{ ...S.input, width: "100%", marginBottom: 12 }} type="number" placeholder="e.g. 500" value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {[100, 250, 500, 1000].map((a) => <button key={a} className="tagchip" style={{ textTransform: "none" }} onClick={() => setAmount(String(a))}>₹{a}</button>)}
          </div>
          <button className="cta full" disabled={busy || !hasUpi} onClick={startRecharge}>{busy ? <Loader2 className="spin" size={16} /> : <QrCode size={16} />} Generate recharge QR</button>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={S.qrWrap}><UpiQR value={upiString} size={210} /></div>
          <div style={S.qrHint}>Scan to pay {money(Number(amount))} to <b>{settings.upi_id}</b></div>
          <a className="cta full" href={upiString} style={{ textDecoration: "none", marginBottom: 10 }}>Open in UPI app</a>
          <p style={S.qrNote}>After you pay, the shop confirms it and <b>{money(Number(amount))}</b> is added to your wallet live.</p>
          <button className="ghostbtn" style={{ width: "100%", padding: 12 }} onClick={onClose}>Done</button>
        </div>
      )}
    </Modal>
  );
}

function AIAssistant({ products, onClose }) {
  const [messages, setMessages] = useState([{ role: "assistant", content: "Namaste! 🪔 I'm your Vaayanam assistant. Ask me about toys, gifts, or festival ideas." }]);
  const [input, setInput] = useState(""); const [busy, setBusy] = useState(false);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);
  async function send() {
    const text = input.trim(); if (!text || busy) return;
    const next = [...messages, { role: "user", content: text }];
    setMessages(next); setInput(""); setBusy(true);
    try {
      const { data, error } = await supabase.from("orders").insert({ user_id: userId, total: subtotal, items, status: "pending", ship_name: profile.full_name, ship_phone: profile.phone, ship_address: profile.address }).select().single();
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

function DesignStudio({ flash }) {
  const [festival, setFestival] = useState(FESTIVALS[0].id);
  const [prompt, setPrompt] = useState(""); const [image, setImage] = useState(null); const [busy, setBusy] = useState(false);
  const fest = FESTIVALS.find((f) => f.id === festival);
  async function generate() {
    const p = prompt.trim(); if (!p) { flash("Type or pick a prompt first"); return; }
    setBusy(true); setImage(null);
    try {
      const { data, error } = await supabase.functions.invoke("ai-toy-image", { body: { prompt: p } });
      if (error) throw error;
      if (data?.image) setImage(data.image); else throw new Error(data?.error || "No image returned");
    } catch (e) { flash("Image generation failed: " + (e.message || e)); }
    finally { setBusy(false); }
  }
  return (
    <>
      <h2 style={S.sectionTitle}>Design your own toy <Wand2 size={22} style={{ verticalAlign: "-3px" }} /></h2>
      <p style={S.sectionSub}>Pick a festival theme or write your own idea. We'll generate a concept image to share with our toy makers.</p>
      <div style={S.adminLabel}>Festival theme</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>{FESTIVALS.map((f) => (
        <button key={f.id} className={`festchip ${festival === f.id ? "festchip-on" : ""}`} onClick={() => setFestival(f.id)}><span style={{ fontSize: 16 }}>{f.emoji}</span> {f.name}</button>
      ))}</div>
      <div style={S.adminLabel}>Theme prompts for {fest.name} — tap to use</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>{fest.prompts.map((pr, i) => <button key={i} className="promptchip" onClick={() => setPrompt(pr)}>{pr}</button>)}</div>
      <div style={S.adminLabel}>More ideas</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>{EXTRA_PROMPT_IDEAS.map((pr, i) => <button key={i} className="tagchip" style={{ textTransform: "none" }} onClick={() => setPrompt(pr)}>{pr}</button>)}</div>
      <textarea style={{ ...S.input, width: "100%", minHeight: 80, resize: "vertical", marginBottom: 12 }} placeholder="Describe your toy idea…" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
      <button className="cta" disabled={busy} onClick={generate}>{busy ? <Loader2 className="spin" size={16} /> : <Wand2 size={16} />} Generate concept</button>
      {busy && <div style={{ ...S.empty, padding: "40px 0" }}><Loader2 className="spin" size={28} color="#C1432E" /><p>Designing your toy…</p></div>}
      {image && (
        <div style={{ marginTop: 24, textAlign: "center" }}>
          <img src={image} alt="Toy concept" style={{ maxWidth: "100%", width: 380, borderRadius: 18, border: "1px solid #efe3f0" }} />
          <div style={{ marginTop: 12 }}><a className="cta" href={image} download="vaayanam-toy-concept.png" style={{ textDecoration: "none" }}><Download size={16} /> Download concept</a></div>
          <p style={S.qrNote}>AI concept image for inspiration. Share with our toy makers to customize.</p>
        </div>
      )}
    </>
  );
}

function OrderTracker({ stage }) {
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

function OrderCard({ o }) {
  return (
    <div style={S.myOrderCard}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontWeight: 800 }}>Order #{o.id} · {money(o.total)}</div>
        <div style={{ fontSize: 12.5, color: "#9a8da5" }}>{prettyDateTime(o.created_at)}</div>
      </div>
      <div style={{ fontSize: 13, color: "#5b5066", margin: "6px 0 14px" }}>{(o.items || []).map((it, n) => <span key={n}>{it.name} ×{it.qty}{n < o.items.length - 1 ? ", " : ""}</span>)}</div>
      <OrderTracker stage={o.stage || o.status} />
      {o.courier && (o.stage === "shipped" || o.stage === "out_for_delivery" || o.stage === "delivered") && (
        <div style={S.courierBox}>
          🚚 <b>{o.courier}</b>
          {o.tracking_link && <> · <a href={o.tracking_link} target="_blank" rel="noopener noreferrer" style={{ color: "#C1432E", fontWeight: 800 }}>Track package</a></>}
        </div>
      )}
    </div>
  );
}

function MyOrders({ orders, onShop }) {
  if (!orders || orders.length === 0)
    return <div style={S.empty}><ClipboardList size={32} color="#d6c9dd" /><p>No orders yet.</p><button className="cta" onClick={onShop}>Start shopping</button></div>;
  return (
    <>
      <h2 style={S.sectionTitle}>My orders</h2>
      <p style={S.sectionSub}>Track each order from payment to delivery.</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>{orders.map((o) => <OrderCard key={o.id} o={o} />)}</div>
    </>
  );
}

function CheckoutModal({ items, subtotal, settings, wallet, onClose, onConfirm, onWalletPay, onDone }) {
  const [order, setOrder] = useState(null); const [creating, setCreating] = useState(false);
  const hasUpi = settings?.upi_id?.trim(); const canWallet = wallet >= subtotal && subtotal > 0;
  async function startQR() { setCreating(true); const o = await onConfirm(); setCreating(false); if (o) setOrder(o); }
  const upiString = useMemo(() => hasUpi ? buildUpiString({ upiId: settings.upi_id, payeeName: settings.payee_name, amount: subtotal, note: order ? `Vaayanam #${order.id}` : "Vaayanam cart" }) : "", [hasUpi, settings, subtotal, order]);
  return (
    <Modal onClose={onClose}>
      <h3 style={S.modalTitle}>Checkout</h3>
      <div style={S.checkoutRows}>{items.map((i) => <div key={i.id} style={S.checkoutRow}><span>{i.name} ×{i.qty}</span><span>{money(i.price * i.qty)}</span></div>)}</div>
      <div style={S.payBox}>
        <div style={{ ...S.payLine, ...S.payTotal }}><span>Total</span><span>{money(subtotal)}</span></div>
        <div style={S.payLine}><span>Wallet balance</span><span>{money(wallet)}</span></div>
        {subtotal > 2000 && <div style={{ ...S.payLine, color: "#1faa6b", fontWeight: 800 }}><span>🎁 Reward on approval</span><span>+₹50</span></div>}
      </div>
      {canWallet && <button className="cta full" style={{ marginBottom: 12 }} onClick={onWalletPay}><Zap size={16} /> Pay {money(subtotal)} from wallet</button>}
      {!hasUpi ? <div style={S.warn}>No UPI ID set up yet. {canWallet ? "Pay from wallet above." : "Ask the shop to add one."}</div> :
        !order ? <button className="ghostbtn" style={{ width: "100%", padding: 13 }} disabled={creating} onClick={startQR}>{creating ? <Loader2 className="spin" size={16} /> : <QrCode size={16} />} Pay by UPI QR instead</button> : (
        <div style={{ textAlign: "center" }}>
          <div style={S.qrWrap}><UpiQR value={upiString} size={210} /></div>
          <div style={S.qrHint}>Scan to pay {money(subtotal)} to <b>{settings.upi_id}</b></div>
          <a className="cta full" href={upiString} style={{ textDecoration: "none", marginBottom: 10 }}>Open in UPI app</a>
          <p style={S.qrNote}>Order #{order.id} is <b>pending</b> until the shop confirms payment.</p>
          <button className="ghostbtn" style={{ width: "100%", padding: 12 }} onClick={onDone}>I've paid — place order</button>
        </div>
      )}
    </Modal>
  );
}

function AdminPanel({ flash, onChanged, products, settings }) {
  const [sub, setSub] = useState("products");
  return (
    <>
      <div style={S.adminTabs}>
        <button className={`subtab ${sub === "products" ? "subtab-on" : ""}`} onClick={() => setSub("products")}><Package size={15} /> Products</button>
        <button className={`subtab ${sub === "orders" ? "subtab-on" : ""}`} onClick={() => setSub("orders")}><ClipboardList size={15} /> Orders</button>
        <button className={`subtab ${sub === "topups" ? "subtab-on" : ""}`} onClick={() => setSub("topups")}><CreditCard size={15} /> Top-ups</button>
        <button className={`subtab ${sub === "settings" ? "subtab-on" : ""}`} onClick={() => setSub("settings")}><Settings size={15} /> Settings</button>
      </div>
      {sub === "products" && <AdminProducts flash={flash} onChanged={onChanged} products={products} />}
      {sub === "orders" && <AdminOrders flash={flash} />}
      {sub === "topups" && <AdminTopups flash={flash} />}
      {sub === "settings" && <AdminSettings flash={flash} onChanged={onChanged} settings={settings} />}
    </>
  );
}

function AdminTopups({ flash }) {
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

function AdminSettings({ flash, onChanged, settings }) {
  const [upiId, setUpiId] = useState(settings?.upi_id || ""); const [payeeName, setPayeeName] = useState(settings?.payee_name || ""); const [busy, setBusy] = useState(false);
  const [brandName, setBrandName] = useState(settings?.brand_name || "");
  const [taglineEn, setTaglineEn] = useState(settings?.tagline_en || "");
  const [taglineTe, setTaglineTe] = useState(settings?.tagline_te || "");
  const [logoUrl, setLogoUrl] = useState(settings?.logo_url || "");
  const [logoBusy, setLogoBusy] = useState(false);
  async function save() {
    if (!upiId.trim()) { flash("7981166388-2@ybl"); return; }
    setBusy(true);
    const { error } = await supabase.from("store_settings").upsert({
      id: 1, upi_id: upiId.trim(), payee_name: payeeName.trim(),
      brand_name: brandName.trim() || "Vaayanam", tagline_en: taglineEn.trim(), tagline_te: taglineTe.trim(),
      logo_url: logoUrl || null, updated_at: new Date().toISOString(),
    });
    setBusy(false);
    if (error) { flash("Save failed: " + error.message); return; }
    flash("Saved"); onChanged();
  }
  async function uploadLogo(file) {
    if (!file) return;
    setLogoBusy(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `logo-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (upErr) throw upErr;
      const url = supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl;
      setLogoUrl(url);
      flash("Logo uploaded — click Save to apply");
    } catch (e) { flash("Logo upload failed: " + e.message); }
    finally { setLogoBusy(false); }
  }
  return (
    <>
      <h2 style={S.sectionTitle}>Store settings</h2>
      <p style={S.sectionSub}>Branding, payment, and how money works.</p>

      <h3 style={S.subhead}>Branding</h3>
      <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 12, marginBottom: 8 }}>
        <div>
          <div style={S.adminLabel}>Logo image</div>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {logoUrl ? <img src={logoUrl} alt="Logo" style={{ width: 56, height: 56, objectFit: "contain", borderRadius: 10, border: "1px solid #f0e3ec" }} /> : <span style={{ fontSize: 40 }}>🪔</span>}
            <div>
              <input type="file" accept="image/*" onChange={(e) => uploadLogo(e.target.files?.[0])} />
              {logoBusy && <Loader2 className="spin" size={16} color="#C1432E" />}
              {logoUrl && <button className="linkbtn" style={{ display: "block", marginTop: 6 }} onClick={() => setLogoUrl("")}>Remove logo (use emoji)</button>}
            </div>
          </div>
        </div>
        <div><div style={S.adminLabel}>Brand name</div><input style={{ ...S.input, width: "100%" }} placeholder="Vaayanam" value={brandName} onChange={(e) => setBrandName(e.target.value)} /></div>
        <div><div style={S.adminLabel}>Tagline (English)</div><input style={{ ...S.input, width: "100%" }} placeholder="A Telugu Way of Giving Love and Respect" value={taglineEn} onChange={(e) => setTaglineEn(e.target.value)} /></div>
        <div><div style={S.adminLabel}>Tagline (Telugu)</div><input style={{ ...S.input, width: "100%" }} placeholder="ప్రేమను, గౌరవాన్ని పంచే తెలుగు మార్గం" value={taglineTe} onChange={(e) => setTaglineTe(e.target.value)} /></div>
      </div>

      <h3 style={S.subhead}>Payment</h3>
      <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 12 }}>
        <div><div style={S.adminLabel}>UPI ID (VPA)</div><input style={{ ...S.input, width: "100%" }} placeholder="yourname@okbank" value={upiId} onChange={(e) => setUpiId(e.target.value)} /></div>
        <div><div style={S.adminLabel}>Payee name</div><input style={{ ...S.input, width: "100%" }} placeholder="Vaayanam" value={payeeName} onChange={(e) => setPayeeName(e.target.value)} /></div>
        <button className="cta" disabled={busy} onClick={save}>{busy ? <Loader2 className="spin" size={16} /> : <Check size={16} />} Save all settings</button>
      </div>
      <div style={S.securityNote}><b>How money works:</b> customers pay your UPI directly. Everything stays <b>pending</b> until you confirm receipt and approve it here. Approving credits the customer's wallet (purchases over ₹2000 add a ₹50 reward).</div>
    </>
  );
}

function AdminOrders({ flash }) {
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
            </div>
            {o.status === "pending" && <div style={{ display: "flex", flexDirection: "column", gap: 6 }}><button className="cta" style={{ padding: "8px 14px", fontSize: 13 }} disabled={workingId === o.id} onClick={() => approve(o)}>{workingId === o.id ? <Loader2 className="spin" size={14} /> : <Check size={14} />} Approve & credit</button><button className="ghostbtn" onClick={() => cancel(o.id)}>Cancel</button></div>}
            {o.status === "paid" && <AdminOrderControls o={o} onStage={setStage} onCourier={saveCourier} />}
          </div>
        ))}</div>
      )}
    </>
  );
}

function AdminOrderControls({ o, onStage, onCourier }) {
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

function AdminProducts({ flash, onChanged, products }) {
  const [name, setName] = useState(""); const [description, setDescription] = useState("");
  const [price, setPrice] = useState(""); const [category, setCategory] = useState("");
  const [emoji, setEmoji] = useState("🎁"); const [rating, setRating] = useState("4.5");
  const [ageRange, setAgeRange] = useState(""); const [tags, setTags] = useState([]);
  const [files, setFiles] = useState([]); const [busy, setBusy] = useState(false);
  const ALL_TAGS = ["fun", "celebration", "baby", "soft", "milestone", "learning", "festive"];
  function toggleTag(t) { setTags((c) => c.includes(t) ? c.filter((x) => x !== t) : [...c, t]); }
  async function save() {
    if (!name.trim() || !price) { flash("Name and price are required"); return; }
    if (files.length > 6) { flash("Up to 6 images"); return; }
    setBusy(true);
    try {
      const urls = [];
      for (const f of files) {
        const ext = f.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, f, { upsert: false });
        if (upErr) throw upErr;
        urls.push(supabase.storage.from("product-images").getPublicUrl(path).data.publicUrl);
      }
      const { data: prod, error } = await supabase.from("products").insert({
        name: name.trim(), description: description.trim() || null, price: Number(price),
        category: category || "Toys", emoji, rating: Number(rating) || 4.5, age_range: ageRange.trim() || "All",
        tags, image_url: urls[0] || null,
      }).select().single();
      if (error) throw error;
      if (urls.length) {
        const rows = urls.map((u, i) => ({ product_id: prod.id, url: u, sort: i }));
        const { error: gErr } = await supabase.from("product_images").insert(rows);
        if (gErr) throw gErr;
      }
      flash("Toy added! 🎉");
      setName(""); setDescription(""); setPrice(""); setCategory(""); setEmoji("🎁"); setRating("4.5"); setAgeRange(""); setTags([]); setFiles([]);
      onChanged();
    } catch (e) { flash("Add failed: " + e.message); }
    finally { setBusy(false); }
  }
  async function deleteProduct(id) { const { error } = await supabase.from("products").delete().eq("id", id); if (error) flash("Delete failed: " + error.message); else { flash("Removed"); onChanged(); } }
  return (
    <>
      <h2 style={S.sectionTitle}>Add a toy</h2>
      <p style={S.sectionSub}>Upload up to 6 photos. New products are marked NEW for {NEW_DAYS} days.</p>
      <div style={S.adminForm}>
        <input style={S.input} placeholder="Toy name" value={name} onChange={(e) => setName(e.target.value)} />
        <input style={S.input} type="number" step="0.01" placeholder="Price ₹ e.g. 299" value={price} onChange={(e) => setPrice(e.target.value)} />
        <select style={S.input} value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select category…</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input style={S.input} placeholder="Age range e.g. 3-7" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} />
        <input style={S.input} placeholder="Fallback emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
        <input style={S.input} type="number" step="0.1" min="0" max="5" placeholder="Rating 0-5" value={rating} onChange={(e) => setRating(e.target.value)} />
      </div>
      <div style={{ margin: "0 0 12px" }}><textarea style={{ ...S.input, width: "100%", minHeight: 90, resize: "vertical" }} placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} /></div>
      <div style={{ margin: "4px 0 16px" }}><div style={S.adminLabel}>Occasion tags</div><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{ALL_TAGS.map((t) => <button key={t} onClick={() => toggleTag(t)} className={`tagchip ${tags.includes(t) ? "tagchip-on" : ""}`}>{t}</button>)}</div></div>
      <div style={{ margin: "4px 0 18px" }}>
        <div style={S.adminLabel}>Photos (up to 6) — {files.length} selected</div>
        <input type="file" accept="image/*" multiple onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 6))} />
      </div>
      <button className="cta" disabled={busy} onClick={save}>{busy ? <Loader2 className="spin" size={16} /> : <Plus size={16} />} Add toy</button>
      <h3 style={S.subhead}>Current toys ({products.length})</h3>
      <div style={S.adminList}>
        {products.length === 0 && <div style={S.empty}><Package size={28} color="#d6c9dd" /><p>No toys yet.</p></div>}
        {products.map((p) => { const imgs = imagesFor(p); return (
          <div key={p.id} style={S.adminRow}>
            <div className="cartArt" style={{ fontSize: 26, width: 46, height: 46 }}>{imgs.length ? <img src={imgs[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} /> : p.emoji}</div>
            <div style={{ flex: 1 }}><div style={{ fontWeight: 800 }}>{p.name} {imgs.length > 1 && <span style={{ fontSize: 12, color: "#9a8da5" }}>· {imgs.length} photos</span>} {isNew(p.created_at) && <span className="newbadge-inline">NEW</span>}</div><div style={{ fontSize: 13, color: "#9a8da5" }}>{money(p.price)} · {p.category}</div></div>
            <button className="iconbtn" onClick={() => deleteProduct(p.id)}><Trash2 size={16} /></button>
          </div>
        ); })}
      </div>
    </>
  );
}

function RemindersPanel({ userId, reminders, setReminders, flash, onShop }) {
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

function WalletPanel({ wallet, log, onRecharge, hasUpi, orders, profile, onSaveProfile }) {
  const [fn, setFn] = useState(profile?.full_name || "");
  const [ph, setPh] = useState(profile?.phone || "");
  const [ad, setAd] = useState(profile?.address || "");
  const [savingAddr, setSavingAddr] = useState(false);
  async function saveAddr() {
    if (!fn.trim() || !ph.trim() || !ad.trim()) return;
    setSavingAddr(true);
    await onSaveProfile({ full_name: fn.trim(), phone: ph.trim(), address: ad.trim() });
    setSavingAddr(false);
  }
  return (
    <>
      <h2 style={S.sectionTitle}>Your wallet</h2>
      <p style={S.sectionSub}>Recharge via UPI — the shop confirms your payment and your balance updates live.</p>
      <div style={S.walletCard}>
        <div style={S.walletGlow} />
        <div style={S.walletLabel}><CreditCard size={16} /> Balance</div>
        <div style={S.walletBalance}>{money(wallet)}</div>
        <button className="topup" onClick={onRecharge} disabled={!hasUpi}><QrCode size={15} style={{ verticalAlign: "-2px" }} /> Recharge via UPI</button>
        {!hasUpi && <div style={{ fontSize: 12, marginTop: 10, opacity: .85 }}>Recharge available once the shop sets a UPI ID.</div>}
      </div>
      <h3 style={S.subhead}>Activity</h3>
      <div style={S.logList}>{log.length === 0 ? <div style={{ ...S.empty, padding: "30px 0" }}><p>No activity yet.</p></div> : log.map((e) => (
        <div key={e.id} style={S.logRow}>
          <div><div style={S.logType}>{e.type}</div><div style={S.logWhen}>{prettyDateTime(e.created_at)}</div></div>
          <div style={{ ...S.logAmt, color: e.amount < 0 ? "#C1432E" : "#1faa6b" }}>{e.amount < 0 ? "-" : "+"}{money(Math.abs(e.amount))}</div>
        </div>
      ))}</div>
      <h3 style={S.subhead}>Delivery details</h3>
      <p style={{ fontSize: 13.5, color: "#7a7080", margin: "0 0 12px" }}>Saved to your account and used for shipping your orders.</p>
      <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 10, marginBottom: 8 }}>
        <input style={{ ...S.input, width: "100%" }} placeholder="Full name" value={fn} onChange={(e) => setFn(e.target.value)} />
        <input style={{ ...S.input, width: "100%" }} placeholder="Phone number" value={ph} onChange={(e) => setPh(e.target.value)} />
        <textarea style={{ ...S.input, width: "100%", minHeight: 80, resize: "vertical" }} placeholder="Full delivery address with pincode" value={ad} onChange={(e) => setAd(e.target.value)} />
        <button className="cta" disabled={savingAddr || !fn.trim() || !ph.trim() || !ad.trim()} onClick={saveAddr}>{savingAddr ? <Loader2 className="spin" size={16} /> : <Check size={16} />} Save delivery details</button>
      </div>
      <h3 style={S.subhead}>Recent orders</h3>
      {(!orders || orders.length === 0) ? <p style={{ color: "#9a8da5", fontSize: 14 }}>No orders yet.</p> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{orders.slice(0, 5).map((o) => <OrderCard key={o.id} o={o} />)}</div>
      )}
    </>
  );
}

function CartPanel({ items, subtotal, wallet, onSetQty, onCheckout, onWalletPay, onShop, hasAddress, onNeedAddress }) {
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

function Modal({ children, onClose, wide }) {
  return <div className="overlay" onClick={onClose}><div className="modal" style={wide ? { maxWidth: 560 } : {}} onClick={(e) => e.stopPropagation()}><button className="iconbtn modalClose" onClick={onClose}><X size={18} /></button>{children}</div></div>;
}

function daysUntil(s) { const t = new Date(); t.setHours(0,0,0,0); const d = new Date(s); d.setHours(0,0,0,0); return Math.round((d - t) / 86400000); }
function prettyDate(s) { return new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
function prettyDateTime(s) { return new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }
function nextYearlyDate(dateStr) {
  const orig = new Date(dateStr);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let next = new Date(today.getFullYear(), orig.getMonth(), orig.getDate());
  next.setHours(0, 0, 0, 0);
  if (next < today) next = new Date(today.getFullYear() + 1, orig.getMonth(), orig.getDate());
  return next;
}
function daysUntilYearly(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((nextYearlyDate(dateStr) - today) / 86400000);
}

const S = {
  app: { fontFamily: "'Nunito', system-ui, sans-serif", background: "#FDF7F0", minHeight: "100vh", color: "#2a1a3e" },
  center: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FDF7F0" },
  authWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "linear-gradient(120deg,#FFE9D6,#F3E0F0)" },
  authCard: { background: "#fff", borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 360, boxShadow: "0 20px 50px rgba(60,30,50,.14)", display: "flex", flexDirection: "column", gap: 12 },
  authBrand: { fontWeight: 900, fontSize: 30, textAlign: "center", color: "#C1432E" },
  authMotto: { fontSize: 12.5, color: "#C1432E", textAlign: "center", fontWeight: 700, marginTop: -6, fontStyle: "italic" },
  authTag: { fontSize: 14, color: "#9a8da5", textAlign: "center", marginBottom: 4, fontWeight: 600 },
  authMsg: { fontSize: 13, color: "#5b5066", textAlign: "center", background: "#faf3f8", padding: "10px 12px", borderRadius: 10, fontWeight: 600 },
  authSwitch: { fontSize: 13.5, color: "#9a8da5", textAlign: "center", fontWeight: 600 },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", background: "#fff", borderBottom: "1px solid #f0e3ec", position: "sticky", top: 0, zIndex: 50, flexWrap: "wrap", gap: 12 },
  brand: { display: "flex", alignItems: "center", gap: 12 }, logoMark: { fontSize: 30 },
  brandName: { fontWeight: 900, fontSize: 23, color: "#C1432E" }, brandTag: { fontSize: 10.5, color: "#C1432E", fontWeight: 700, fontStyle: "italic" },
  brandTagTe: { fontSize: 10.5, color: "#8a5fb0", fontWeight: 700 },
  nav: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  main: { maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" },
  hero: { display: "flex", gap: 24, alignItems: "center", background: "linear-gradient(120deg,#FFE9D6,#F3E0F0)", borderRadius: 28, padding: "40px 36px", marginBottom: 28, overflow: "hidden", flexWrap: "wrap" },
  reminderBanner: { display: "flex", alignItems: "center", gap: 12, background: "#FFF3EC", border: "1px solid #ffd9c4", borderRadius: 16, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "#5b5066", fontWeight: 600 },
  heroInner: { flex: "1 1 320px" },
  heroEyebrow: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#C1432E", background: "#fff", padding: "5px 12px", borderRadius: 999, marginBottom: 14 },
  heroTitle: { fontSize: 38, fontWeight: 900, lineHeight: 1.08, margin: "0 0 12px", color: "#3a2150" },
  heroSub: { fontSize: 16, color: "#5b5066", maxWidth: 440, margin: "0 0 22px", lineHeight: 1.5 },
  heroArt: { flex: "1 1 220px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, fontSize: 44, justifyItems: "center" },
  searchRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 20, flexWrap: "wrap" },
  searchWrap: { display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #f0e3ec", borderRadius: 14, padding: "11px 16px", flex: 1, minWidth: 240 },
  search: { border: "none", outline: "none", fontSize: 15, flex: 1, background: "transparent", fontFamily: "inherit" },
  resultCount: { fontSize: 13, color: "#9a8da5", fontWeight: 700 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 18 },
  cardBody: { padding: "14px 16px 16px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cat: { fontSize: 11, fontWeight: 800, color: "#8a5fb0", background: "#f3eafa", padding: "3px 9px", borderRadius: 999 },
  rating: { display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: "#7a7080" },
  cardName: { fontWeight: 800, fontSize: 16, marginBottom: 3, cursor: "pointer" },
  cardDesc: { fontSize: 13, color: "#5b5066", marginBottom: 8, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  cardMeta: { fontSize: 12.5, color: "#9a8da5", marginBottom: 12, fontWeight: 600 },
  cardFoot: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  price: { fontWeight: 900, fontSize: 18, color: "#3a2150" },
  lineHint: { fontSize: 12, fontWeight: 700, color: "#9a8da5" },
  stepper: { display: "flex", alignItems: "center", gap: 6, background: "#f6eef2", borderRadius: 10, padding: 4 },
  qty: { fontWeight: 800, minWidth: 22, textAlign: "center" },
  sectionTitle: { fontSize: 28, fontWeight: 900, margin: "0 0 4px", color: "#3a2150" },
  sectionSub: { fontSize: 15, color: "#7a7080", margin: "0 0 22px" },
  subhead: { fontSize: 18, fontWeight: 800, margin: "28px 0 14px" },
  occRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 },
  occIcon: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 12 },
  suggestHead: { display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 16, margin: "8px 0 18px", color: "#3a2150" },
  reminderForm: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 10, marginBottom: 24 },
  input: { padding: "11px 14px", borderRadius: 12, border: "1px solid #e9dce6", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" },
  reminderList: { display: "flex", flexDirection: "column", gap: 12 },
  reminderTitle: { fontWeight: 800, fontSize: 16 }, reminderMeta: { fontSize: 13, color: "#9a8da5", fontWeight: 600 },
  adminTabs: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  adminForm: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 8 },
  adminLabel: { fontSize: 13, fontWeight: 800, color: "#5b5066", marginBottom: 8 },
  adminList: { display: "flex", flexDirection: "column", gap: 10 },
  adminRow: { display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid #f0e3ec", borderRadius: 14, padding: 12 },
  orderRow: { display: "flex", alignItems: "flex-start", gap: 14, background: "#fff", border: "1px solid #f0e3ec", borderRadius: 14, padding: 16 },
  statusPill: { fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 999, marginLeft: 10, textTransform: "uppercase" },
  pillPending: { background: "#fff0e0", color: "#E8A33D" }, pillPaid: { background: "#e7f7ef", color: "#1faa6b" }, pillCancel: { background: "#fdeceb", color: "#C1432E" },
  securityNote: { marginTop: 24, background: "#fff6ee", border: "1px solid #ffe0c4", borderRadius: 14, padding: 16, fontSize: 13.5, color: "#8a5a2e", lineHeight: 1.55, maxWidth: 560 },
  qrWrap: { display: "inline-flex", padding: 14, background: "#fff", border: "1px solid #f0e3ec", borderRadius: 18, marginBottom: 12 },
  qrHint: { fontSize: 14, color: "#5b5066", marginBottom: 14, fontWeight: 600 },
  qrNote: { fontSize: 12.5, color: "#9a8da5", margin: "12px 0", lineHeight: 1.5 },
  carousel: { position: "relative", background: "linear-gradient(135deg,#FFF3EC,#F7EEF8)", borderRadius: 18, minHeight: 280, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  carouselImg: { width: "100%", maxHeight: 360, objectFit: "contain" },
  thumbs: { display: "flex", gap: 8, flexWrap: "wrap" },
  thumb: { width: 56, height: 56, objectFit: "cover", borderRadius: 10, cursor: "pointer", border: "2px solid transparent", opacity: .7 },
  thumbOn: { borderColor: "#C1432E", opacity: 1 },
  myOrderCard: { background: "#fff", border: "1px solid #f0e3ec", borderRadius: 16, padding: 18 },
  trackRow: { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 4, position: "relative" },
  trackStep: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", textAlign: "center" },
  trackDot: { width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, zIndex: 2 },
  trackLabel: { fontSize: 10.5, marginTop: 6, lineHeight: 1.25, maxWidth: 64 },
  trackLine: { position: "absolute", top: 13, left: "50%", width: "100%", height: 3, zIndex: 1 },
  trackPill: { display: "inline-block", padding: "6px 14px", borderRadius: 999, fontSize: 13, fontWeight: 800 },
  courierBox: { marginTop: 14, padding: "10px 14px", background: "#f6eef2", borderRadius: 12, fontSize: 13.5, color: "#5b5066", fontWeight: 600 },
  shipBox: { marginTop: 8, padding: "8px 12px", background: "#fff6ee", border: "1px solid #ffe0c4", borderRadius: 10, fontSize: 12.5, color: "#8a5a2e", lineHeight: 1.5 },
  walletCard: { position: "relative", background: "linear-gradient(135deg,#C1432E,#8a5fb0)", borderRadius: 24, padding: "30px 30px 26px", color: "#fff", overflow: "hidden", maxWidth: 420 },
  walletGlow: { position: "absolute", width: 200, height: 200, background: "rgba(255,255,255,0.18)", borderRadius: "50%", top: -70, right: -40 },
  walletLabel: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, opacity: 0.92 },
  walletBalance: { fontSize: 44, fontWeight: 900, margin: "6px 0 18px", letterSpacing: "-0.02em" },
  logList: { display: "flex", flexDirection: "column", gap: 2, maxWidth: 520 },
  logRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 4px", borderBottom: "1px solid #f0e3ec" },
  logType: { fontWeight: 700, fontSize: 14.5 }, logWhen: { fontSize: 12, color: "#9a8da5" }, logAmt: { fontWeight: 800, fontSize: 15 },
  cartList: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 },
  lineTotal: { fontWeight: 900, minWidth: 80, textAlign: "right", fontSize: 16 },
  summary: { background: "#fff", border: "1px solid #f0e3ec", borderRadius: 20, padding: 24, maxWidth: 400, marginLeft: "auto" },
  sumLine: { display: "flex", justifyContent: "space-between", fontSize: 15, padding: "7px 0", color: "#5b5066", fontWeight: 600 },
  sumTotal: { borderTop: "1px solid #f0e3ec", marginTop: 8, paddingTop: 14, fontSize: 19, fontWeight: 900, color: "#3a2150" },
  walletNote: { display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "#7a7080", fontWeight: 700, margin: "12px 0 16px" },
  empty: { textAlign: "center", padding: "70px 20px", color: "#9a8da5", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
  modalTitle: { fontSize: 22, fontWeight: 900, margin: "0 0 18px" },
  checkoutRows: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 },
  checkoutRow: { display: "flex", justifyContent: "space-between", fontSize: 14.5, fontWeight: 600, color: "#5b5066" },
  payBox: { background: "#faf3f0", borderRadius: 14, padding: 16, marginBottom: 18 },
  payLine: { display: "flex", justifyContent: "space-between", fontSize: 14, padding: "5px 0", color: "#5b5066", fontWeight: 600 },
  payTotal: { fontWeight: 900, fontSize: 17, color: "#3a2150" },
  warn: { background: "#fdeceb", color: "#C1432E", padding: "12px 16px", borderRadius: 12, fontSize: 14, fontWeight: 700, textAlign: "center", marginBottom: 12 },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", borderTop: "1px solid #f0e3ec", fontSize: 13, fontWeight: 700, color: "#5b5066", flexWrap: "wrap", gap: 8 },
  aiHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid #f0e3ec" },
  aiBody: { flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 10 },
  bubble: { padding: "10px 14px", borderRadius: 14, fontSize: 14, lineHeight: 1.45, maxWidth: "85%" },
  bubbleUser: { background: "#C1432E", color: "#fff", alignSelf: "flex-end", borderBottomRightRadius: 4 },
  bubbleBot: { background: "#f3eef5", color: "#2a1a3e", alignSelf: "flex-start", borderBottomLeftRadius: 4 },
  aiInputRow: { display: "flex", gap: 8, padding: 14, borderTop: "1px solid #f0e3ec" },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
* { box-sizing: border-box; } body { margin: 0; }
.navbtn { display:inline-flex; align-items:center; gap:6px; border:none; background:transparent; font-family:inherit; font-weight:800; font-size:14px; color:#7a7080; padding:9px 14px; border-radius:11px; cursor:pointer; transition:.15s; }
.navbtn:hover { background:#f6eef2; color:#3a2150; } .navbtn-on { background:#FCE6DF; color:#C1432E; }
.walletchip { display:inline-flex; align-items:center; gap:6px; border:2px solid #f0e0d8; background:#fdf2ec; color:#C1432E; font-family:inherit; font-weight:900; font-size:13.5px; padding:8px 13px; border-radius:11px; cursor:pointer; transition:.15s; }
.walletchip:hover { border-color:#C1432E; }
.subtab { display:inline-flex; align-items:center; gap:6px; border:2px solid #f0e3ec; background:#fff; font-family:inherit; font-weight:800; font-size:13.5px; color:#7a7080; padding:9px 16px; border-radius:12px; cursor:pointer; transition:.15s; }
.subtab:hover { border-color:#C1432E; color:#C1432E; } .subtab-on { background:#FCE6DF; border-color:#C1432E; color:#C1432E; }
.cartbtn { position:relative; border:none; background:#3a2150; color:#fff; width:42px; height:42px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; transition:.15s; }
.cartbtn:hover { transform:translateY(-2px); }
.badge { position:absolute; top:-6px; right:-6px; background:#C1432E; color:#fff; font-size:11px; font-weight:900; min-width:19px; height:19px; border-radius:999px; display:flex; align-items:center; justify-content:center; padding:0 4px; }
.cta { display:inline-flex; align-items:center; gap:8px; background:#C1432E; color:#fff; border:none; font-family:inherit; font-weight:900; font-size:15px; padding:13px 22px; border-radius:14px; cursor:pointer; transition:.18s; box-shadow:0 6px 18px rgba(193,67,46,.3); }
.cta:hover { transform:translateY(-2px); box-shadow:0 10px 24px rgba(193,67,46,.4); } .cta:disabled { opacity:.6; cursor:default; transform:none; } .cta.full { width:100%; justify-content:center; }
.linkbtn { background:none; border:none; color:#C1432E; font-family:inherit; font-weight:800; font-size:13.5px; cursor:pointer; padding:0; }
.card { position:relative; background:#fff; border:1px solid #f0e3ec; border-radius:20px; overflow:hidden; transition:.2s; }
.card:hover { transform:translateY(-5px); box-shadow:0 16px 34px rgba(60,30,50,.1); border-color:#f0d2c8; }
.cardArt { position:relative; font-size:64px; text-align:center; padding:26px 0 18px; background:linear-gradient(135deg,#FFF3EC,#F7EEF8); display:flex; align-items:center; justify-content:center; min-height:120px; }
.cardImg { width:100%; height:140px; object-fit:cover; display:block; margin:-26px 0 -18px; }
.imgcount { position:absolute; bottom:8px; right:10px; background:rgba(42,26,62,.7); color:#fff; font-size:11px; font-weight:800; padding:3px 8px; border-radius:999px; }
.cartArt { font-size:40px; width:64px; height:64px; display:flex; align-items:center; justify-content:center; background:#f7eef8; border-radius:14px; overflow:hidden; }
.newbadge { position:absolute; top:12px; left:12px; z-index:2; background:#1faa6b; color:#fff; font-size:10.5px; font-weight:900; padding:4px 9px; border-radius:999px; letter-spacing:.05em; box-shadow:0 3px 8px rgba(31,170,107,.4); }
.newbadge-inline { background:#1faa6b; color:#fff; font-size:10px; font-weight:900; padding:2px 7px; border-radius:999px; margin-left:6px; }
.favbtn { position:absolute; top:12px; right:12px; z-index:2; border:none; background:rgba(255,255,255,.9); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#d6c9dd; transition:.15s; }
.favbtn:hover { transform:scale(1.12); } .favon { color:#C1432E; }
.addbtn { display:inline-flex; align-items:center; gap:4px; background:#3a2150; color:#fff; border:none; font-family:inherit; font-weight:800; font-size:13px; padding:8px 14px; border-radius:10px; cursor:pointer; transition:.15s; }
.addbtn:hover { background:#C1432E; }
.occchip { display:inline-flex; align-items:center; gap:10px; background:#fff; border:2px solid #f0e3ec; font-family:inherit; font-weight:800; font-size:15px; color:#3a2150; padding:10px 18px 10px 10px; border-radius:16px; cursor:pointer; transition:.15s; }
.occchip:hover { transform:translateY(-2px); }
.festchip { display:inline-flex; align-items:center; gap:7px; background:#fff; border:2px solid #f0e3ec; font-family:inherit; font-weight:800; font-size:13.5px; color:#5b5066; padding:8px 14px; border-radius:12px; cursor:pointer; transition:.15s; }
.festchip:hover { border-color:#C1432E; } .festchip-on { background:#FCE6DF; border-color:#C1432E; color:#C1432E; }
.promptchip { text-align:left; background:#faf6f9; border:1px solid #f0e3ec; font-family:inherit; font-weight:600; font-size:13.5px; color:#5b5066; padding:11px 14px; border-radius:12px; cursor:pointer; transition:.15s; line-height:1.4; }
.promptchip:hover { background:#FCE6DF; border-color:#C1432E; color:#C1432E; }
.topup { background:rgba(255,255,255,.22); color:#fff; border:1.5px solid rgba(255,255,255,.5); font-family:inherit; font-weight:800; font-size:14px; padding:11px 18px; border-radius:11px; cursor:pointer; transition:.15s; }
.topup:hover { background:#fff; color:#C1432E; } .topup:disabled { opacity:.5; cursor:default; }
.tagchip { background:#fff; border:2px solid #f0e3ec; font-family:inherit; font-weight:800; font-size:13px; color:#7a7080; padding:7px 14px; border-radius:999px; cursor:pointer; transition:.15s; text-transform:capitalize; }
.tagchip:hover { border-color:#C1432E; color:#C1432E; } .tagchip-on { background:#FCE6DF; border-color:#C1432E; color:#C1432E; }
.reminderCard { display:flex; align-items:center; gap:14px; background:#fff; border:1px solid #f0e3ec; border-radius:16px; padding:14px 16px; }
.ghostbtn { display:inline-flex; align-items:center; justify-content:center; gap:6px; background:#f6eef2; border:none; font-family:inherit; font-weight:800; font-size:13px; color:#3a2150; padding:8px 14px; border-radius:10px; cursor:pointer; transition:.15s; }
.ghostbtn:hover { background:#FCE6DF; color:#C1432E; }
.iconbtn { background:transparent; border:none; color:#c9bcd0; cursor:pointer; padding:7px; border-radius:9px; display:inline-flex; transition:.15s; }
.iconbtn:hover { background:#fdeceb; color:#C1432E; }
.cartRow { display:flex; align-items:center; gap:14px; background:#fff; border:1px solid #f0e3ec; border-radius:16px; padding:14px; }
.qtybtn { background:#fff; border:none; width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#3a2150; }
.qtybtn:hover { background:#FCE6DF; color:#C1432E; }
.carbtn { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.92); border:none; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#3a2150; box-shadow:0 4px 12px rgba(0,0,0,.15); }
.carbtn-l { left:12px; } .carbtn-r { right:12px; }
.overlay { position:fixed; inset:0; background:rgba(42,26,62,.45); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; z-index:100; padding:20px; }
.modal { position:relative; background:#fff; border-radius:24px; padding:30px; max-width:440px; width:100%; max-height:90vh; overflow:auto; box-shadow:0 30px 70px rgba(0,0,0,.25); }
.modalClose { position:absolute; top:16px; right:16px; z-index:3; }
.toast { position:fixed; bottom:26px; left:50%; transform:translateX(-50%); background:#3a2150; color:#fff; font-weight:800; font-size:14px; padding:13px 22px; border-radius:14px; z-index:200; box-shadow:0 12px 30px rgba(0,0,0,.25); animation:pop .25s ease; max-width:90vw; text-align:center; }
@keyframes pop { from { transform:translate(-50%,12px); opacity:0; } to { transform:translate(-50%,0); opacity:1; } }
.aifab { position:fixed; bottom:24px; right:24px; z-index:90; width:56px; height:56px; border-radius:50%; border:none; background:#C1432E; color:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 8px 24px rgba(193,67,46,.45); transition:.18s; }
.aifab:hover { transform:scale(1.08); }
.aiPanel { position:fixed; bottom:24px; right:24px; z-index:95; width:370px; max-width:calc(100vw - 32px); height:540px; max-height:calc(100vh - 48px); background:#fff; border-radius:22px; box-shadow:0 24px 60px rgba(0,0,0,.28); display:flex; flex-direction:column; overflow:hidden; }
.float { animation:floaty 3s ease-in-out infinite; } @keyframes floaty { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
.spin { animation:spin 1s linear infinite; } @keyframes spin { to { transform:rotate(360deg); } }
@media (max-width:640px) { .navbtn span, .navbtn { font-size:0; padding:9px; } .navbtn svg { width:20px; height:20px; } }
@media (max-width:680px) { div[style*="grid-template-columns: 2fr 1fr 1fr auto"] { grid-template-columns:1fr !important; } }
@media (prefers-reduced-motion: reduce) { .float, .toast, .spin { animation:none; } * { transition:none !important; } }
`;
