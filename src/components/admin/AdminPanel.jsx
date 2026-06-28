import React, { useState } from "react";
import { ClipboardList, CreditCard, Package, Settings } from "lucide-react";
import { S } from "../../styles";
import { useT } from "../../i18n";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminTopups from "./AdminTopups";
import AdminSettings from "./AdminSettings";

export default function AdminPanel({ flash, onChanged, products, settings }) {
  const [sub, setSub] = useState("products");
  return (
    <>
      <div style={S.adminTabs}>
        <button className={`subtab ${sub === "products" ? "subtab-on" : ""}`} onClick={() => setSub("products")}><Package size={15} /> Products</button>
        <button className={`subtab ${sub === "orders" ? "subtab-on" : ""}`} onClick={() => setSub("orders")}><ClipboardList size={15} /> Orders</button>
        <button className={`subtab ${sub === "topups" ? "subtab-on" : ""}`} onClick={() => setSub("topups")}><CreditCard size={15} /> Top-ups</button>
        <button className={`subtab ${sub === "settings" ? "subtab-on" : ""}`} onClick={() => setSub("settings")}><Settings size={15} /> Payment</button>
      </div>
      {sub === "products" && <AdminProducts flash={flash} onChanged={onChanged} products={products} />}
      {sub === "orders" && <AdminOrders flash={flash} />}
      {sub === "topups" && <AdminTopups flash={flash} />}
      {sub === "settings" && <AdminSettings flash={flash} onChanged={onChanged} settings={settings} />}
    </>
  );
}
