import fs from 'fs';

const url = "https://sdsaghkgzejayzwgajbt.supabase.co/rest/v1/socios?select=id,nombres,apellidos,fincas(id,nombre,lotes_finca(id))&nombres=ilike.*Carlos*";

fetch(url, {
  headers: {
    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkc2FnaGtnemVqYXl6d2dhamJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDY4ODgsImV4cCI6MjA5NTkyMjg4OH0.vAEjm7x7vNx8_hCSuRVaN1ISqGCe_AjTCubOyVYh-6E",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkc2FnaGtnemVqYXl6d2dhamJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDY4ODgsImV4cCI6MjA5NTkyMjg4OH0.vAEjm7x7vNx8_hCSuRVaN1ISqGCe_AjTCubOyVYh-6E"
  }
})
.then(r => r.json())
.then(data => {
  if(data.error) {
    console.error(data.error);
    return;
  }
  
  if(!data || !data.length) {
    console.log("Empty or no access");
    return;
  }
  
  data.forEach(s => {
    let numLotes = 0;
    if(s.fincas) {
      s.fincas.forEach(f => {
        if(f.lotes_finca) {
          numLotes += f.lotes_finca.length;
        }
      });
    }
    console.log(`${s.nombres} ${s.apellidos}: ${s.fincas ? s.fincas.length : 0} fincas, ${numLotes} lotes`);
  });
})
.catch(console.error);
