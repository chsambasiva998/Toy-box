import {
  CakeSlice, Baby, GraduationCap, Gift, Heart, Star, PartyPopper, Sparkles,
} from "lucide-react";

export const OCCASIONS = [
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

export const money = (n) => `₹${Number(n).toFixed(2)}`;
export const ADMIN_EMAIL = "ch.sambasiva998@gmail.com";
export const NEW_DAYS = 14;
export const CATEGORIES = ["STEM & Learning","Plush & Soft Toys","Classic & Wooden","Creative & Arts","Pretend Play","Baby & Infant","Games & Puzzles","Festive & Decor","Keepsakes & Gifts","Outdoor & Active"];
export const ORDER_STAGES = ["paid", "packed", "shipped", "out_for_delivery", "delivered"];
export const STAGE_LABELS = { pending: "Awaiting payment", paid: "Paid", packed: "Packed", shipped: "Shipped", out_for_delivery: "Out for delivery", delivered: "Delivered", cancelled: "Cancelled" };

export const FESTIVALS = [
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

export const EXTRA_PROMPT_IDEAS = [
  "A plush teddy bear in traditional Telugu attire",
  "A wooden puzzle shaped like India's map",
  "A doll house decorated for Diwali",
  "A robot toy dressed as a dhol drummer",
  "A board game about Indian festivals",
];

export function buildUpiString({ upiId, payeeName, amount, note }) {
  const params = new URLSearchParams({ pa: upiId, pn: payeeName || "Vaayanam", am: Number(amount).toFixed(2), cu: "INR", tn: note || "Vaayanam" });
  return `upi://pay?${params.toString()}`;
}
export function isNew(c) { return c ? (Date.now() - new Date(c).getTime()) / 86400000 <= NEW_DAYS : false; }
export function suggestForOccasion(occId, products) {
  const occ = OCCASIONS.find((o) => o.id === occId);
  if (!occ) return products.slice(0, 6);
  return [...products].map((p) => ({ p, score: (p.tags || []).filter((t) => occ.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating).slice(0, 6).map((x) => x.p);
}
export function imagesFor(p) {
  const gallery = (p.product_images || []).slice().sort((a, b) => a.sort - b.sort).map((g) => g.url);
  if (gallery.length) return gallery;
  if (p.image_url) return [p.image_url];
  return [];
}

export function daysUntil(s) { const t = new Date(); t.setHours(0,0,0,0); const d = new Date(s); d.setHours(0,0,0,0); return Math.round((d - t) / 86400000); }
export function prettyDate(s) { return new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
export function prettyDateTime(s) { return new Date(s).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); }
export function nextYearlyDate(dateStr) {
  const orig = new Date(dateStr);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let next = new Date(today.getFullYear(), orig.getMonth(), orig.getDate());
  next.setHours(0, 0, 0, 0);
  if (next < today) next = new Date(today.getFullYear() + 1, orig.getMonth(), orig.getDate());
  return next;
}
export function daysUntilYearly(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.round((nextYearlyDate(dateStr) - today) / 86400000);
}
