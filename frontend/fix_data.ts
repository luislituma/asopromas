import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sdsaghkgzejayzwgajbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkc2FnaGtnemVqYXl6d2dhamJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDY4ODgsImV4cCI6MjA5NTkyMjg4OH0.vAEjm7x7vNx8_hCSuRVaN1ISqGCe_AjTCubOyVYh-6E';
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: dbDataList, error } = await supabase
    .from('directorio_temporal')
    .select('*')
    .limit(1);

  if (error || !dbDataList || dbDataList.length === 0) {
    console.error('Error fetching data:', error || 'No rows found');
    return;
  }
  const dbData = dbDataList[0];

  let rawHeaders = dbData.headers as string[];
  let parsedData = dbData.socios_data as any[];

  // 1. Merge "correo" into "EMAIL"
  const correoKeyIndex = rawHeaders.findIndex((h) => h.toLowerCase().includes('correo'));
  const emailKeyIndex = rawHeaders.findIndex((h) => h.toUpperCase() === 'EMAIL');

  let finalEmailKey = emailKeyIndex >= 0 ? rawHeaders[emailKeyIndex] : 'EMAIL';
  let correoKey = correoKeyIndex >= 0 ? rawHeaders[correoKeyIndex] : null;

  if (!rawHeaders.includes(finalEmailKey)) {
    rawHeaders.push(finalEmailKey);
  }

  parsedData.forEach((row) => {
    let emailVal = row[finalEmailKey]?.toString().trim() || '';

    if (correoKey && correoKey !== finalEmailKey) {
      const correoVal = row[correoKey]?.toString().trim() || '';
      if (correoVal) {
        if (!emailVal || emailVal === '-' || emailVal.toLowerCase() === 'n/a' || !emailVal.includes('@')) {
          emailVal = correoVal;
        }
      }
      delete row[correoKey];
    }

    if (emailVal) {
      emailVal = emailVal.toLowerCase().replace(/\s/g, '');
      if (!emailVal.includes('@') || !emailVal.includes('.')) {
        emailVal = '';
      }
    }

    row[finalEmailKey] = emailVal;
  });

  if (correoKey && correoKey !== finalEmailKey) {
    rawHeaders = rawHeaders.filter((h) => h !== correoKey);
  }

  // Ensure mandatory columns
  const newCols = ['EMAIL', 'BANCO', 'TIPO DE CUENTA', 'CUENTA'];
  newCols.forEach((col) => {
    if (!rawHeaders.find((h) => h.toUpperCase() === col)) {
      rawHeaders.push(col);
    }
  });

  // 2. Uppercase everything
  const upperHeaders = rawHeaders.map((h) => h.toUpperCase());
  const upperData = parsedData.map((row) => {
    const newRow: any = {};
    Object.keys(row).forEach((k) => {
      if (k) newRow[k.toUpperCase()] = row[k];
    });
    return newRow;
  });

  // Update DB
  const { error: updateError } = await supabase
    .from('directorio_temporal')
    .update({
      headers: upperHeaders,
      socios_data: upperData,
      updated_at: new Date().toISOString(),
    })
    .eq('id', dbData.id);

  if (updateError) {
    console.error('Error updating DB:', updateError);
  } else {
    console.log('Successfully updated the database!');
  }
}

run();
