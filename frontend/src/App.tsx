import { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// Layouts
import Layout from './components/Layout';

// Pages
import Landing from './pages/Landing';
import Contact from './pages/Contact';
import Products from './pages/Products';
import About from './pages/About';

// Product Pages
import PureChocolateBar from './pages/products/PureChocolateBar';
import ChocolateNibsSalt from './pages/products/ChocolateNibsSalt';
import ChocolateCoffee from './pages/products/ChocolateCoffee';
import FruitBonbons from './pages/products/FruitBonbons';
import CacaoNibs from './pages/products/CacaoNibs';
import CacaoLiqueur from './pages/products/CacaoLiqueur';
import CacaoCocktail from './pages/products/CacaoCocktail';

const App: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="about" element={<About/>} />
        <Route path="contact" element={<Contact />} />
        <Route path="products" element={<Products />} />
        <Route path="products/chocolate-100" element={<PureChocolateBar />} />
        <Route path="products/chocolate-nibs-salt" element={<ChocolateNibsSalt />} />
        <Route path="products/chocolate-coffee" element={<ChocolateCoffee />} />
        <Route path="products/fruit-bonbons" element={<FruitBonbons />} />
        <Route path="products/cacao-nibs" element={<CacaoNibs />} />
        <Route path="products/cacao-liqueur" element={<CacaoLiqueur />} />
        <Route path="products/cacao-cocktail" element={<CacaoCocktail />} />
      </Route>
    </Routes>
  );
}

export default App;
