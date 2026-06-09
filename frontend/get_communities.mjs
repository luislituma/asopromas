import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sdsaghkgzejayzwgajbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkc2FnaGtnemVqYXl6d2dhamJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDY4ODgsImV4cCI6MjA5NTkyMjg4OH0.vAEjm7x7vNx8_hCSuRVaN1ISqGCe_AjTCubOyVYh-6E';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getCommunities() {
  const { data, error } = await supabase
    .from('directorio_temporal')
    .select('socios_data')
    .eq('id', 1)
    .single();

  if (error) {
    console.error('Error fetching data:', error);
    return;
  }

  const socios = data.socios_data || [];
  const communities = new Set();
  
  socios.forEach(socio => {
    // Find community key
    const comKey = Object.keys(socio).find(k => k.toUpperCase().includes('COMUNIDAD'));
    if (comKey && socio[comKey]) {
      const com = socio[comKey].toString().trim();
      if (com.length > 0) communities.add(com);
    }
  });

  const uniqueComs = Array.from(communities);
  const command = `mkdir ${uniqueComs.map(c => `"${c}"`).join(' ')}`;
  console.log("Comando resultante:\n");
  console.log(command);
}

getCommunities();
