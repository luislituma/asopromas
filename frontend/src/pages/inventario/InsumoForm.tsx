// @ts-nocheck
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Package, ArrowLeft, Save, Loader2, Tag, DollarSign, List, Archive } from 'lucide-react';

export default function InsumoForm() {
  const navigate = useNavigate();
  const { tipo } = useParams(); // 'agricolas' o 'industriales'
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: tipo === 'industriales' ? 'ingrediente' : 'fertilizante',
    precio_unitario: '',
    stock_disponible: '',
    unidad_medida: 'saco'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('insumos')
        .insert([{
          codigo: formData.codigo || null,
          nombre: formData.nombre,
          descripcion: formData.descripcion || null,
          categoria: formData.categoria,
          precio_unitario: parseFloat(formData.precio_unitario),
          stock_disponible: parseFloat(formData.stock_disponible),
          unidad_medida: formData.unidad_medida
        }]);

      if (error) throw error;
      navigate(`/insumos/${tipo || 'agricolas'}`);
    } catch (error) {
      console.error('Error guardando insumo:', error);
      alert('Error al guardar. Revisa la consola.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 p-6 text-white">
      <div className="max-w-2xl mx-auto">
        <Link to={`/insumos/${tipo || 'agricolas'}`} className="inline-flex items-center gap-2 text-neutral-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Volver a Inventario
        </Link>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Registrar Nuevo Insumo {tipo === 'agricolas' ? 'Agrícola' : tipo === 'industriales' ? 'Industrial' : ''}</h1>
          <p className="text-neutral-400 mt-1">Añade {tipo === 'industriales' ? 'ingredientes y empaques' : 'fertilizantes, herramientas o químicos'} al inventario.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-neutral-800 border border-neutral-700 rounded-xl p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-amber-500" />
                Nombre del Producto *
              </label>
              <input
                required
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Abono Orgánico Bio-Cacao, Tijera Podadora 8''"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2 mb-2">
                <List className="h-4 w-4 text-amber-500" />
                Categoría *
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
              >
                {tipo === 'agricolas' && (
                  <>
                    <option value="fertilizante">Fertilizante</option>
                    <option value="herramienta">Herramienta</option>
                    <option value="semilla">Semilla</option>
                    <option value="quimico">Químico / Pesticida</option>
                  </>
                )}
                {tipo === 'industriales' && (
                  <>
                    <option value="ingrediente">Ingrediente</option>
                    <option value="empaque">Empaque</option>
                  </>
                )}
                {(!tipo) && (
                  <>
                    <option value="fertilizante">Fertilizante</option>
                    <option value="herramienta">Herramienta</option>
                    <option value="semilla">Semilla</option>
                    <option value="quimico">Químico / Pesticida</option>
                    <option value="ingrediente">Ingrediente</option>
                    <option value="empaque">Empaque</option>
                  </>
                )}
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2 mb-2">
                <Archive className="h-4 w-4 text-amber-500" />
                Código SKU (Opcional)
              </label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                placeholder="Ej. FERT-001"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-emerald-500" />
                Precio Unitario ($) *
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                name="precio_unitario"
                value={formData.precio_unitario}
                onChange={handleChange}
                placeholder="Ej. 25.50"
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-2 block">Stock *</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  name="stock_disponible"
                  value={formData.stock_disponible}
                  onChange={handleChange}
                  placeholder="Ej. 100"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-300 mb-2 block">U. Medida</label>
                <select
                  name="unidad_medida"
                  value={formData.unidad_medida}
                  onChange={handleChange}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
                >
                  <option value="unidad">Unidad</option>
                  <option value="saco">Saco</option>
                  <option value="litro">Litro</option>
                  <option value="kg">Kg</option>
                  <option value="kit">Kit</option>
                </select>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium text-neutral-300 block mb-2">
                Descripción (Opcional)
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows={3}
                placeholder="Detalles del producto, fabricante, composición..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:border-amber-500 focus:outline-none"
              ></textarea>
            </div>

          </div>

          <div className="pt-6 border-t border-neutral-700 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-amber-500 text-black font-medium rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Guardar Insumo
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
