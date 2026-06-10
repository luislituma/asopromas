import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

dotenv.config({ path: resolve(__dirname, '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: socios, error } = await supabase
    .from('socios')
    .select(`
      id,
      nombres,
      apellidos,
      fincas (
        id,
        nombre,
        lotes_finca (
          id,
          nombre_lote
        )
      )
    `)
    .ilike('nombres', '%Carlos Gabriel%');

  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(socios, null, 2));
  }
}

main();
