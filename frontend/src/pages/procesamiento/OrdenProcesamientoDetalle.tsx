import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Loader2, Factory, PackageOpen, CheckCircle2, Clock, Calendar, Printer } from 'lucide-react';
import { PrintHeader } from '../../components/ui/PrintHeader';
import { SignatureBox } from '../../components/ui/SignatureBox';

export default function OrdenProcesamientoDetalle() {
  const { id } = useParams();
  const [orden, setOrden] = useState<any>(null);
  const [ingredientesUsados, setIngredientesUsados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrden();
  }, [id]);

  const fetchOrden = async () => {
    try {
      // 1. Fetch orden details
      const { data: o, error } = await supabase
        .from('ordenes_procesamiento')
        .select(`
          *,
          recetas ( 
            nombre_receta, 
            productos_catalogo ( nombre, unidad_medida ) 
          ),
          lotes ( codigo_lote ),
          perfiles ( nombre_completo )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      setOrden(o);

      // 2. Fetch receta ingredientes to calculate what was actually used
      if (o?.receta_id) {
        const { data: ings } = await supabase
          .from('receta_ingredientes')
          .select('*, insumos(nombre, unidad_medida)')
          .eq('receta_id', o.receta_id);
          
        if (ings) setIngredientesUsados(ings);
      }
    } catch (error) {
      console.error('Error fetching orden:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-10 text-center text-white flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-amber-500" /></div>;
  if (!orden) return <div className="p-10 text-center text-white">Orden no encontrada.</div>;

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6 no-print">
          <Link to="/procesamiento/ordenes" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Volver a Órdenes
          </Link>
          <button 
            onClick={() => window.print()} 
            className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Printer className="h-4 w-4" /> Imprimir Reporte
          </button>
        </div>

        <PrintHeader 
          title="Reporte de Orden de Producción" 
          subtitle={`Orden Nº ${orden.codigo_orden}`} 
        />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Factory className="h-8 w-8 text-amber-500" />
              Orden {orden.codigo_orden}
            </h1>
            <p className="text-neutral-400 mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Creada el {new Date(orden.fecha).toLocaleDateString()}
            </p>
          </div>
          <div>
            {orden.estado === 'en_proceso' ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-full font-bold border border-amber-500/30">
                <Clock className="h-5 w-5" /> EN PROCESO
              </span>
            ) : orden.estado === 'finalizado' ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-full font-bold border border-emerald-500/30">
                <CheckCircle2 className="h-5 w-5" /> FINALIZADO
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-500/10 text-neutral-400 rounded-full font-bold border border-neutral-500/30 uppercase">
                {orden.estado}
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-neutral-400 mb-1">Producto Elaborado</h3>
            <p className="text-xl font-bold text-white mb-4">{orden.recetas?.productos_catalogo?.nombre}</p>
            
            <h3 className="text-sm font-medium text-neutral-400 mb-1">Receta Usada</h3>
            <p className="text-lg text-white mb-4">{orden.recetas?.nombre_receta}</p>
            
            <h3 className="text-sm font-medium text-neutral-400 mb-1">Cantidad Producida</h3>
            <p className="text-2xl font-bold text-amber-500">
              {orden.cantidad_a_producir} <span className="text-base text-amber-500/70">{orden.recetas?.productos_catalogo?.unidad_medida}</span>
            </p>
          </div>

          <div className="bg-neutral-800 border border-neutral-700 rounded-xl p-6">
            <h3 className="text-sm font-medium text-neutral-400 mb-1">Lote Origen (Trazabilidad)</h3>
            <p className="text-xl font-bold text-emerald-400 mb-4">{orden.lotes?.codigo_lote}</p>
            
            <h3 className="text-sm font-medium text-neutral-400 mb-1">Responsable</h3>
            <p className="text-lg text-white mb-4">{orden.perfiles?.nombre_completo || 'No especificado'}</p>
            
            <h3 className="text-sm font-medium text-neutral-400 mb-1">Notas Internas</h3>
            <p className="text-neutral-300">{orden.notas || 'Sin notas.'}</p>
          </div>
        </div>

        <div className="bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-neutral-700">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <PackageOpen className="h-5 w-5 text-amber-500" /> Materiales e Insumos Consumidos
            </h2>
            <p className="text-sm text-neutral-400 mt-1">
              Desglose de los ingredientes utilizados multiplicados por la cantidad producida.
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {ingredientesUsados.map((ing) => {
                const cantTotal = parseFloat(orden.cantidad_a_producir) * ing.cantidad_requerida;
                return (
                  <div key={ing.id} className="flex justify-between items-center bg-neutral-900/50 p-4 rounded-lg border border-neutral-700/50">
                    <div>
                      <p className="font-medium text-white">
                        {ing.tipo_ingrediente === 'cacao_grano' ? 'Cacao en Grano (Del Lote)' : ing.insumos?.nombre}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Según receta: {ing.cantidad_requerida} {ing.tipo_ingrediente === 'cacao_grano' ? 'kg' : ing.insumos?.unidad_medida} por unidad
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-xl text-white">
                        {cantTotal.toFixed(2)} 
                      </span>
                      <span className="text-neutral-400 ml-1">
                        {ing.tipo_ingrediente === 'cacao_grano' ? 'kg' : ing.insumos?.unidad_medida}
                      </span>
                    </div>
                  </div>
                );
              })}
              
              {ingredientesUsados.length === 0 && (
                <div className="text-center py-6 text-neutral-500">
                  Esta receta no tiene ingredientes registrados.
                </div>
              )}
            </div>
          </div>
        </div>

        <SignatureBox 
          signatures={[
            { role: 'Operador / Producción', name: orden.perfiles?.nombre_completo },
            { role: 'Control de Calidad / Administradora' },
            { role: 'Contabilidad' }
          ]} 
        />
      </div>
    </div>
  );
}
