import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sdsaghkgzejayzwgajbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkc2FnaGtnemVqYXl6d2dhamJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDY4ODgsImV4cCI6MjA5NTkyMjg4OH0.vAEjm7x7vNx8_hCSuRVaN1ISqGCe_AjTCubOyVYh-6E';
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  console.log('Obteniendo datos de Supabase...');
  
  // 1. Obtener socios con código
  const { data: socios, error: e1 } = await supabase.from('socios').select('id, codigo_socio');
  if (e1) return console.error(e1);

  // 2. Obtener fincas
  const { data: fincas, error: e2 } = await supabase.from('fincas').select('id, socio_id');
  if (e2) return console.error(e2);

  // 3. Obtener lotes
  const { data: lotes, error: e3 } = await supabase.from('lotes_finca').select('id, nombre_lote, finca_id').order('created_at', { ascending: true });
  if (e3) return console.error(e3);

  const updates = [];
  let sociosAfectados = 0;

  for (const socio of socios) {
    if (!socio.codigo_socio) continue;
    
    const fincasIds = fincas.filter(f => f.socio_id === socio.id).map(f => f.id);
    const lotesDelSocio = lotes.filter(l => fincasIds.includes(l.finca_id));
    
    if (lotesDelSocio.length > 0) {
      sociosAfectados++;
      let contador = 1;
      
      for (const lote of lotesDelSocio) {
        const sufijo = contador.toString().padStart(2, '0');
        const nuevoNombre = `${socio.codigo_socio}-${sufijo}`;
        
        if (lote.nombre_lote !== nuevoNombre) {
          updates.push({
            id: lote.id,
            viejo: lote.nombre_lote,
            nuevo: nuevoNombre
          });
        }
        contador++;
      }
    }
  }

  console.log(`\nResumen del Análisis:`);
  console.log(`- Socios con lotes: ${sociosAfectados}`);
  console.log(`- Lotes totales analizados: ${lotes.length}`);
  console.log(`- Lotes que necesitan actualización: ${updates.length}`);
  
  if (updates.length > 0) {
    console.log('\nEjemplos de cambios que se harían:');
    updates.slice(0, 5).forEach(u => {
      console.log(`  "${u.viejo || 'Vacio'}" ---> "${u.nuevo}"`);
    });
    console.log('  ...');
  }
}

main();
