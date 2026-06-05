import { type FC } from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

// Configuration
import { SITE_CONFIG } from './config/site';

import Layout from './components/Layout';
import DashboardLayout from './components/DashboardLayout';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Coming Soon Page
import ComingSoon from './pages/ComingSoon';

// App Pages
import Login from './pages/auth/Login';
import Profile from './pages/auth/Profile';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/Dashboard';
import ListaSocios from './pages/socios/ListaSocios';
import RegistroSocio from './pages/socios/RegistroSocio';
import EditarSocio from './pages/socios/EditarSocio';
import VerSocio from './pages/socios/VerSocio';
import FincasList from './pages/socios/FincasList';
import FincaForm from './pages/socios/FincaForm';
import GruposList from './pages/socios/GruposList';
import GrupoForm from './pages/socios/GrupoForm';
import ProductosList from './pages/procesamiento/ProductosList';
import ProductoForm from './pages/procesamiento/ProductoForm';
import OrdenesProcesamientoList from './pages/procesamiento/OrdenesProcesamientoList';
import EjecutarOrdenForm from './pages/procesamiento/EjecutarOrdenForm';
import OrdenProcesamientoDetalle from './pages/procesamiento/OrdenProcesamientoDetalle';
import ClientesList from './pages/ventas/ClientesList';
import ClienteForm from './pages/ventas/ClienteForm';
import VentasList from './pages/ventas/VentasList';
import TiendaList from './pages/ventas/TiendaList';
import NuevaVentaForm from './pages/ventas/NuevaVentaForm';
import VentaDetalle from './pages/ventas/VentaDetalle';
import VisitasList from './pages/campo/VisitasList';
import VisitaForm from './pages/campo/VisitaForm';
import ProyectosList from './pages/proyectos/ProyectosList';
import ProyectoForm from './pages/proyectos/ProyectoForm';
import CapacitacionesList from './pages/proyectos/CapacitacionesList';
import AsistenciaCapacitacion from './pages/proyectos/AsistenciaCapacitacion';
import AcopiosList from './pages/acopio/AcopiosList';
import AcopioForm from './pages/acopio/AcopioForm';
import AcopioDetalle from './pages/acopio/AcopioDetalle';
import RegistroEntrega from './pages/acopio/RegistroEntrega';
import LotesList from './pages/acopio/LotesList';
import EditarLote from './pages/acopio/EditarLote';
import LoteDetalle from './pages/acopio/LoteDetalle';
import InsumosList from './pages/inventario/InsumosList';
import InsumoForm from './pages/inventario/InsumoForm';
import AsignarInsumo from './pages/inventario/AsignarInsumo';
import PagosList from './pages/pagos/PagosList';
import LiquidacionPago from './pages/pagos/LiquidacionPago';
import EquiposList from './pages/inventario/EquiposList';
import EquipoForm from './pages/inventario/EquipoForm';
import ComprasList from './pages/pagos/ComprasList';
import NuevaCompraForm from './pages/pagos/NuevaCompraForm';
import CompraDetalle from './pages/pagos/CompraDetalle';
// Pages
import Landing from './pages/Landing';
import Contact from './pages/Contact';
import Products from './pages/Products';
import About from './pages/About';
import CacaoOrigin from './pages/CacaoOrigin';
import RutaCacaoAncestral from './pages/RutaCacaoAncestral';

// About Pages
import Mission from './pages/about/Mission';
import Values from './pages/about/Values';
import History from './pages/about/History';
import Producers from './pages/about/Producers';
import Sustainability from './pages/about/Sustainability';
import Certifications from './pages/about/Certifications';

// Legal Pages
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

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
    <>
      <ScrollToTop />
      <Routes>
        {/* Rutas Públicas (App Web) */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="cacao-origin" element={<CacaoOrigin />} />
        <Route path="ruta-cacao-ancestral" element={<RutaCacaoAncestral />} />
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
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
      </Route>

      {/* Rutas del Sistema */}
      <Route path="/login" element={<Login />} />
      
      {/* Rutas Protegidas (Requieren Sesión) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perfil" element={<Profile />} />
          
          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute allowedRoles={['admin', 'tecnico', 'acopio', 'procesamiento']} />}>
            <Route path="/socios" element={<ListaSocios />} />
            <Route path="/socios/nuevo" element={<RegistroSocio />} />
            <Route path="/socios/editar/:id" element={<EditarSocio />} />
            <Route path="/socios/ver/:id" element={<VerSocio />} />
            <Route path="/grupos" element={<GruposList />} />
            <Route path="/grupos/nuevo" element={<GrupoForm />} />
            <Route path="/grupos/editar/:id" element={<GrupoForm />} />
            <Route path="/fincas" element={<FincasList />} />
            <Route path="/fincas/nuevo" element={<FincaForm />} />
            <Route path="/fincas/editar/:id" element={<FincaForm />} />
            <Route path="/procesamiento/productos" element={<ProductosList />} />
            <Route path="/procesamiento/producto/nuevo" element={<ProductoForm />} />
            <Route path="/procesamiento/producto/editar/:id" element={<ProductoForm />} />
            <Route path="/procesamiento/ordenes" element={<OrdenesProcesamientoList />} />
            <Route path="/procesamiento/ordenes/nueva" element={<EjecutarOrdenForm />} />
            <Route path="/procesamiento/ordenes/:id" element={<OrdenProcesamientoDetalle />} />
            <Route path="/ventas" element={<VentasList />} />
            <Route path="/ventas/tienda" element={<TiendaList />} />
            <Route path="/ventas/nueva" element={<NuevaVentaForm />} />
            <Route path="/ventas/:id" element={<VentaDetalle />} />
            <Route path="/ventas/clientes" element={<ClientesList />} />
            <Route path="/ventas/clientes/nuevo" element={<ClienteForm />} />
            <Route path="/ventas/clientes/editar/:id" element={<ClienteForm />} />
            <Route path="/campo/visitas" element={<VisitasList />} />
            <Route path="/campo/visitas/nueva" element={<VisitaForm />} />
            <Route path="/campo/visitas/ejecutar/:id" element={<VisitaForm />} />
            <Route path="/proyectos" element={<ProyectosList />} />
            <Route path="/proyectos/nuevo" element={<ProyectoForm />} />
            <Route path="/proyectos/editar/:id" element={<ProyectoForm />} />
            <Route path="/capacitaciones" element={<CapacitacionesList />} />
            <Route path="/capacitaciones/:id/asistencia" element={<AsistenciaCapacitacion />} />
            <Route path="/acopio" element={<AcopiosList />} />
            <Route path="/acopio/nuevo" element={<AcopioForm />} />
            <Route path="/acopio/:id" element={<AcopioDetalle />} />
            <Route path="/acopio/:id/entrega" element={<RegistroEntrega />} />
            <Route path="/lotes" element={<LotesList />} />
            <Route path="/lotes/:id" element={<LoteDetalle />} />
            <Route path="/lotes/editar/:id" element={<EditarLote />} />
            <Route path="/insumos/:tipo" element={<InsumosList />} />
            <Route path="/insumos/:tipo/nuevo" element={<InsumoForm />} />
            <Route path="/insumos/entregas" element={<AsignarInsumo />} />
            <Route path="/pagos" element={<PagosList />} />
            <Route path="/pagos/liquidar/:id" element={<LiquidacionPago />} />
            <Route path="/inventario/equipos" element={<EquiposList />} />
            <Route path="/inventario/equipos/nuevo" element={<EquipoForm />} />
            <Route path="/inventario/equipos/editar/:id" element={<EquipoForm />} />
            <Route path="/compras" element={<ComprasList />} />
            <Route path="/compras/nueva" element={<NuevaCompraForm />} />
            <Route path="/compras/:id" element={<CompraDetalle />} />
          </Route>
        </Route>
      </Route>
    </Routes>
    </>
  );
}

export default App;
