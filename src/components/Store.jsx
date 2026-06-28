import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart, Wallet, Calendar, Gift, Search, Plus, ArrowRight, Sparkles,
  Package, ClipboardList, Settings, MessageCircle, Wand2, LogOut, Loader2, User, Bell,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { S, CSS } from "../styles";
import { OCCASIONS, money, ADMIN_EMAIL, suggestForOccasion, daysUntilYearly } from "../shared";
import { useT } from "../i18n";
import ProductCard from "./ProductCard";
import ProductDetail from "./ProductDetail";
import CartPanel from "./CartPanel";
import WalletPanel from "./WalletPanel";
import ProfilePanel from "./ProfilePanel";
import MyOrders from "./MyOrders";
import RemindersPanel from "./RemindersPanel";
import DesignStudio from "./DesignStudio";
import CheckoutModal from "./CheckoutModal";
import RechargeModal from "./RechargeModal";
import AIAssistant from "./AIAssistant";
import AdminPanel from "./admin/AdminPanel";

export default function Store({ session }) {
  const { t, lang, setLang } = useT();
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
    const { data, error } = await supabase.from("orders").insert({ user_id: userId, total: subtotal, items, status: "pending", ship_name: profile.full_name, ship_phone: profile.phone, ship_address: profile.address }).select().single();
    if (error) { flash(error.message); return null; }
    return data;
  }
  async function payWithWallet() {
    if (subtotal <= 0) return;
    const items = cartDetailed.map((i) => ({ name: i.name, qty: i.qty, price: i.price }));
    const { error } = await supabase.rpc("purchase_with_wallet", { p_items: items, p_total: subtotal, p_ship_name: profile.full_name, p_ship_phone: profile.phone, p_ship_address: profile.address });
    if (error) { flash(error.message); return; }
    await supabase.from("cart_items").delete().eq("user_id", userId);
    setCart([]); setCheckoutOpen(false); flash("Paid from wallet 🎉"); loadAll(); setTab("orders");
  }

  async function saveProfile(p) {
    const { error } = await supabase.from("profiles").update({ full_name: p.full_name, phone: p.phone, address: p.address }).eq("id", userId);
    if (error) { flash("Address save failed: " + error.message); return false; }
    setProfile(p); flash("Delivery details saved"); return true;
  }

  if (loading) return <div style={S.center}><Loader2 className="spin" size={32} color="#C1432E" /></div>;

  const navItems = [
    { id: "shop", label: t("nav_shop"), icon: Package }, { id: "occasions", label: t("nav_occasions"), icon: Gift },
    { id: "design", label: t("nav_design"), icon: Wand2 }, { id: "orders", label: t("nav_orders"), icon: ClipboardList },
    { id: "calendar", label: t("nav_reminders"), icon: Calendar },
    { id: "wallet", label: t("nav_wallet"), icon: Wallet },
    { id: "profile", label: t("nav_profile"), icon: User },
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
          <select className="langsel" value={lang} onChange={(e) => setLang(e.target.value)} title="Language">
            <option value="en">EN</option>
            <option value="te">తె</option>
            <option value="hi">हि</option>
          </select>
          <button className="iconbtn" title={t("sign_out")} onClick={() => supabase.auth.signOut()}><LogOut size={18} /></button>
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
        {tab === "wallet" && <WalletPanel wallet={wallet} log={walletLog} onRecharge={() => setRechargeOpen(true)} hasUpi={!!settings?.upi_id?.trim()} orders={myOrders} />}
        {tab === "profile" && <ProfilePanel profile={profile} onSaveProfile={saveProfile} />}
        {tab === "cart" && <CartPanel items={cartDetailed} subtotal={subtotal} wallet={wallet} onSetQty={setItemQty} onCheckout={() => setCheckoutOpen(true)} onWalletPay={payWithWallet} onShop={() => setTab("shop")} hasAddress={!!profile.address?.trim()} onNeedAddress={() => setTab("wallet")} />}
        {tab === "admin" && isAdmin && <AdminPanel flash={flash} onChanged={loadAll} products={products} settings={settings} />}
      </main>

      {detailProduct && (
        <ProductDetail p={detailProduct} qty={qtyOf(detailProduct.id)} userId={userId} flash={flash} onClose={() => setDetailProduct(null)}
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
}
