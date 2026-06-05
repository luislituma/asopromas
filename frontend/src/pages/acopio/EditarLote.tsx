import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function EditarLote() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    codigo: '',
    estado: 'abierto',
    notas: ''
  });

  useEffect(() => {
    async function loadLote() {
      if (!id) return;
      try {
        const { data, error } = await supabase.from('lotes').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) {
          setFormData({
            codigo: data.codigo_lote || '',
            estado: data.estado || 'abierto',
            notas: data.notas || ''
          });
        }
      } catch (err) {
        setError('No se pudo cargar la información del lote.');
      } finally {
        setFetching(false);
      }
    }
    loadLote();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: updateError } = await supabase
        .from('lotes')
        .update({
          codigo_lote: formData.codigo,
          estado: formData.estado,
          notas: formData.notas || null
        })
        .eq('id', id);

      if (updateError) throw updateError;

      setSuccess(true);
      setTimeout(() => navigate('/lotes'), 1500);
      
    } catch (err: any) {
      console.error(err);
      if (err.code === '23505') {
        setError('Ya existe otro lote registrado con ese código.');
      } else {
        setError(err.message || 'Error al actualizar el lote.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="p-10 text-center text-white">Cargando datos...</div>;

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <main className="max-w-xl mx-auto p-6">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/lotes" className="p-2 bg-neutral-800 rounded-full hover:bg-neutral-700 transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">Editar Lote</h1>
        </div>

        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 md:p-8">
          
          {error && (
            <div className="mb-6 bg-red-900/50 border border-red-500 rounded-md p-4 flex">
              <AlertCircle className="h-5 w-5 text-red-400 shrink-0" />
              <p className="ml-3 text-sm text-red-300">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-900/50 border border-green-500 rounded-md p-4 flex">
              <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
              <p className="ml-3 text-sm text-green-300">Lote actualizado correctamente.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Código del Lote *</label>
              <input required type="text" name="codigo" value={formData.codigo} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <p className="text-xs text-neutral-500 mt-1">Cuidado al cambiar códigos de lotes en uso.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Estado</label>
              <select name="estado" value={formData.estado} onChange={handleChange} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="abierto">Abierto (Recibiendo entregas)</option>
                <option value="cerrado">Cerrado (Completo)</option>
                <option value="procesado">Procesado (Fermentado/Secado)</option>
                <option value="exportado">Exportado / Vendido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Notas Adicionales</label>
              <textarea name="notas" value={formData.notas} onChange={handleChange} rows={3} className="w-full bg-neutral-700 border border-neutral-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div className="flex justify-end pt-4 border-t border-neutral-700">
              <button type="button" onClick={() => navigate('/lotes')} className="px-6 py-2 border border-neutral-600 text-neutral-300 rounded-md hover:bg-neutral-700 transition-colors mr-4">
                Cancelar
              </button>
              <button type="submit" disabled={loading} className="flex items-center gap-2 px-6 py-2 bg-amber-500 text-black font-medium rounded-md hover:bg-amber-600 transition-colors disabled:opacity-50">
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Save className="h-5 w-5" />}
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
