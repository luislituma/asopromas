import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log("Checking entregas_lotes_origen...");
  const { data, error } = await supabase.from('entregas_lotes_origen').select('*').limit(5);
  if (error) {
    console.error("Error reading:", error);
  } else {
    console.log("Data:", data);
  }
}
check();
