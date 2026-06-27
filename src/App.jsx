import React, { useState, useEffect, useMemo } from "react";
import {
  ShoppingCart, Wallet, Calendar, Gift, Search, Plus, Minus, X,
  Bell, Star, Trash2, Heart, Check, ArrowRight, Sparkles, Package,
  CreditCard, PartyPopper, CakeSlice, Baby, GraduationCap, LogOut, Loader2,
  QrCode, ClipboardList, Settings,
} from "lucide-react";
import QRCode from "qrcode";
import { supabase } from "./supabaseClient";

/* ============================================================
   TOYBOX — toy & gift store, Supabase-backed
   Email+password auth · catalog + admin · UPI QR per toy
   Orders are PENDING until the admin manually confirms payment
   (no gateway — you verify each payment in your own UPI app).
   ============================================================ */

const OCCASIONS = [
  { id: "birthday", label: "Birthday", icon: CakeSlice, hue: "#FF6B9D", tags: ["fun", "celebration"] },
  { id: "newborn", label: "Newborn", icon: Baby, hue: "#7FD8BE", tags: ["baby", "soft"] },
  { id: "graduation", label: "Graduation", icon: GraduationCap, hue: "#6C8EFF", tags: ["milestone", "learning"] },
  { id: "holiday", label: "Holiday", icon: PartyPopper, hue: "#FFB454", tags: ["festive", "celebration"] },
];

const money = (n) => `$${Number(n).toFixed(2)}`;

// ⚠️ CHANGE THIS to the email you sign in with — must match your Supabase policies.
const ADMIN_EMAIL = "ch.sambasiva998@gmail.com";

// Build a UPI deep-link string. amount uses '.' decimal, INR assumed by UPI apps.
function buildUpiString({ upiId, payeeName, amount, note }) {
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName || "TOYBOX",
    am: Number(amount).toFixed(2),
    cu: "INR",
    tn: note || "TOYBOX order",
  });
  return `upi://pay?${params.toString()}`;
}

function suggestForOccasion(occId, products) {
  const occ = OCCASIONS.find((o) => o.id === occId);
  if (!occ) return products.slice(0, 6);
  return [...products]
    .map((p) => ({ p, score: (p.tags || []).filter((t) => occ.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating)
    .slice(0, 6)
    .map((x) => x.p);
}

/* ============================================================
   QR component — renders a UPI string to a canvas in-browser
   ============================================================ */
function UpiQR({ value, size = 200 }) {
  const [dataUrl, setDataUrl] = useState(null);
  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(value, { width: size, margin: 1, color: { dark: "#26283d", light: "#ffffff" } })
      .then((url) => { if (alive) setDataUrl(url); })
      .catch(() => { if (alive) setDataUrl(null); });
    return () => { alive = false; };
  }, [value, size]);
  if (!dataUrl) return <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}><Loader2 className="spin" size={24} color="#FF6B9D" /></div>;
  return <img src={dataUrl} alt="UPI QR code" width={size} height={size} style={{ borderRadius: 12 }} />;
}

/* ============================================================
   ROOT
   ============================================================ */
export default function App() {
  const [session, setSession] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setAuthReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (!authReady)
    return <div style={S.center}><Loader2 className="spin" size={32} color="#FF6B9D" /></div>;
  return session ? <Store session={session} /> : <AuthScreen />;
}

/* ============================================================
   AUTH
   ============================================================ */
function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true); setMsg(null);
    const fn = mode === "signin"
      ? supabase.auth.signInWithPassword({ email, password: pass })
      : supabase.auth.signUp({ email, password: pass });
    const { error } = await fn;
    if (error) setMsg(error.message);
    else if (mode === "signup") setMsg("Check your email to confirm, then sign in.");
    setBusy(false);
  }

  return (
    <div style={S.app}>
      <style>{CSS}</style>
      <div style={S.authWrap}>
        <div style={S.authCard}>
          <div style={{ fontSize: 44, textAlign: "center" }}>🧸</div>
          <div style={S.authBrand}>TOYBOX</div>
          <div style={S.authTag}>{mode === "signin" ? "Welcome back." : "Create your account."}</div>
          <input style={S.input} type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={S.input} type="password" placeholder="Password (6+ chars)" value={pass} onChange={(e) => setPass(e.target.value)} />
          <button className="cta full" disabled={busy} onClick={submit}>
            {busy ? <Loader2 className="spin" size={16} /> : mode === "signin" ? "Sign in" : "Sign up"}
          </button>
          {msg && <div style={S.authMsg}>{msg}</div>}
          <div style={S.authSwitch}>
            {mode === "signin" ? "New here?" : "Have an account?"}{" "}
            <button className="linkbtn" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setMsg(null); }}>
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STORE
   ============================================================ */
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

  function flash(m) { setToast(m); setTimeout(() => setToast(null), 2600); }

  useEffect(() => { loadAll(); }, []);
  async function loadAll() {
    setLoading(true);
    const [prod, prof, log, c, rem, setg] = await Promise.all([
      supabase.from("products").select("*").order("id"),
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

  const cartDetailed = cart
    .map((c) => { const p = products.find((x) => x.id === c.product_id); return p ? { ...p, qty: c.qty } : null; })
    .filter(Boolean);
  const subtotal = cartDetailed.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const suggestions = useMemo(() => suggestForOccasion(activeOcc, products), [activeOcc, products]);
  const results = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q));
  }, [query, products]);

  async function addToCart(pid) {
    const ex = cart.find((i) => i.product_id === pid);
    const qty = ex ? ex.qty + 1 : 1;
    setCart((c) => ex ? c.map((i) => i.product_id === pid ? { ...i, qty } : i) : [...c, { product_id: pid, qty }]);
    flash("Added to cart");
    await supabase.from("cart_items").upsert({ user_id: userId, product_id: pid, qty }, { onConflict: "user_id,product_id" });
  }
  async function setQty(pid, d) {
    const item = cart.find((i) => i.product_id === pid);
    if (!item) return;
    const qty = item.qty + d;
    if (qty <= 0) return removeFromCart(pid);
    setCart((c) => c.map((i) => i.product_id === pid ? { ...i, qty } : i));
    await supabase.from("cart_items").update({ qty }).eq("user_id", userId).eq("product_id", pid);
  }
  async function removeFromCart(pid) {
    setCart((c) => c.filter((i) => i.product_id !== pid));
    await supabase.from("cart_items").delete().eq("user_id", userId).eq("product_id", pid);
  }
  function toggleFav(id) {
    setFavorites((f) => { const n = new Set(f); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  async function topUp(amt) {
    const next = wallet + amt;
    setWallet(next); flash(`${money(amt)} added`);
    await supabase.from("profiles").update({ wallet: next }).eq("id", userId);
    await supabase.from("wallet_log").insert({ user_id: userId, type: "Top-up", amount: amt });
    refreshLog();
  }
  async function refreshLog() {
    const { data } = await supabase.from("wallet_log").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    setWalletLog(data || []);
  }

  // Creates a PENDING order. Payment is via UPI QR, confirmed later by admin.
  async function createPendingOrder() {
    const items = cartDetailed.map((i) => ({ name: i.name, qty: i.qty, price: i.price }));
    const { data, error } = await supabase.from("orders")
      .insert({ user_id: userId, total: subtotal, items, status: "pending" })
      .select().single();
    if (error) { flash(error.message); return null; }
    return data;
  }

  if (loading)
    return <div style={S.center}><Loader2 className="spin" size={32} color="#FF6B9D" /></div>;

  return (
    <div style={S.app}>
      <style>{CSS}</style>
      <header style={S.header}>
        <div style={S.brand}>
          <span style={S.logoMark}>🧸</span>
          <div>
            <div style={S.brandName}>TOYBOX</div>
            <div style={S.brandTag}>toys & gifts, delivered with delight</div>
          </div>
        </div>
        <nav style={S.nav}>
          {[
            { id: "shop", label: "Shop", icon: Package },
            { id: "occasions", label: "Occasions", icon: Gift },
            { id: "calendar", label: "Reminders", icon: Calendar },
            { id: "wallet", label: "Wallet", icon: Wallet },
          ].map((t) => (
            <button key={t.id} className={`navbtn ${tab === t.id ? "navbtn-on" : ""}`} onClick={() => setTab(t.id)}>
              <t.icon size={17} /> {t.label}
            </button>
          ))}
          {isAdmin && (
            <button className={`navbtn ${tab === "admin" ? "navbtn-on" : ""}`} onClick={() => setTab("admin")}>
              <Settings size={17} /> Admin
            </button>
          )}
          <button className="cartbtn" onClick={() => setTab("cart")}>
            <ShoppingCart size={18} />
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
          <button className="iconbtn" title="Sign out" onClick={() => supabase.auth.signOut()}>
            <LogOut size={18} />
          </button>
        </nav>
      </header>

      <main style={S.main}>
        {tab === "shop" && (
          <>
            <section style={S.hero}>
              <div style={S.heroInner}>
                <div style={S.heroEyebrow}><Sparkles size={14} /> Hand-picked play</div>
                <h1 style={S.heroTitle}>Find the gift that gets the gasp.</h1>
                <p style={S.heroSub}>Wonder-packed toys, keepsakes, and surprises — sorted by who you're shopping for and what you're celebrating.</p>
                <button className="cta" onClick={() => setTab("occasions")}>Shop by occasion <ArrowRight size={16} /></button>
              </div>
              <div style={S.heroArt}>
                {["🚀", "🎨", "🤖", "🧸", "⭐", "🎁"].map((e, i) => (
                  <span key={i} className="float" style={{ animationDelay: `${i * 0.4}s` }}>{e}</span>
                ))}
              </div>
            </section>
            <div style={S.searchRow}>
              <div style={S.searchWrap}>
                <Search size={18} color="#9aa0b5" />
                <input style={S.search} placeholder="Search toys, categories…" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <span style={S.resultCount}>{results.length} items</span>
            </div>
            {results.length === 0 ? (
              <div style={S.empty}><Package size={32} color="#c7ccdb" /><p>No toys in the shop yet.{isAdmin ? " Add some from the Admin tab." : ""}</p></div>
            ) : (
              <div style={S.grid}>
                {results.map((p) => (
                  <ProductCard key={p.id} p={p} fav={favorites.has(p.id)} onFav={() => toggleFav(p.id)} onAdd={() => addToCart(p.id)}
                    settings={settings} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "occasions" && (
          <>
            <h2 style={S.sectionTitle}>What are we celebrating?</h2>
            <p style={S.sectionSub}>Pick a moment and we'll match the perfect gifts.</p>
            <div style={S.occRow}>
              {OCCASIONS.map((o) => (
                <button key={o.id} className={`occchip ${activeOcc === o.id ? "occchip-on" : ""}`}
                  style={activeOcc === o.id ? { borderColor: o.hue, background: o.hue + "1a" } : {}}
                  onClick={() => setActiveOcc(o.id)}>
                  <span style={{ ...S.occIcon, background: o.hue + "22", color: o.hue }}><o.icon size={20} /></span>
                  {o.label}
                </button>
              ))}
            </div>
            <div style={S.suggestHead}><Sparkles size={16} color="#FF6B9D" />
              <span>Curated picks for {OCCASIONS.find((o) => o.id === activeOcc)?.label}</span></div>
            {suggestions.length === 0 ? (
              <div style={S.empty}><Gift size={32} color="#c7ccdb" /><p>Add toys to see occasion picks.</p></div>
            ) : (
              <div style={S.grid}>
                {suggestions.map((p) => (
                  <ProductCard key={p.id} p={p} fav={favorites.has(p.id)} onFav={() => toggleFav(p.id)} onAdd={() => addToCart(p.id)} settings={settings} />
                ))}
              </div>
            )}
          </>
        )}

        {tab === "calendar" && (
          <RemindersPanel userId={userId} reminders={reminders} setReminders={setReminders}
            flash={flash} onShop={(occ) => { setActiveOcc(occ); setTab("occasions"); }} />
        )}

        {tab === "wallet" && <WalletPanel wallet={wallet} log={walletLog} onTopUp={topUp} />}

        {tab === "cart" && (
          <CartPanel items={cartDetailed} subtotal={subtotal}
            onQty={setQty} onRemove={removeFromCart}
            onCheckout={() => setCheckoutOpen(true)} onShop={() => setTab("shop")} />
        )}

        {tab === "admin" && isAdmin && (
          <AdminPanel flash={flash} onChanged={loadAll} products={products} settings={settings} />
        )}
      </main>

      {checkoutOpen && (
        <CheckoutModal
          items={cartDetailed} subtotal={subtotal} settings={settings}
          onClose={() => setCheckoutOpen(false)}
          onConfirm={createPendingOrder}
          onDone={async () => {
            await supabase.from("cart_items").delete().eq("user_id", userId);
            setCart([]); setCheckoutOpen(false); flash("Order placed — pending payment confirmation"); setTab("shop");
          }}
          flash={flash}
        />
      )}

      {toast && <div className="toast">{toast}</div>}

      <footer style={S.footer}>
        <span>🧸 TOYBOX</span>
        <span style={{ color: "#9aa0b5" }}>Signed in as {session.user.email}</span>
      </footer>
    </div>
  );
}

/* ============================================================
   CHECKOUT — shows a UPI QR for the order total
   ============================================================ */
function CheckoutModal({ items, subtotal, settings, onClose, onConfirm, onDone, flash }) {
  const [order, setOrder] = useState(null);
  const [creating, setCreating] = useState(false);
  const hasUpi = settings?.upi_id?.trim();

  async function start() {
    setCreating(true);
    const o = await onConfirm();
    setCreating(false);
    if (o) setOrder(o);
  }

  const upiString = hasUpi ? buildUpiString({
    upiId: settings.upi_id, payeeName: settings.payee_name,
    amount: subtotal, note: order ? `TOYBOX #${order.id}` : "TOYBOX order",
  }) : "";

  return (
    <Modal onClose={onClose}>
      <h3 style={S.modalTitle}>Checkout</h3>
      <div style={S.checkoutRows}>
        {items.map((i) => (
          <div key={i.id} style={S.checkoutRow}>
            <span>{i.emoji} {i.name} ×{i.qty}</span><span>{money(i.price * i.qty)}</span>
          </div>
        ))}
      </div>
      <div style={S.payBox}>
        <div style={{ ...S.payLine, ...S.payTotal }}><span>Total</span><span>{money(subtotal)}</span></div>
      </div>

      {!hasUpi ? (
        <div style={S.warn}>The shop hasn't set up a UPI ID yet, so payment isn't available. (Admin: add it in the Admin tab.)</div>
      ) : !order ? (
        <button className="cta full" disabled={creating} onClick={start}>
          {creating ? <Loader2 className="spin" size={16} /> : <QrCode size={16} />} Generate payment QR
        </button>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={S.qrWrap}><UpiQR value={upiString} size={210} /></div>
          <div style={S.qrHint}>Scan with any UPI app to pay {money(subtotal)} to <b>{settings.upi_id}</b></div>
          <a className="cta full" href={upiString} style={{ textDecoration: "none", marginBottom: 10 }}>
            Open in UPI app
          </a>
          <p style={S.qrNote}>
            After paying, tap below. Your order stays <b>pending</b> until the shop confirms the payment was received.
          </p>
          <button className="ghostbtn" style={{ width: "100%", padding: 12 }} onClick={onDone}>
            I've paid — place order
          </button>
        </div>
      )}
    </Modal>
  );
}

/* ============================================================
   PRODUCT CARD — includes a per-toy "view QR" option
   ============================================================ */
function ProductCard({ p, fav, onFav, onAdd, settings }) {
  const [showQR, setShowQR] = useState(false);
  const hasUpi = settings?.upi_id?.trim();
  const upiString = hasUpi ? buildUpiString({
    upiId: settings.upi_id, payeeName: settings.payee_name, amount: p.price, note: `TOYBOX ${p.name}`,
  }) : "";

  return (
    <div className="card">
      <button className={`favbtn ${fav ? "favon" : ""}`} onClick={onFav} aria-label="favorite">
        <Heart size={16} fill={fav ? "#FF6B9D" : "none"} />
      </button>
      <div className="cardArt">
        {p.image_url ? <img src={p.image_url} alt={p.name} className="cardImg" /> : p.emoji}
      </div>
      <div style={S.cardBody}>
        <div style={S.cardTop}>
          <span style={S.cat}>{p.category}</span>
          <span style={S.rating}><Star size={12} fill="#FFB454" color="#FFB454" /> {p.rating}</span>
        </div>
        <div style={S.cardName}>{p.name}</div>
        {p.description && <div style={S.cardDesc}>{p.description}</div>}
        <div style={S.cardMeta}>Ages {p.age_range}</div>
        <div style={S.cardFoot}>
          <span style={S.price}>{money(p.price)}</span>
          <div style={{ display: "flex", gap: 6 }}>
            {hasUpi && (
              <button className="iconbtn" title="Pay this toy via UPI QR" style={{ color: "#8a7fd6" }} onClick={() => setShowQR(true)}>
                <QrCode size={16} />
              </button>
            )}
            <button className="addbtn" onClick={onAdd}><Plus size={15} /> Add</button>
          </div>
        </div>
      </div>

      {showQR && (
        <Modal onClose={() => setShowQR(false)}>
          <h3 style={S.modalTitle}>Pay for {p.name}</h3>
          <div style={{ textAlign: "center" }}>
            <div style={S.qrWrap}><UpiQR value={upiString} size={210} /></div>
            <div style={S.qrHint}>Scan to pay {money(p.price)} to <b>{settings.upi_id}</b></div>
            <a className="cta full" href={upiString} style={{ textDecoration: "none" }}>Open in UPI app</a>
            <p style={S.qrNote}>Direct UPI payment. The shop confirms receipt manually — keep your payment reference.</p>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================================================
   ADMIN — products, UPI settings, and order confirmation
   ============================================================ */
function AdminPanel({ flash, onChanged, products, settings }) {
  const [sub, setSub] = useState("products"); // products | settings | orders
  return (
    <>
      <div style={S.adminTabs}>
        <button className={`subtab ${sub === "products" ? "subtab-on" : ""}`} onClick={() => setSub("products")}><Package size={15} /> Products</button>
        <button className={`subtab ${sub === "orders" ? "subtab-on" : ""}`} onClick={() => setSub("orders")}><ClipboardList size={15} /> Orders</button>
        <button className={`subtab ${sub === "settings" ? "subtab-on" : ""}`} onClick={() => setSub("settings")}><Settings size={15} /> Payment</button>
      </div>
      {sub === "products" && <AdminProducts flash={flash} onChanged={onChanged} products={products} />}
      {sub === "orders" && <AdminOrders flash={flash} />}
      {sub === "settings" && <AdminSettings flash={flash} onChanged={onChanged} settings={settings} />}
    </>
  );
}

function AdminSettings({ flash, onChanged, settings }) {
  const [upiId, setUpiId] = useState(settings?.upi_id || "");
  const [payeeName, setPayeeName] = useState(settings?.payee_name || "");
  const [busy, setBusy] = useState(false);

  async function save() {
    if (!upiId.trim()) { flash("7981166388-2@ybl"); return; }
    setBusy(true);
    const { error } = await supabase.from("store_settings")
      .upsert({ id: 1, upi_id: upiId.trim(), payee_name: payeeName.trim(), updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) { flash(error.message); return; }
    flash("Payment settings saved"); onChanged();
  }

  return (
    <>
      <h2 style={S.sectionTitle}>Payment settings</h2>
      <p style={S.sectionSub}>Your UPI ID is used to generate QR codes for every toy and at checkout.</p>
      <div style={{ maxWidth: 460, display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div style={S.adminLabel}>Your UPI ID (VPA)</div>
          <input style={{ ...S.input, width: "100%" }} placeholder="yourname@okbank" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
        </div>
        <div>
          <div style={S.adminLabel}>Payee name (shown in the UPI app)</div>
          <input style={{ ...S.input, width: "100%" }} placeholder="Your shop / your name" value={payeeName} onChange={(e) => setPayeeName(e.target.value)} />
        </div>
        <button className="cta" disabled={busy} onClick={save}>
          {busy ? <Loader2 className="spin" size={16} /> : <Check size={16} />} Save
        </button>
      </div>
      <div style={S.securityNote}>
        <b>How payments work here:</b> customers pay you directly via UPI. The app cannot verify payments automatically — it shows orders as <b>pending</b> until you confirm in the Orders tab after seeing the money in your own UPI app. Never mark an order paid before you've actually received it.
      </div>
    </>
  );
}

function AdminOrders({ flash }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending");

  useEffect(() => { load(); }, []);
  async function load() {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }
  async function mark(id, status) {
    await supabase.from("orders").update({ status }).eq("id", id);
    flash(status === "paid" ? "Marked as paid ✓" : "Marked as " + status);
    load();
  }

  const shown = orders.filter((o) => filter === "all" ? true : o.status === filter);

  if (loading) return <div style={S.center}><Loader2 className="spin" size={28} color="#FF6B9D" /></div>;

  return (
    <>
      <h2 style={S.sectionTitle}>Orders</h2>
      <p style={S.sectionSub}>Confirm a payment only after you see it in your UPI app, then mark it paid.</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {["pending", "paid", "all"].map((f) => (
          <button key={f} className={`subtab ${filter === f ? "subtab-on" : ""}`} onClick={() => setFilter(f)} style={{ textTransform: "capitalize" }}>{f}</button>
        ))}
      </div>
      {shown.length === 0 ? (
        <div style={S.empty}><ClipboardList size={30} color="#c7ccdb" /><p>No {filter === "all" ? "" : filter} orders.</p></div>
      ) : (
        <div style={S.adminList}>
          {shown.map((o) => (
            <div key={o.id} style={S.orderRow}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800 }}>Order #{o.id} · {money(o.total)}
                  <span style={{ ...S.statusPill, ...(o.status === "paid" ? S.pillPaid : o.status === "cancelled" ? S.pillCancel : S.pillPending) }}>{o.status}</span>
                </div>
                <div style={{ fontSize: 13, color: "#9aa0b5", margin: "3px 0" }}>{prettyDateTime(o.created_at)}</div>
                <div style={{ fontSize: 13, color: "#5b6072" }}>
                  {(o.items || []).map((it, n) => <span key={n}>{it.name} ×{it.qty}{n < o.items.length - 1 ? ", " : ""}</span>)}
                </div>
              </div>
              {o.status === "pending" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <button className="cta" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => mark(o.id, "paid")}><Check size={14} /> Mark paid</button>
                  <button className="ghostbtn" onClick={() => mark(o.id, "cancelled")}>Cancel</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function AdminProducts({ flash, onChanged, products }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [emoji, setEmoji] = useState("🎁");
  const [rating, setRating] = useState("4.5");
  const [ageRange, setAgeRange] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const ALL_TAGS = ["fun", "celebration", "baby", "soft", "milestone", "learning", "festive"];

  function toggleTag(t) { setTags((c) => c.includes(t) ? c.filter((x) => x !== t) : [...c, t]); }

  async function save() {
    if (!name.trim() || !price) { flash("Name and price are required"); return; }
    setBusy(true);
    let image_url = null;
    try {
      if (file) {
        const ext = file.name.split(".").pop();
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("product-images").getPublicUrl(path);
        image_url = data.publicUrl;
      }
      const { error } = await supabase.from("products").insert({
        name: name.trim(), description: description.trim() || null, price: Number(price),
        category: category.trim() || "Toys", emoji, rating: Number(rating) || 4.5,
        age_range: ageRange.trim() || "All", tags, image_url,
      });
      if (error) throw error;
      flash("Toy added! 🎉");
      setName(""); setDescription(""); setPrice(""); setCategory(""); setEmoji("🎁"); setRating("4.5"); setAgeRange(""); setTags([]); setFile(null);
      onChanged();
    } catch (e) { flash(e.message || "Something went wrong"); }
    finally { setBusy(false); }
  }
  async function deleteProduct(id) { await supabase.from("products").delete().eq("id", id); flash("Removed"); onChanged(); }

  return (
    <>
      <h2 style={S.sectionTitle}>Add a toy</h2>
      <p style={S.sectionSub}>New products appear in the shop right away.</p>
      <div style={S.adminForm}>
        <input style={S.input} placeholder="Toy name" value={name} onChange={(e) => setName(e.target.value)} />
        <input style={S.input} type="number" step="0.01" placeholder="Price e.g. 29.99" value={price} onChange={(e) => setPrice(e.target.value)} />
        <input style={S.input} placeholder="Category e.g. STEM" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input style={S.input} placeholder="Age range e.g. 3-7" value={ageRange} onChange={(e) => setAgeRange(e.target.value)} />
        <input style={S.input} placeholder="Fallback emoji" value={emoji} onChange={(e) => setEmoji(e.target.value)} />
        <input style={S.input} type="number" step="0.1" min="0" max="5" placeholder="Rating 0-5" value={rating} onChange={(e) => setRating(e.target.value)} />
      </div>
      <div style={{ margin: "0 0 12px" }}>
        <textarea style={{ ...S.input, width: "100%", minHeight: 90, resize: "vertical" }}
          placeholder="Description — what makes this toy special?" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div style={{ margin: "4px 0 16px" }}>
        <div style={S.adminLabel}>Occasion tags</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {ALL_TAGS.map((t) => (
            <button key={t} onClick={() => toggleTag(t)} className={`tagchip ${tags.includes(t) ? "tagchip-on" : ""}`}>{t}</button>
          ))}
        </div>
      </div>
      <div style={{ margin: "4px 0 18px" }}>
        <div style={S.adminLabel}>Photo (optional)</div>
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </div>
      <button className="cta" disabled={busy} onClick={save}>
        {busy ? <Loader2 className="spin" size={16} /> : <Plus size={16} />} Add toy
      </button>

      <h3 style={S.subhead}>Current toys ({products.length})</h3>
      <div style={S.adminList}>
        {products.length === 0 && (
          <div style={S.empty}><Package size={28} color="#c7ccdb" /><p>No toys yet. Add your first above.</p></div>
        )}
        {products.map((p) => (
          <div key={p.id} style={S.adminRow}>
            <div className="cartArt" style={{ fontSize: 26, width: 46, height: 46 }}>
              {p.image_url ? <img src={p.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 12 }} /> : p.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>{p.name}</div>
              <div style={{ fontSize: 13, color: "#9aa0b5" }}>{money(p.price)} · {p.category}</div>
            </div>
            <button className="iconbtn" onClick={() => deleteProduct(p.id)}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </>
  );
}

function RemindersPanel({ userId, reminders, setReminders, flash, onShop }) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [occ, setOcc] = useState("birthday");

  async function add() {
    if (!title.trim() || !date) { flash("Add a name and a date"); return; }
    const { data, error } = await supabase.from("reminders")
      .insert({ user_id: userId, title: title.trim(), remind_date: date, occasion: occ }).select().single();
    if (error) { flash(error.message); return; }
    setReminders((r) => [...r, data].sort((a, b) => a.remind_date.localeCompare(b.remind_date)));
    setTitle(""); setDate(""); flash("Reminder saved 🔔");
  }
  async function remove(id) { setReminders((r) => r.filter((x) => x.id !== id)); await supabase.from("reminders").delete().eq("id", id); }

  return (
    <>
      <h2 style={S.sectionTitle}>Gift reminders</h2>
      <p style={S.sectionSub}>Never miss a moment — we'll line up gift ideas when it's time.</p>
      <div style={S.reminderForm}>
        <input style={S.input} placeholder="Whose moment? e.g. Dad's birthday" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input style={S.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select style={S.input} value={occ} onChange={(e) => setOcc(e.target.value)}>
          {OCCASIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
        </select>
        <button className="cta" onClick={add}><Plus size={16} /> Add reminder</button>
      </div>
      <div style={S.reminderList}>
        {reminders.length === 0 && (
          <div style={S.empty}><Bell size={28} color="#c7ccdb" /><p>No reminders yet. Add your first above.</p></div>
        )}
        {reminders.map((r) => {
          const o = OCCASIONS.find((x) => x.id === r.occasion) || OCCASIONS[0];
          const days = daysUntil(r.remind_date);
          return (
            <div key={r.id} className="reminderCard">
              <span style={{ ...S.occIcon, background: o.hue + "22", color: o.hue }}><o.icon size={20} /></span>
              <div style={{ flex: 1 }}>
                <div style={S.reminderTitle}>{r.title}</div>
                <div style={S.reminderMeta}>{prettyDate(r.remind_date)} · {days < 0 ? "passed" : days === 0 ? "today!" : `in ${days} day${days > 1 ? "s" : ""}`}</div>
              </div>
              <button className="ghostbtn" onClick={() => onShop(r.occasion)}>Find gifts</button>
              <button className="iconbtn" onClick={() => remove(r.id)} aria-label="delete"><Trash2 size={16} /></button>
            </div>
          );
        })}
      </div>
    </>
  );
}

function WalletPanel({ wallet, log, onTopUp }) {
  return (
    <>
      <h2 style={S.sectionTitle}>Your wallet</h2>
      <p style={S.sectionSub}>Store credit you can use at checkout. (Top-ups here are store credit, separate from UPI payments.)</p>
      <div style={S.walletCard}>
        <div style={S.walletGlow} />
        <div style={S.walletLabel}><CreditCard size={16} /> Balance</div>
        <div style={S.walletBalance}>{money(wallet)}</div>
        <div style={S.topUpRow}>
          {[25, 50, 100].map((a) => <button key={a} className="topup" onClick={() => onTopUp(a)}>+ {money(a)}</button>)}
        </div>
      </div>
      <h3 style={S.subhead}>Activity</h3>
      <div style={S.logList}>
        {log.map((e) => (
          <div key={e.id} style={S.logRow}>
            <div><div style={S.logType}>{e.type}</div><div style={S.logWhen}>{prettyDateTime(e.created_at)}</div></div>
            <div style={{ ...S.logAmt, color: e.amount < 0 ? "#e5484d" : "#1faa6b" }}>{e.amount < 0 ? "-" : "+"}{money(Math.abs(e.amount))}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function CartPanel({ items, subtotal, onQty, onRemove, onCheckout, onShop }) {
  if (items.length === 0)
    return (
      <div style={S.empty}>
        <ShoppingCart size={32} color="#c7ccdb" /><p>Your cart is empty.</p>
        <button className="cta" onClick={onShop}>Start shopping</button>
      </div>
    );
  return (
    <>
      <h2 style={S.sectionTitle}>Your cart</h2>
      <div style={S.cartList}>
        {items.map((i) => (
          <div key={i.id} className="cartRow">
            <div className="cartArt">
              {i.image_url ? <img src={i.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 14 }} /> : i.emoji}
            </div>
            <div style={{ flex: 1 }}>
              <div style={S.cardName}>{i.name}</div>
              <div style={S.cardMeta}>{money(i.price)} each</div>
            </div>
            <div style={S.qtyBox}>
              <button className="qtybtn" onClick={() => onQty(i.id, -1)}><Minus size={14} /></button>
              <span style={S.qty}>{i.qty}</span>
              <button className="qtybtn" onClick={() => onQty(i.id, 1)}><Plus size={14} /></button>
            </div>
            <div style={S.lineTotal}>{money(i.price * i.qty)}</div>
            <button className="iconbtn" onClick={() => onRemove(i.id)}><X size={16} /></button>
          </div>
        ))}
      </div>
      <div style={S.summary}>
        <div style={S.sumLine}><span>Subtotal</span><span>{money(subtotal)}</span></div>
        <div style={S.sumLine}><span>Shipping</span><span style={{ color: "#1faa6b" }}>Free</span></div>
        <div style={{ ...S.sumLine, ...S.sumTotal }}><span>Total</span><span>{money(subtotal)}</span></div>
        <button className="cta full" onClick={onCheckout}>Checkout with UPI <ArrowRight size={16} /></button>
      </div>
    </>
  );
}

function Modal({ children, onClose }) {
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="iconbtn modalClose" onClick={onClose}><X size={18} /></button>
        {children}
      </div>
    </div>
  );
}

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  return Math.round((d - today) / 86400000);
}
function prettyDate(s) { return new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
function prettyDateTime(s) { return new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }

const S = {
  app: { fontFamily: "'Nunito', system-ui, sans-serif", background: "#FBF7F2", minHeight: "100vh", color: "#1f2233" },
  center: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF7F2" },
  authWrap: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "linear-gradient(120deg,#FFE8F0,#EAF0FF)" },
  authCard: { background: "#fff", borderRadius: 24, padding: "36px 32px", width: "100%", maxWidth: 360, boxShadow: "0 20px 50px rgba(40,40,70,.12)", display: "flex", flexDirection: "column", gap: 12 },
  authBrand: { fontWeight: 900, fontSize: 26, textAlign: "center", letterSpacing: "0.04em" },
  authTag: { fontSize: 14, color: "#7a7f93", textAlign: "center", marginBottom: 8, fontWeight: 600 },
  authMsg: { fontSize: 13, color: "#5b6072", textAlign: "center", background: "#f9f6f1", padding: "10px 12px", borderRadius: 10, fontWeight: 600 },
  authSwitch: { fontSize: 13.5, color: "#7a7f93", textAlign: "center", fontWeight: 600 },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 28px", background: "#fff", borderBottom: "1px solid #efe9e1", position: "sticky", top: 0, zIndex: 50, flexWrap: "wrap", gap: 12 },
  brand: { display: "flex", alignItems: "center", gap: 12 },
  logoMark: { fontSize: 32 },
  brandName: { fontWeight: 900, fontSize: 22, letterSpacing: "0.04em" },
  brandTag: { fontSize: 11, color: "#9aa0b5", fontWeight: 600 },
  nav: { display: "flex", alignItems: "center", gap: 6 },
  main: { maxWidth: 1100, margin: "0 auto", padding: "28px 20px 60px" },
  hero: { display: "flex", gap: 24, alignItems: "center", background: "linear-gradient(120deg,#FFE8F0,#EAF0FF)", borderRadius: 28, padding: "40px 36px", marginBottom: 28, overflow: "hidden", flexWrap: "wrap" },
  heroInner: { flex: "1 1 320px" },
  heroEyebrow: { display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 800, color: "#FF6B9D", background: "#fff", padding: "5px 12px", borderRadius: 999, marginBottom: 14 },
  heroTitle: { fontSize: 40, fontWeight: 900, lineHeight: 1.05, margin: "0 0 12px", color: "#26283d" },
  heroSub: { fontSize: 16, color: "#5b6072", maxWidth: 440, margin: "0 0 22px", lineHeight: 1.5 },
  heroArt: { flex: "1 1 220px", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, fontSize: 44, justifyItems: "center" },
  searchRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, marginBottom: 20, flexWrap: "wrap" },
  searchWrap: { display: "flex", alignItems: "center", gap: 10, background: "#fff", border: "1px solid #efe9e1", borderRadius: 14, padding: "11px 16px", flex: 1, minWidth: 240 },
  search: { border: "none", outline: "none", fontSize: 15, flex: 1, background: "transparent", fontFamily: "inherit" },
  resultCount: { fontSize: 13, color: "#9aa0b5", fontWeight: 700 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 18 },
  cardBody: { padding: "14px 16px 16px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  cat: { fontSize: 11, fontWeight: 800, color: "#8a7fd6", background: "#efebff", padding: "3px 9px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.04em" },
  rating: { display: "inline-flex", alignItems: "center", gap: 3, fontSize: 12, fontWeight: 700, color: "#7a7f93" },
  cardName: { fontWeight: 800, fontSize: 16, marginBottom: 3 },
  cardDesc: { fontSize: 13, color: "#5b6072", marginBottom: 8, lineHeight: 1.45, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" },
  cardMeta: { fontSize: 12.5, color: "#9aa0b5", marginBottom: 12, fontWeight: 600 },
  cardFoot: { display: "flex", alignItems: "center", justifyContent: "space-between" },
  price: { fontWeight: 900, fontSize: 18, color: "#26283d" },
  sectionTitle: { fontSize: 28, fontWeight: 900, margin: "0 0 4px", color: "#26283d" },
  sectionSub: { fontSize: 15, color: "#7a7f93", margin: "0 0 22px" },
  subhead: { fontSize: 18, fontWeight: 800, margin: "28px 0 14px" },
  occRow: { display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 },
  occIcon: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 12 },
  suggestHead: { display: "flex", alignItems: "center", gap: 8, fontWeight: 800, fontSize: 16, margin: "8px 0 18px", color: "#26283d" },
  reminderForm: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: 10, marginBottom: 24 },
  input: { padding: "11px 14px", borderRadius: 12, border: "1px solid #e6e0d7", fontSize: 14, fontFamily: "inherit", outline: "none", background: "#fff" },
  reminderList: { display: "flex", flexDirection: "column", gap: 12 },
  reminderTitle: { fontWeight: 800, fontSize: 16 },
  reminderMeta: { fontSize: 13, color: "#9aa0b5", fontWeight: 600 },
  adminTabs: { display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" },
  adminForm: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginBottom: 8 },
  adminLabel: { fontSize: 13, fontWeight: 800, color: "#5b6072", marginBottom: 8 },
  adminList: { display: "flex", flexDirection: "column", gap: 10 },
  adminRow: { display: "flex", alignItems: "center", gap: 14, background: "#fff", border: "1px solid #efe9e1", borderRadius: 14, padding: 12 },
  orderRow: { display: "flex", alignItems: "flex-start", gap: 14, background: "#fff", border: "1px solid #efe9e1", borderRadius: 14, padding: 16 },
  statusPill: { fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 999, marginLeft: 10, textTransform: "uppercase", letterSpacing: "0.03em" },
  pillPending: { background: "#fff4e5", color: "#FFB454" },
  pillPaid: { background: "#e7f7ef", color: "#1faa6b" },
  pillCancel: { background: "#fff1f0", color: "#e5484d" },
  securityNote: { marginTop: 24, background: "#fff8f0", border: "1px solid #ffe3c2", borderRadius: 14, padding: 16, fontSize: 13.5, color: "#7a5a2e", lineHeight: 1.55, maxWidth: 560 },
  qrWrap: { display: "inline-flex", padding: 14, background: "#fff", border: "1px solid #efe9e1", borderRadius: 18, marginBottom: 12 },
  qrHint: { fontSize: 14, color: "#5b6072", marginBottom: 14, fontWeight: 600 },
  qrNote: { fontSize: 12.5, color: "#9aa0b5", margin: "12px 0", lineHeight: 1.5 },
  walletCard: { position: "relative", background: "linear-gradient(135deg,#6C8EFF,#8A7FD6)", borderRadius: 24, padding: "30px 30px 26px", color: "#fff", overflow: "hidden", maxWidth: 420 },
  walletGlow: { position: "absolute", width: 200, height: 200, background: "rgba(255,255,255,0.18)", borderRadius: "50%", top: -70, right: -40 },
  walletLabel: { display: "inline-flex", alignItems: "center", gap: 7, fontSize: 13, fontWeight: 700, opacity: 0.92 },
  walletBalance: { fontSize: 44, fontWeight: 900, margin: "6px 0 18px", letterSpacing: "-0.02em" },
  topUpRow: { display: "flex", gap: 10 },
  logList: { display: "flex", flexDirection: "column", gap: 2, maxWidth: 520 },
  logRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "13px 4px", borderBottom: "1px solid #efe9e1" },
  logType: { fontWeight: 700, fontSize: 14.5 },
  logWhen: { fontSize: 12, color: "#9aa0b5" },
  logAmt: { fontWeight: 800, fontSize: 15 },
  cartList: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 },
  qtyBox: { display: "flex", alignItems: "center", gap: 6, background: "#f4f0ea", borderRadius: 10, padding: 4 },
  qty: { fontWeight: 800, minWidth: 22, textAlign: "center" },
  lineTotal: { fontWeight: 900, minWidth: 70, textAlign: "right", fontSize: 16 },
  summary: { background: "#fff", border: "1px solid #efe9e1", borderRadius: 20, padding: 24, maxWidth: 400, marginLeft: "auto" },
  sumLine: { display: "flex", justifyContent: "space-between", fontSize: 15, padding: "7px 0", color: "#5b6072", fontWeight: 600 },
  sumTotal: { borderTop: "1px solid #efe9e1", marginTop: 8, paddingTop: 14, fontSize: 19, fontWeight: 900, color: "#26283d" },
  empty: { textAlign: "center", padding: "70px 20px", color: "#9aa0b5", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 },
  modalTitle: { fontSize: 22, fontWeight: 900, margin: "0 0 18px" },
  checkoutRows: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 },
  checkoutRow: { display: "flex", justifyContent: "space-between", fontSize: 14.5, fontWeight: 600, color: "#5b6072" },
  payBox: { background: "#f9f6f1", borderRadius: 14, padding: 16, marginBottom: 18 },
  payLine: { display: "flex", justifyContent: "space-between", fontSize: 14, padding: "5px 0", color: "#5b6072", fontWeight: 600 },
  payTotal: { fontWeight: 900, fontSize: 17, color: "#26283d" },
  warn: { background: "#fff1f0", color: "#e5484d", padding: "12px 16px", borderRadius: 12, fontSize: 14, fontWeight: 700, textAlign: "center" },
  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 28px", borderTop: "1px solid #efe9e1", fontSize: 13, fontWeight: 700, color: "#5b6072", flexWrap: "wrap", gap: 8 },
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
* { box-sizing: border-box; }
body { margin: 0; }
.navbtn { display:inline-flex; align-items:center; gap:6px; border:none; background:transparent; font-family:inherit; font-weight:800; font-size:14px; color:#7a7f93; padding:9px 14px; border-radius:11px; cursor:pointer; transition:.15s; }
.navbtn:hover { background:#f4f0ea; color:#26283d; }
.navbtn-on { background:#FFE8F0; color:#FF6B9D; }
.subtab { display:inline-flex; align-items:center; gap:6px; border:2px solid #efe9e1; background:#fff; font-family:inherit; font-weight:800; font-size:13.5px; color:#7a7f93; padding:9px 16px; border-radius:12px; cursor:pointer; transition:.15s; }
.subtab:hover { border-color:#FF6B9D; color:#FF6B9D; }
.subtab-on { background:#FFE8F0; border-color:#FF6B9D; color:#FF6B9D; }
.cartbtn { position:relative; border:none; background:#26283d; color:#fff; width:42px; height:42px; border-radius:12px; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; transition:.15s; }
.cartbtn:hover { transform:translateY(-2px); }
.badge { position:absolute; top:-6px; right:-6px; background:#FF6B9D; color:#fff; font-size:11px; font-weight:900; min-width:19px; height:19px; border-radius:999px; display:flex; align-items:center; justify-content:center; padding:0 4px; }
.cta { display:inline-flex; align-items:center; gap:8px; background:#FF6B9D; color:#fff; border:none; font-family:inherit; font-weight:900; font-size:15px; padding:13px 22px; border-radius:14px; cursor:pointer; transition:.18s; box-shadow:0 6px 18px rgba(255,107,157,.32); }
.cta:hover { transform:translateY(-2px); box-shadow:0 10px 24px rgba(255,107,157,.4); }
.cta:disabled { opacity:.6; cursor:default; transform:none; }
.cta.full { width:100%; justify-content:center; }
.linkbtn { background:none; border:none; color:#FF6B9D; font-family:inherit; font-weight:800; font-size:13.5px; cursor:pointer; padding:0; }
.card { position:relative; background:#fff; border:1px solid #efe9e1; border-radius:20px; overflow:hidden; transition:.2s; }
.card:hover { transform:translateY(-5px); box-shadow:0 16px 34px rgba(40,40,70,.1); border-color:#f3d9e4; }
.cardArt { font-size:64px; text-align:center; padding:26px 0 18px; background:linear-gradient(135deg,#FFF6FA,#F3F6FF); display:flex; align-items:center; justify-content:center; min-height:120px; }
.cardImg { width:100%; height:140px; object-fit:cover; display:block; margin:-26px 0 -18px; }
.cartArt { font-size:40px; width:64px; height:64px; display:flex; align-items:center; justify-content:center; background:#f7f3fb; border-radius:14px; overflow:hidden; }
.favbtn { position:absolute; top:12px; right:12px; z-index:2; border:none; background:rgba(255,255,255,.9); width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#c7ccdb; transition:.15s; }
.favbtn:hover { transform:scale(1.12); }
.favon { color:#FF6B9D; }
.addbtn { display:inline-flex; align-items:center; gap:4px; background:#26283d; color:#fff; border:none; font-family:inherit; font-weight:800; font-size:13px; padding:8px 14px; border-radius:10px; cursor:pointer; transition:.15s; }
.addbtn:hover { background:#FF6B9D; }
.occchip { display:inline-flex; align-items:center; gap:10px; background:#fff; border:2px solid #efe9e1; font-family:inherit; font-weight:800; font-size:15px; color:#26283d; padding:10px 18px 10px 10px; border-radius:16px; cursor:pointer; transition:.15s; }
.occchip:hover { transform:translateY(-2px); }
.topup { background:rgba(255,255,255,.22); color:#fff; border:1.5px solid rgba(255,255,255,.5); font-family:inherit; font-weight:800; font-size:14px; padding:9px 16px; border-radius:11px; cursor:pointer; transition:.15s; }
.topup:hover { background:#fff; color:#6C8EFF; }
.tagchip { background:#fff; border:2px solid #efe9e1; font-family:inherit; font-weight:800; font-size:13px; color:#7a7f93; padding:7px 14px; border-radius:999px; cursor:pointer; transition:.15s; text-transform:capitalize; }
.tagchip:hover { border-color:#FF6B9D; color:#FF6B9D; }
.tagchip-on { background:#FFE8F0; border-color:#FF6B9D; color:#FF6B9D; }
.reminderCard { display:flex; align-items:center; gap:14px; background:#fff; border:1px solid #efe9e1; border-radius:16px; padding:14px 16px; }
.ghostbtn { background:#f4f0ea; border:none; font-family:inherit; font-weight:800; font-size:13px; color:#26283d; padding:8px 14px; border-radius:10px; cursor:pointer; transition:.15s; }
.ghostbtn:hover { background:#FFE8F0; color:#FF6B9D; }
.iconbtn { background:transparent; border:none; color:#c7ccdb; cursor:pointer; padding:7px; border-radius:9px; display:inline-flex; transition:.15s; }
.iconbtn:hover { background:#fff1f0; color:#e5484d; }
.cartRow { display:flex; align-items:center; gap:14px; background:#fff; border:1px solid #efe9e1; border-radius:16px; padding:14px; }
.qtybtn { background:#fff; border:none; width:28px; height:28px; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#26283d; }
.qtybtn:hover { background:#FFE8F0; color:#FF6B9D; }
.overlay { position:fixed; inset:0; background:rgba(31,34,51,.45); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; z-index:100; padding:20px; }
.modal { position:relative; background:#fff; border-radius:24px; padding:30px; max-width:440px; width:100%; max-height:90vh; overflow:auto; box-shadow:0 30px 70px rgba(0,0,0,.25); }
.modalClose { position:absolute; top:16px; right:16px; }
.toast { position:fixed; bottom:26px; left:50%; transform:translateX(-50%); background:#26283d; color:#fff; font-weight:800; font-size:14px; padding:13px 22px; border-radius:14px; z-index:200; box-shadow:0 12px 30px rgba(0,0,0,.25); animation:pop .25s ease; max-width:90vw; text-align:center; }
@keyframes pop { from { transform:translate(-50%,12px); opacity:0; } to { transform:translate(-50%,0); opacity:1; } }
.float { animation:floaty 3s ease-in-out infinite; }
@keyframes floaty { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
.spin { animation:spin 1s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
@media (max-width:640px) { .navbtn span, .navbtn { font-size:0; padding:9px; } .navbtn svg { width:20px; height:20px; } }
@media (max-width:680px) { div[style*="grid-template-columns: 2fr 1fr 1fr auto"] { grid-template-columns:1fr !important; } }
@media (prefers-reduced-motion: reduce) { .float, .toast, .spin { animation:none; } * { transition:none !important; } }
`;
