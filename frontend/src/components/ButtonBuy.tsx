// src/components/ButtonBuy.tsx
import { type FC } from "react";
import { MessageCircle, ShoppingCart } from "lucide-react";

interface Props {
  productId?: string;
  productName?: string;
  phone?: string; // si quieres sobreescribir el número por producto
  variant?: "primary" | "secondary" | "whatsapp";
  size?: "sm" | "md" | "lg";
}

const DEFAULT_WHATSAPP = import.meta.env.VITE_WHATSAPP_NUMBER || "593961706421"; 
// Pon tu número real en .env: VITE_WHATSAPP_NUMBER=593XXXXXXXXX

const ButtonBuy: FC<Props> = ({ 
  productId, 
  productName, 
  phone, 
  variant = "whatsapp",
  size = "md" 
}) => {
  const number = phone ?? DEFAULT_WHATSAPP;
  const message = productName
    ? `¡Hola! Estoy interesado/a en *${productName}* (ref: ${productId ?? "-"}). ¿Podrías darme más información sobre este producto?`
    : `¡Hola! Estoy interesado/a en conocer más sobre sus productos (ref: ${productId ?? "-"})`;
  const href = `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

  // Configuración de variantes - Temática de chocolate
  const variants = {
    primary: "bg-gradient-to-r from-amber-700 via-yellow-600 to-amber-800 hover:from-amber-800 hover:via-yellow-700 hover:to-amber-900 text-white shadow-lg hover:shadow-xl border border-amber-600/30",
    secondary: "bg-gradient-to-r from-amber-900 via-yellow-800 to-amber-950 hover:from-amber-950 hover:via-yellow-900 hover:to-black text-amber-100 shadow-lg hover:shadow-xl border border-amber-700/40",
    whatsapp: "bg-gradient-to-r from-amber-800 via-amber-700 to-amber-800 hover:from-amber-900 hover:via-amber-800 hover:to-amber-900 text-white shadow-lg hover:shadow-xl border border-green-600/30"
  };

  // Configuración de tamaños
  const sizes = {
    sm: "px-3 py-2 text-sm gap-1.5",
    md: "px-4 py-2.5 text-base gap-2",
    lg: "px-6 py-3 text-lg gap-2.5"
  };

  const iconSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center
        ${variants[variant]}
        ${sizes[size]}
        rounded-xl font-bold
        transform transition-all duration-300 ease-in-out
        hover:scale-105 hover:-translate-y-1
        focus:outline-none focus:ring-4 focus:ring-opacity-50
        ${variant === "whatsapp" ? "focus:ring-amber-400/50" : "focus:ring-amber-500/50"}
        active:scale-95
        group
        relative overflow-hidden
        backdrop-blur-sm
      `}
      aria-label={`Comprar ${productName ?? "producto"} vía WhatsApp`}
    >
      {variant === "whatsapp" ? (
        <MessageCircle className={`${iconSize[size]} transition-transform duration-300 group-hover:rotate-12 drop-shadow-md`} />
      ) : (
        <ShoppingCart className={`${iconSize[size]} transition-transform duration-300 group-hover:scale-110 drop-shadow-md`} />
      )}
      <span className="font-bold tracking-wide">
        {variant === "whatsapp" ? "WhatsApp" : "Comprar"}
      </span>
      
      {/* Efecto de brillo dorado - temática chocolate */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-300/20 to-amber-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Partículas de chocolate flotantes */}
      <div className="absolute inset-0 rounded-xl overflow-hidden">
        <div className="absolute top-1 left-2 w-1 h-1 bg-yellow-300/40 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 right-3 w-0.5 h-0.5 bg-amber-200/50 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-3 right-1 w-0.5 h-0.5 bg-yellow-400/30 rounded-full animate-pulse delay-700"></div>
      </div>
    </a>
  );
};

export default ButtonBuy;
