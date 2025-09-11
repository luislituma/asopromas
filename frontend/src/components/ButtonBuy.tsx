// src/components/ButtonBuy.tsx
import { type FC } from "react";

interface Props {
  productId?: string;
  productName?: string;
  phone?: string; // si quieres sobreescribir el número por producto
}

const DEFAULT_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "593123456789"; 
// Pon tu número real en .env: VITE_WHATSAPP_NUMBER=593XXXXXXXXX

const ButtonBuy: FC<Props> = ({ productId, productName, phone }) => {
  const number = phone ?? DEFAULT_WHATSAPP;
  const message = productName
    ? `Hello! I'm interested in *${productName}* (ref: ${productId ?? "-"})`
    : `Hello! I'm interested in a product (ref: ${productId ?? "-"})`;
  const href = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-[#8B4513] hover:bg-[#6f3610] text-white px-3 py-2 rounded-lg text-sm font-medium shadow-sm transition"
      aria-label={`Buy ${productName ?? "product"} via WhatsApp`}
    >
      Buy
    </a>
  );
};

export default ButtonBuy;
