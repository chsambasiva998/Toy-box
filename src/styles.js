export const S = {
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

export const CSS = `
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
.langsel { border:2px solid #f0e3ec; background:#fff; font-family:inherit; font-weight:800; font-size:13px; color:#3a2150; padding:7px 8px; border-radius:10px; cursor:pointer; }
.langsel:hover { border-color:#C1432E; }
`;
