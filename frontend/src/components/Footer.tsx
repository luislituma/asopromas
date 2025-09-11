import { type FC, useState, useEffect } from "react";
import { Facebook, Instagram, Youtube, Mail, Send } from "lucide-react";

function formatTimeUnit(unit: number): string {
  return unit.toString().padStart(2, "0");
}

const Reloj: FC = () => {
  const [hora, setHora] = useState(new Date());
  useEffect(() => {
    const intervalo = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);
  return (
    <small className="text-amber-600 block text-right mr-6">
      {formatTimeUnit(hora.getHours())}:
      {formatTimeUnit(hora.getMinutes())}:
      {formatTimeUnit(hora.getSeconds())}
    </small>
  );
};

const Footer: FC = () => {
  return (
    <footer className="bg-gradient-to-t from-black to-amber-950/80 h-64 w-full rounded-lg text-white py-10 mt-0">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Columna 1: Marca */}
        <div>
          <h2 className="text-xl text-amber-600 font-bold">ASOPROMAS</h2>
          
          <img src="/src/assets/icons/logo.svg" alt="ASOPROMAS Logo"  className="w-20"/>
          <p className="mt-3 text-white text-sm">
            Origin cacao, crafted with passion by our community.
          </p>
        </div>

        {/* Columna 2: Links */}
        <div>
          <h3 className="text-lg text-amber-600 font-semibold mb-3">Links</h3>
          <ul className="space-y-2 text-white">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/products" className="hover:text-white">Products</a></li>
            <li><a href="/blog" className="hover:text-white">Blog</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Columna 3: Redes */}
        <div>
          <h3 className="text-lg text-amber-600 font-semibold mb-3">Follow us</h3>
          <div className="flex space-x-4 text-white">
            <a href="https://www.facebook.com/asopromas" className="hover:text-white"><Facebook /></a>
            <a href="https://www.instagram.com/asopromas" className="hover:text-white"><Instagram /></a>
            <a href="https://www.youtube.com/asopromas" className="hover:text-white"><Youtube /></a>
            <a href="mailto:info@asopromas.com" className="hover:text-white"><Mail /></a>
          </div>
        </div>

        {/* Columna 4: Newsletter */}
        <div className="border rounded-lg p-4 bg-brown-900">
          <h3 className="text-lg text-amber-600 font-semibold mb-3">Suscribe</h3>
          <p className="text-sm text-white mb-3">
            Receive news and updates about our products.
          </p>
          <form className="flex">
            <input
              type="email"
              placeholder="Your email"
              className="w-full p-2 rounded-l-md text-black"
            />
            <button
              type="submit"
              className="bg-[#8B4513] hover:bg-[#6f3610] p-2 rounded-r-md"
            >
              <Send size={18} />
            </button>
          </form>
          <p className="text-xs text-white">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>

      {/* Línea inferior */}
      <div className="text-center text-sm  text-white">
        © {new Date().getFullYear()} ASOPROMAS - All rights reserved.
      </div>
      <Reloj />
    </footer>
  );
};

export default Footer;
