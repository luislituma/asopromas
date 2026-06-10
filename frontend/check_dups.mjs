const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkc2FnaGtnemVqYXl6d2dhamJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDY4ODgsImV4cCI6MjA5NTkyMjg4OH0.vAEjm7x7vNx8_hCSuRVaN1ISqGCe_AjTCubOyVYh-6E';

async function main() {
  const url = "https://sdsaghkgzejayzwgajbt.supabase.co/rest/v1/fincas?select=socio_id,id";

  const res = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`
    }
  });
  const fincas = await res.json();
  
  if (fincas.error) {
    console.error(fincas);
    return;
  }

  const socioCounts = {};
  fincas.forEach(f => {
    socioCounts[f.socio_id] = (socioCounts[f.socio_id] || 0) + 1;
  });
  
  console.log("Fincas per socio ID:", JSON.stringify(socioCounts, null, 2));
}

main();
