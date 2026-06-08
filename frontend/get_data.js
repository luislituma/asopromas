import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sdsaghkgzejayzwgajbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkc2FnaGtnemVqYXl6d2dhamJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDY4ODgsImV4cCI6MjA5NTkyMjg4OH0.vAEjm7x7vNx8_hCSuRVaN1ISqGCe_AjTCubOyVYh-6E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('directorio_temporal')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    console.error(error);
  } else {
    console.log("Headers:", data.headers);
    console.log("First row:", data.socios_data[0]);
  }
}
run();
