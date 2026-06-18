import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase
    .from('entregas_acopio')
    .select(`
      *,
      socios (id, nombres, apellidos, cedula, email),
      entregas_lotes_origen (finca_id, lote_finca_id)
    `)
    .eq('id', 'b0dbe4a8-b409-4a20-bbaf-6ca0e8e49b5e')
    .single();
    
  console.log("Data:", JSON.stringify(data, null, 2));
  console.log("Error:", error);
}
check();
