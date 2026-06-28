import React, { createContext, useContext, useState, useEffect } from "react";

// ---- Translation strings -------------------------------------------------
// Interface only. Product names/descriptions stay as typed by the admin.
export const STRINGS = {
  en: {
    lang_name: "English",
    // nav
    nav_shop: "Shop", nav_occasions: "Occasions", nav_design: "Design a Toy",
    nav_orders: "My Orders", nav_reminders: "Reminders", nav_wallet: "Wallet",
    nav_profile: "Profile", nav_admin: "Admin", nav_cart: "Cart", sign_out: "Sign out",
    // auth
    welcome_back: "Welcome back.", create_account: "Create your account.", reset_password: "Reset your password.",
    email_ph: "you@email.com", password_ph: "Password (6+ chars)",
    sign_in: "Sign in", sign_up: "Sign up", send_reset: "Send reset link",
    forgot_password: "Forgot password?", new_here: "New here? ", have_account: "Have an account? ",
    create_one: "Create one",
    // shop
    coming_up: "Coming up:", view: "View", gifts_with_meaning: "Gifts with meaning",
    hero_title: "Give love and respect, the Telugu way.",
    hero_sub: "Toys, keepsakes, and festive gifts — and design your very own toy for any festival with AI.",
    shop_by_occasion: "Shop by occasion", design_a_toy: "Design a toy",
    search_ph: "Search toys, categories…", items: "items",
    no_toys: "No toys yet.", add_from_admin: " Add some from the Admin tab.",
    // occasions
    what_celebrating: "What are we celebrating?",
    occ_sub: "Pick a moment and we'll match the perfect gifts.",
    curated_for: "Curated picks for", add_toys_picks: "Add toys to see picks.",
    // product
    add: "Add", add_to_cart: "Add to cart", ages: "Ages",
    // cart
    your_cart: "Your cart", cart_empty: "Your cart is empty.", start_shopping: "Start shopping",
    subtotal: "Subtotal", shipping: "Shipping", free: "Free", reward: "Reward",
    reward_on_approval: "+₹50 on approval", total: "Total", wallet: "Wallet",
    pay_from_wallet: "Pay from wallet", checkout_upi: "Checkout with UPI",
    add_address_first: "Add a delivery address before checkout.", add_delivery_address: "Add delivery address",
    // wallet
    your_wallet: "Your wallet",
    wallet_sub: "Recharge via UPI — the shop confirms your payment and your balance updates live.",
    balance: "Balance", recharge_upi: "Recharge via UPI",
    recharge_when_upi: "Recharge available once the shop sets a UPI ID.",
    activity: "Activity", no_activity: "No activity yet.", recent_orders: "Recent orders", no_orders: "No orders yet.",
    // profile
    profile_title: "Your profile", profile_sub: "Your delivery details, saved for faster checkout.",
    delivery_details: "Delivery details", full_name: "Full name", phone: "Phone number",
    address_ph: "Full delivery address with pincode", save_delivery: "Save delivery details",
    delivery_saved: "Delivery details saved",
    // orders
    my_orders: "My orders", orders_sub: "Track each order from payment to delivery.",
    order: "Order", track_package: "Track package",
    stage_pending: "Awaiting payment", stage_paid: "Paid", stage_packed: "Packed",
    stage_shipped: "Shipped", stage_out: "Out for delivery", stage_delivered: "Delivered",
    stage_cancelled: "Cancelled", awaiting_confirmation: "Awaiting payment confirmation",
    // reviews
    reviews: "Reviews", write_review: "Write a review", your_rating: "Your rating",
    review_ph: "Share what you thought…", submit_review: "Submit review",
    no_reviews: "No reviews yet. Be the first!", review_saved: "Thanks for your review!",
    avg_rating: "average", review_count_one: "review", review_count_many: "reviews",
    // checkout
    checkout: "Checkout", wallet_balance: "Wallet balance",
    pay_upi_qr: "Pay by UPI QR instead", no_upi_yet: "No UPI ID set up yet.",
    scan_to_pay: "Scan to pay", open_upi: "Open in UPI app", ive_paid: "I've paid — place order",
    order_pending_until: "is pending until the shop confirms payment.",
    // misc
    loading: "Loading…", done: "Done", save: "Save", cancel: "Cancel",
  },

  te: {
    lang_name: "తెలుగు",
    nav_shop: "దుకాణం", nav_occasions: "సందర్భాలు", nav_design: "బొమ్మను డిజైన్ చేయి",
    nav_orders: "నా ఆర్డర్లు", nav_reminders: "రిమైండర్లు", nav_wallet: "వాలెట్",
    nav_profile: "ప్రొఫైల్", nav_admin: "అడ్మిన్", nav_cart: "కార్ట్", sign_out: "సైన్ అవుట్",
    welcome_back: "మళ్లీ స్వాగతం.", create_account: "మీ ఖాతాను సృష్టించండి.", reset_password: "పాస్‌వర్డ్ రీసెట్ చేయండి.",
    email_ph: "you@email.com", password_ph: "పాస్‌వర్డ్ (6+ అక్షరాలు)",
    sign_in: "సైన్ ఇన్", sign_up: "సైన్ అప్", send_reset: "రీసెట్ లింక్ పంపండి",
    forgot_password: "పాస్‌వర్డ్ మర్చిపోయారా?", new_here: "కొత్తవారా? ", have_account: "ఖాతా ఉందా? ",
    create_one: "సృష్టించండి",
    coming_up: "రాబోతున్నవి:", view: "చూడండి", gifts_with_meaning: "అర్థవంతమైన బహుమతులు",
    hero_title: "ప్రేమను, గౌరవాన్ని తెలుగు మార్గంలో పంచండి.",
    hero_sub: "బొమ్మలు, జ్ఞాపికలు, పండుగ బహుమతులు — ఏ పండుగకైనా మీ సొంత బొమ్మను AI తో డిజైన్ చేయండి.",
    shop_by_occasion: "సందర్భం ప్రకారం షాపింగ్", design_a_toy: "బొమ్మను డిజైన్ చేయి",
    search_ph: "బొమ్మలు, వర్గాలు వెతకండి…", items: "వస్తువులు",
    no_toys: "ఇంకా బొమ్మలు లేవు.", add_from_admin: " అడ్మిన్ ట్యాబ్ నుండి జోడించండి.",
    what_celebrating: "మనం ఏమి జరుపుకుంటున్నాం?",
    occ_sub: "ఒక సందర్భాన్ని ఎంచుకోండి, సరైన బహుమతులు చూపిస్తాం.",
    curated_for: "ఎంపిక చేసిన బహుమతులు", add_toys_picks: "ఎంపికలు చూడటానికి బొమ్మలు జోడించండి.",
    add: "జోడించు", add_to_cart: "కార్ట్‌కు జోడించు", ages: "వయసు",
    your_cart: "మీ కార్ట్", cart_empty: "మీ కార్ట్ ఖాళీగా ఉంది.", start_shopping: "షాపింగ్ ప్రారంభించండి",
    subtotal: "సబ్‌టోటల్", shipping: "షిప్పింగ్", free: "ఉచితం", reward: "రివార్డ్",
    reward_on_approval: "ఆమోదంపై +₹50", total: "మొత్తం", wallet: "వాలెట్",
    pay_from_wallet: "వాలెట్ నుండి చెల్లించండి", checkout_upi: "UPI తో చెక్అవుట్",
    add_address_first: "చెక్అవుట్‌కు ముందు డెలివరీ చిరునామా జోడించండి.", add_delivery_address: "డెలివరీ చిరునామా జోడించండి",
    your_wallet: "మీ వాలెట్",
    wallet_sub: "UPI ద్వారా రీఛార్జ్ చేయండి — దుకాణం చెల్లింపును నిర్ధారిస్తుంది, మీ బ్యాలెన్స్ లైవ్‌లో అప్‌డేట్ అవుతుంది.",
    balance: "బ్యాలెన్స్", recharge_upi: "UPI ద్వారా రీఛార్జ్",
    recharge_when_upi: "దుకాణం UPI ID సెట్ చేసిన తర్వాత రీఛార్జ్ అందుబాటులో ఉంటుంది.",
    activity: "కార్యకలాపం", no_activity: "ఇంకా కార్యకలాపం లేదు.", recent_orders: "ఇటీవలి ఆర్డర్లు", no_orders: "ఇంకా ఆర్డర్లు లేవు.",
    profile_title: "మీ ప్రొఫైల్", profile_sub: "వేగవంతమైన చెక్అవుట్ కోసం మీ డెలివరీ వివరాలు.",
    delivery_details: "డెలివరీ వివరాలు", full_name: "పూర్తి పేరు", phone: "ఫోన్ నంబర్",
    address_ph: "పిన్‌కోడ్‌తో పూర్తి డెలివరీ చిరునామా", save_delivery: "డెలివరీ వివరాలు సేవ్ చేయి",
    delivery_saved: "డెలివరీ వివరాలు సేవ్ అయ్యాయి",
    my_orders: "నా ఆర్డర్లు", orders_sub: "ప్రతి ఆర్డర్‌ను చెల్లింపు నుండి డెలివరీ వరకు ట్రాక్ చేయండి.",
    order: "ఆర్డర్", track_package: "ప్యాకేజీ ట్రాక్ చేయి",
    stage_pending: "చెల్లింపు కోసం వేచి ఉంది", stage_paid: "చెల్లించబడింది", stage_packed: "ప్యాక్ చేయబడింది",
    stage_shipped: "పంపబడింది", stage_out: "డెలివరీకి బయలుదేరింది", stage_delivered: "డెలివరీ అయింది",
    stage_cancelled: "రద్దు చేయబడింది", awaiting_confirmation: "చెల్లింపు నిర్ధారణ కోసం వేచి ఉంది",
    reviews: "సమీక్షలు", write_review: "సమీక్ష రాయండి", your_rating: "మీ రేటింగ్",
    review_ph: "మీ అభిప్రాయం పంచుకోండి…", submit_review: "సమీక్ష సమర్పించండి",
    no_reviews: "ఇంకా సమీక్షలు లేవు. మొదటివారు అవ్వండి!", review_saved: "మీ సమీక్షకు ధన్యవాదాలు!",
    avg_rating: "సగటు", review_count_one: "సమీక్ష", review_count_many: "సమీక్షలు",
    checkout: "చెక్అవుట్", wallet_balance: "వాలెట్ బ్యాలెన్స్",
    pay_upi_qr: "బదులుగా UPI QR తో చెల్లించండి", no_upi_yet: "ఇంకా UPI ID సెట్ చేయలేదు.",
    scan_to_pay: "చెల్లించడానికి స్కాన్ చేయండి", open_upi: "UPI యాప్‌లో తెరవండి", ive_paid: "నేను చెల్లించాను — ఆర్డర్ చేయండి",
    order_pending_until: "దుకాణం చెల్లింపును నిర్ధారించే వరకు పెండింగ్‌లో ఉంది.",
    loading: "లోడ్ అవుతోంది…", done: "పూర్తయింది", save: "సేవ్", cancel: "రద్దు",
  },

  hi: {
    lang_name: "हिन्दी",
    nav_shop: "दुकान", nav_occasions: "अवसर", nav_design: "खिलौना डिज़ाइन करें",
    nav_orders: "मेरे ऑर्डर", nav_reminders: "रिमाइंडर", nav_wallet: "वॉलेट",
    nav_profile: "प्रोफ़ाइल", nav_admin: "एडमिन", nav_cart: "कार्ट", sign_out: "साइन आउट",
    welcome_back: "वापसी पर स्वागत है.", create_account: "अपना खाता बनाएं.", reset_password: "पासवर्ड रीसेट करें.",
    email_ph: "you@email.com", password_ph: "पासवर्ड (6+ अक्षर)",
    sign_in: "साइन इन", sign_up: "साइन अप", send_reset: "रीसेट लिंक भेजें",
    forgot_password: "पासवर्ड भूल गए?", new_here: "नए हैं? ", have_account: "खाता है? ",
    create_one: "बनाएं",
    coming_up: "आने वाले:", view: "देखें", gifts_with_meaning: "अर्थपूर्ण उपहार",
    hero_title: "तेलुगु अंदाज़ में प्यार और सम्मान बांटें.",
    hero_sub: "खिलौने, यादगार और त्योहारी उपहार — किसी भी त्योहार के लिए AI से अपना खिलौना डिज़ाइन करें.",
    shop_by_occasion: "अवसर के अनुसार खरीदें", design_a_toy: "खिलौना डिज़ाइन करें",
    search_ph: "खिलौने, श्रेणियां खोजें…", items: "वस्तुएं",
    no_toys: "अभी कोई खिलौना नहीं.", add_from_admin: " एडमिन टैब से जोड़ें.",
    what_celebrating: "हम क्या मना रहे हैं?",
    occ_sub: "एक अवसर चुनें और हम सही उपहार दिखाएंगे.",
    curated_for: "चुने हुए उपहार", add_toys_picks: "सुझाव देखने के लिए खिलौने जोड़ें.",
    add: "जोड़ें", add_to_cart: "कार्ट में जोड़ें", ages: "उम्र",
    your_cart: "आपका कार्ट", cart_empty: "आपका कार्ट खाली है.", start_shopping: "खरीदारी शुरू करें",
    subtotal: "उप-योग", shipping: "शिपिंग", free: "मुफ़्त", reward: "इनाम",
    reward_on_approval: "मंज़ूरी पर +₹50", total: "कुल", wallet: "वॉलेट",
    pay_from_wallet: "वॉलेट से भुगतान करें", checkout_upi: "UPI से चेकआउट",
    add_address_first: "चेकआउट से पहले डिलीवरी पता जोड़ें.", add_delivery_address: "डिलीवरी पता जोड़ें",
    your_wallet: "आपका वॉलेट",
    wallet_sub: "UPI से रिचार्ज करें — दुकान भुगतान की पुष्टि करती है और आपका बैलेंस लाइव अपडेट होता है.",
    balance: "बैलेंस", recharge_upi: "UPI से रिचार्ज",
    recharge_when_upi: "दुकान द्वारा UPI ID सेट करने पर रिचार्ज उपलब्ध होगा.",
    activity: "गतिविधि", no_activity: "अभी कोई गतिविधि नहीं.", recent_orders: "हाल के ऑर्डर", no_orders: "अभी कोई ऑर्डर नहीं.",
    profile_title: "आपकी प्रोफ़ाइल", profile_sub: "तेज़ चेकआउट के लिए सहेजे गए आपके डिलीवरी विवरण.",
    delivery_details: "डिलीवरी विवरण", full_name: "पूरा नाम", phone: "फ़ोन नंबर",
    address_ph: "पिनकोड सहित पूरा डिलीवरी पता", save_delivery: "डिलीवरी विवरण सहेजें",
    delivery_saved: "डिलीवरी विवरण सहेजे गए",
    my_orders: "मेरे ऑर्डर", orders_sub: "हर ऑर्डर को भुगतान से डिलीवरी तक ट्रैक करें.",
    order: "ऑर्डर", track_package: "पैकेज ट्रैक करें",
    stage_pending: "भुगतान का इंतज़ार", stage_paid: "भुगतान हुआ", stage_packed: "पैक किया गया",
    stage_shipped: "भेजा गया", stage_out: "डिलीवरी के लिए निकला", stage_delivered: "डिलीवर हुआ",
    stage_cancelled: "रद्द किया गया", awaiting_confirmation: "भुगतान पुष्टि का इंतज़ार",
    reviews: "समीक्षाएं", write_review: "समीक्षा लिखें", your_rating: "आपकी रेटिंग",
    review_ph: "अपनी राय साझा करें…", submit_review: "समीक्षा सबमिट करें",
    no_reviews: "अभी कोई समीक्षा नहीं. पहले बनें!", review_saved: "आपकी समीक्षा के लिए धन्यवाद!",
    avg_rating: "औसत", review_count_one: "समीक्षा", review_count_many: "समीक्षाएं",
    checkout: "चेकआउट", wallet_balance: "वॉलेट बैलेंस",
    pay_upi_qr: "इसके बजाय UPI QR से भुगतान करें", no_upi_yet: "अभी UPI ID सेट नहीं है.",
    scan_to_pay: "भुगतान के लिए स्कैन करें", open_upi: "UPI ऐप में खोलें", ive_paid: "मैंने भुगतान किया — ऑर्डर करें",
    order_pending_until: "दुकान द्वारा भुगतान की पुष्टि तक लंबित है.",
    loading: "लोड हो रहा है…", done: "हो गया", save: "सहेजें", cancel: "रद्द",
  },
};

export const LANGS = ["en", "te", "hi"];

const I18nContext = createContext({ lang: "en", t: (k) => k, setLang: () => {} });

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try { return localStorage.getItem("vaayanam_lang") || "en"; } catch { return "en"; }
  });
  useEffect(() => {
    try { localStorage.setItem("vaayanam_lang", lang); } catch {}
  }, [lang]);
  const t = (key) => (STRINGS[lang] && STRINGS[lang][key]) || STRINGS.en[key] || key;
  return <I18nContext.Provider value={{ lang, t, setLang }}>{children}</I18nContext.Provider>;
}

export function useT() {
  return useContext(I18nContext);
}
