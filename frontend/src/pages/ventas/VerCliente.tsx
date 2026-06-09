import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, User, Mail, Phone, MapPin, Building2, Printer, Edit, Briefcase, Hash } from 'lucide-react';

export default function VerCliente() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [cliente, setCliente] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('clientes')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setCliente(data);
      } catch (error) {
        console.error('Error fetching cliente details:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-center text-white">Cargando datos del cliente...</div>;
  }

  if (!cliente) {
    return <div className="p-10 text-center text-white">No se encontró la información del cliente.</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-neutral-900 print:bg-white text-white print:text-black">
      <main className="max-w-4xl mx-auto p-6 print:p-0">
        
        {/* Print Header (Solo visible al imprimir) */}
        <div className="hidden print:block mb-8 text-center border-b border-gray-300 pb-4">
          <div className="flex justify-center mb-4">
            <img src="/logo-asopromas.svg" alt="Logo ASOPROMAS" className="h-16 w-auto grayscale" 
                 onError={(e) => { e.currentTarget.src = "/Logo-Asopromas-Completo.jpg"; }} />
          </div>
          <h1 className="text-2xl font-bold uppercase mb-2">Ficha de Cliente</h1>
          <p className="text-gray-600">Asociación de Productores ASOPROMAS</p>
        </div>

        {/* Encabezado con Botones de Acción */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <div className="flex items-center gap-4">
            <Link to="/ventas/clientes" className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold">Perfil del Cliente</h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-neutral-800 text-white px-4 py-2 rounded-md font-medium border border-neutral-700 hover:bg-neutral-700 transition-colors"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </button>
            <Link 
              to={`/ventas/clientes/editar/${cliente.id}?returnTo=ver`}
              className="flex items-center gap-2 bg-amber-500 text-black px-4 py-2 rounded-md font-medium hover:bg-amber-600 transition-colors"
            >
              <Edit className="h-4 w-4" />
              Editar Perfil
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Columna Izquierda: Tarjeta Principal */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-neutral-800 print:bg-transparent rounded-xl border border-neutral-700 print:border-gray-300 p-6 text-center">
              <div className="h-24 w-24 bg-amber-500 rounded-full mx-auto flex items-center justify-center mb-4 print:hidden">
                <Building2 className="h-12 w-12 text-black" />
              </div>
              <h2 className="text-2xl font-bold">{cliente.nombre_razon_social}</h2>
              <p className="text-amber-500 font-medium mt-1 uppercase tracking-wider text-sm">
                {cliente.tipo_cliente}
              </p>
              
              <div className="mt-4 pt-4 border-t border-neutral-700 print:border-gray-300 text-left">
                <p className="text-sm text-neutral-400 print:text-gray-500 mb-1">Identificación / RUC</p>
                <p className="font-medium flex items-center gap-2">
                  <Hash className="h-4 w-4 text-neutral-500 print:hidden" />
                  {cliente.identificacion || 'N/A'}
                </p>
              </div>
            </div>

            {/* Info de Contacto */}
            <div className="bg-neutral-800 print:bg-transparent rounded-xl border border-neutral-700 print:border-gray-300 p-6">
              <h3 className="font-bold text-lg mb-4">Contacto Principal</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <User className="h-5 w-5 text-neutral-400 mt-0.5 print:hidden" />
                  <div>
                    <p className="text-sm text-neutral-400 print:text-gray-500">Persona de Contacto</p>
                    <p className="font-medium">{cliente.contacto_principal || 'No registrado'}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-neutral-400 mt-0.5 print:hidden" />
                  <div>
                    <p className="text-sm text-neutral-400 print:text-gray-500">Teléfono</p>
                    <p className="font-medium">{cliente.telefono || 'No registrado'}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-neutral-400 mt-0.5 print:hidden" />
                  <div>
                    <p className="text-sm text-neutral-400 print:text-gray-500">Correo Electrónico</p>
                    <p className="break-all font-medium">{cliente.email || 'No registrado'}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Columna Derecha: Detalles Adicionales */}
          <div className="md:col-span-2 space-y-6">
            
            <div className="bg-neutral-800 print:bg-transparent rounded-xl border border-neutral-700 print:border-gray-300 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-emerald-500 print:hidden" />
                Dirección
              </h3>
              <div className="p-4 bg-neutral-900 print:bg-gray-50 rounded-lg border border-neutral-800 print:border-gray-200">
                <p className="leading-relaxed">
                  {cliente.direccion || 'Dirección no registrada.'}
                </p>
              </div>
            </div>

            <div className="bg-neutral-800 print:bg-transparent rounded-xl border border-neutral-700 print:border-gray-300 p-6">
               <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-amber-500 print:hidden" />
                Datos Administrativos
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <p className="text-sm text-neutral-400 print:text-gray-500">Estado</p>
                  <span className={`inline-block mt-1 px-2.5 py-1 rounded-full text-xs font-medium uppercase tracking-wider print:border print:bg-transparent ${
                    cliente.estado === 'activo' ? 'bg-emerald-500/20 text-emerald-400 print:text-emerald-700 print:border-emerald-500' : 'bg-red-500/20 text-red-400 print:text-red-700 print:border-red-500'
                  }`}>
                    {cliente.estado}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-neutral-400 print:text-gray-500">Fecha de Registro</p>
                  <p className="font-medium mt-1">
                    {new Date(cliente.created_at).toLocaleDateString('es-EC', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-neutral-400 print:text-gray-500">Última Actualización</p>
                  <p className="font-medium mt-1">
                    {new Date(cliente.updated_at).toLocaleDateString('es-EC', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
