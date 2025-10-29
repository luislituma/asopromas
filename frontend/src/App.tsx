import { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// Configuration
import { SITE_CONFIG } from './config/site';

// Layouts
import Layout from './components/Layout';

// Coming Soon Page
import ComingSoon from './pages/ComingSoon';

// Pages
import Landing from './pages/Landing';
import Contact from './pages/Contact';
import Products from './pages/Products';
import About from './pages/About';
import CacaoOrigin from './pages/CacaoOrigin';

// About Pages
import Mission from './pages/about/Mission';
import Values from './pages/about/Values';
import History from './pages/about/History';
import Producers from './pages/about/Producers';
import Sustainability from './pages/about/Sustainability';
import Certifications from './pages/about/Certifications';

// Product Pages
import ChocolateBar100 from './pages/products/PureChocolateBar';
import ChocolateNibsSalt from './pages/products/ChocolateNibsSalt';
import ChocolateCoffee from './pages/products/ChocolateCoffee';
import FruitBonbons from './pages/products/FruitBonbons';
import CocoaNibs from './pages/products/CocoaNibs';
import CocoaLiqueur from './pages/products/CacaoLiqueur';
import CocoaCocktail from './pages/products/CacaoCocktail';

// Configuración: cambiar a false cuando quieras mostrar el sitio completo
const COMING_SOON_MODE = SITE_CONFIG.COMING_SOON_MODE;

const App: FC = () => {
  // Si está en modo "Coming Soon", mostrar solo esa página
  if (COMING_SOON_MODE) {
    return <ComingSoon />;
  }

  // Sitio completo cuando COMING_SOON_MODE = false
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="cacao-origin" element={<CacaoOrigin />} />
        <Route path="about" element={<About/>} />
        <Route path="about/history" element={<History />} />
        <Route path="about/mission" element={<Mission />} />
        <Route path="about/values" element={<Values />} />
        <Route path="about/producers" element={<Producers />} />
        <Route path="about/sustainability" element={<Sustainability />} />
        <Route path="about/certifications" element={<Certifications />} />
        <Route path="contact" element={<Contact />} />
        <Route path="products" element={<Products />} />
        <Route path="products/chocolate-bar-100" element={<ChocolateBar100 />} />
        <Route path="products/chocolate-nibs-salt" element={<ChocolateNibsSalt />} />
        <Route path="products/chocolate-coffee" element={<ChocolateCoffee />} />
        <Route path="products/fruit-bonbons" element={<FruitBonbons />} />
        <Route path="products/cocoa-nibs" element={<CocoaNibs />} />
        <Route path="products/cocoa-liqueur" element={<CocoaLiqueur />} />
        <Route path="products/cocoa-cocktail" element={<CocoaCocktail />} />
      </Route>
    </Routes>
  );
}

export default App;
