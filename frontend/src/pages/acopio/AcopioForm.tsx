// @ts-nocheck
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, DollarSign, Users, User, FileText, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AcopioForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [grupos, setGrupos] = useState<any[]>([]);
  const [responsables, setResponsables] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    grupo_id: '',
    responsable_id: '',
    precio_dia_kg: '',
    ubicacion: '',
    notas: ''
  });

  useEffect(() => {
    async function loadSelectOptions() {
      try {
        // Cargar Grupos Base
        const { data: gruposData } = await supabase
          .from('grupos_base')
          .select('id, nombre')
          .eq('estado', 'activo')
          .order('nombre');
          
        if (gruposData) setGrupos(gruposData);

        // Cargar Responsables (Admins, Técnicos, Acopio)
        // Por ahora cargaremos todos los perfiles activos para simplificar
        const { data: perfilesData } = await supabase
          .from('perfiles')
          .select('id, nombre_completo, roles(nombre)')
          .eq('activo', true);
          
        if (perfilesData) {
          // Filtrar solo los roles permitidos
          const permitidos = perfilesData.filter(p => 
            ['admin', 'tecnico', 'acopio'].includes(p.roles?.nombre)
          );
          setResponsables(permitidos.length > 0 ? permitidos : perfilesData);
        }
      } catch (error) {
        console.error('Error cargando opciones:', error);
      }
    }
    
    loadSelectOptions();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('acopios')
        .insert([{
          fecha: formData.fecha,
          grupo_id: formData.grupo_id || null,
          responsable_id: formData.responsable_id,
          precio_dia_kg: parseFloat(formData.precio_dia_kg),
          ubicacion: formData.ubicacion,
          notas: formData.notas,
          estado: 'programado'
        }]);

      if (error) throw error;
      
      // Volver a la lista si hay éxito
      navigate('/acopio');
    } catch (error) {
      console.error('Error guardando acopio:', error);
      alert('Error al programar el acopio. Revisa la consola para más detalles.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6">
      <div className="max-w-3xl mx-auto">
        <Link to="/acopio" className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a Jornadas
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Programar Jornada de Acopio</h1>
          <p className="text-neutral-400 mt-1">Define la fecha, lugar y precio para la recolección de cacao.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 md:p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fecha */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-500" />
                Fecha Programada *
              </label>
              <input
                type="date"
                name="fecha"
                required
                value={formData.fecha}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Precio Base */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-amber-500" />
                Precio Base por Kg ($) *
              </label>
              <input
                type="number"
                name="precio_dia_kg"
                required
                step="0.01"
                min="0"
                placeholder="Ej: 3.50"
                value={formData.precio_dia_kg}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Grupo Base */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-500" />
                Grupo Base (Opcional)
              </label>
              <select
                name="grupo_id"
                value={formData.grupo_id}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              >
                <option value="">-- Seleccionar Grupo --</option>
                {grupos.map(g => (
                  <option key={g.id} value={g.id}>{g.nombre}</option>
                ))}
              </select>
            </div>

            {/* Responsable */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <User className="h-4 w-4 text-amber-500" />
                Responsable del Acopio *
              </label>
              <select
                name="responsable_id"
                required
                value={formData.responsable_id}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              >
                <option value="">-- Seleccionar Responsable --</option>
                {responsables.map(r => (
                  <option key={r.id} value={r.id}>{r.nombre_completo}</option>
                ))}
              </select>
            </div>

            {/* Ubicación */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-amber-500" />
                Lugar de Recolección
              </label>
              <input
                type="text"
                name="ubicacion"
                placeholder="Ej: Centro de acopio Zumbi, o Finca de Juan Pérez"
                value={formData.ubicacion}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              />
            </div>

            {/* Notas */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-500" />
                Observaciones adicionales
              </label>
              <textarea
                name="notas"
                rows={3}
                placeholder="Detalles sobre el transporte, clima u observaciones particulares..."
                value={formData.notas}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
              ></textarea>
            </div>
          </div>

          <div className="pt-6 border-t border-neutral-700 flex justify-end gap-4">
            <Link 
              to="/acopio"
              className="px-6 py-2.5 rounded-lg font-medium text-neutral-300 hover:text-white hover:bg-neutral-700 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Guardar Jornada
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
