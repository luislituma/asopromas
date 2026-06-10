import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sdsaghkgzejayzwgajbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkc2FnaGtnemVqYXl6d2dhamJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDY4ODgsImV4cCI6MjA5NTkyMjg4OH0.vAEjm7x7vNx8_hCSuRVaN1ISqGCe_AjTCubOyVYh-6E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: lotes, error } = await supabase.from('lotes_finca').select('*').limit(1);
  if (error) {
    console.error(error);
  } else if (lotes && lotes.length > 0) {
    console.log(Object.keys(lotes[0]));
  }
}

main();
