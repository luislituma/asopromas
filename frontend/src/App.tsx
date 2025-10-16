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

// About Pages
import Mission from './pages/about/Mission';
import Values from './pages/about/Values';
import History from './pages/about/History';
import Producers from './pages/about/Producers';
import Sustainability from './pages/about/Sustainability';
import Certifications from './pages/about/Certifications';

// Product Pages
import PureChocolateBar from './pages/products/PureChocolateBar';
import ChocolateNibsSalt from './pages/products/ChocolateNibsSalt';
import ChocolateCoffee from './pages/products/ChocolateCoffee';
import FruitBonbons from './pages/products/FruitBonbons';
import CacaoLiqueur from './pages/products/CacaoLiqueur';
import CacaoCocktail from './pages/products/CacaoCocktail';
import CocoaNibs from './pages/products/CocoaNibs';
import CocoaPowder from './pages/products/CocoaPowder';
import CocoaLiquor from './pages/products/CocoaLiquor';
import Pralines from './pages/products/Pralines';

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
        <Route path="about" element={<About/>} />
        <Route path="about/history" element={<History />} />
        <Route path="about/mission" element={<Mission />} />
        <Route path="about/values" element={<Values />} />
        <Route path="about/producers" element={<Producers />} />
        <Route path="about/sustainability" element={<Sustainability />} />
        <Route path="about/certifications" element={<Certifications />} />
        <Route path="contact" element={<Contact />} />
        <Route path="products" element={<Products />} />
        <Route path="products/pure-chocolate-bar" element={<PureChocolateBar />} />
        <Route path="products/chocolate-nibs-salt" element={<ChocolateNibsSalt />} />
        <Route path="products/chocolate-coffee" element={<ChocolateCoffee />} />
        <Route path="products/fruit-bonbons" element={<FruitBonbons />} />
        <Route path="products/cacao-liqueur" element={<CacaoLiqueur />} />
        <Route path="products/cacao-cocktail" element={<CacaoCocktail />} />
        <Route path="products/cocoa-nibs" element={<CocoaNibs />} />
        <Route path="products/cocoa-powder" element={<CocoaPowder />} />
        <Route path="products/cocoa-liquor" element={<CocoaLiquor />} />
        <Route path="products/pralines" element={<Pralines />} />
      </Route>
    </Routes>
  );
}

export default App;
