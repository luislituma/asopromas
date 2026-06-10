// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { Upload, Download, Search, Plus, Trash2, Save, X, FileText, LogIn, Loader2, LogOut, Settings, ExternalLink, Edit2, MapPin, Database } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import SocioLotesModal from './SocioLotesModal';

export default function SociosDirectorio() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
  const [filterProvincia, setFilterProvincia] = useState('');
  const [filterCanton, setFilterCanton] = useState('');
  const [filterComunidad, setFilterComunidad] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Modal Edit/Add
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  // Modal Fields
  const [isFieldsModalOpen, setIsFieldsModalOpen] = useState(false);
  const [newFieldInput, setNewFieldInput] = useState('');
  const [editingColumn, setEditingColumn] = useState<string | null>(null);
  const [newColumnName, setNewColumnName] = useState('');

  // Modal PDF
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedPdfFields, setSelectedPdfFields] = useState<string[]>([]);

  // Modal Lotes
  const [isLotesModalOpen, setIsLotesModalOpen] = useState(false);

  // Double buffering for PDF to prevent flickering
  const [previewUrls, setPreviewUrls] = useState({ a: null as string | null, b: null as string | null });
  const [activeFrame, setActiveFrame] = useState<'a' | 'b'>('a');
  const frameRef = useRef<'a' | 'b'>('a');

  // Table Interactivity (Scroll & Column Drag)
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDraggingScroll, setIsDraggingScroll] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [draggedCol, setDraggedCol] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const [isMigrating, setIsMigrating] = useState(false);

  const migrateToSupabase = async () => {
    if (!window.confirm('¿Seguro que deseas migrar todos estos datos a las tablas oficiales de Supabase? Asegúrate de haber ejecutado el SQL de limpieza antes.')) return;
    setIsMigrating(true);
    
    try {
      const gruposCache: Record<string, string> = {}; 
      const sociosCache: Record<string, string> = {}; // cedula -> socioId
      
      let successCount = 0;
      let errorCount = 0;
      let errorDetails: string[] = [];

      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        try {
        const comunidadRaw = (row['COMUNIDAD'] || '').toString().trim();
        let grupoId = null;
        
        if (comunidadRaw) {
          if (gruposCache[comunidadRaw]) {
            grupoId = gruposCache[comunidadRaw];
          } else {
             const { data: gData } = await supabase.from('grupos_base').select('id').ilike('comunidad', comunidadRaw).limit(1).maybeSingle();
             if (gData) {
               grupoId = gData.id;
             } else {
               const { data: newG, error: errG } = await supabase.from('grupos_base').insert([{
                 nombre: comunidadRaw,
                 comunidad: comunidadRaw,
                 parroquia: row['PARROQUIA']?.toString().trim() || null,
                 canton: row['CANTON']?.toString().trim() || row['CANTÓN']?.toString().trim() || null,
                 provincia: row['PROVINCIA']?.toString().trim() || null
               }]).select().single();
               
               if (errG) {
                 throw new Error("Error creando Grupo Base: " + errG.message + " Detalles: " + errG.details);
               }
               if (newG) grupoId = newG.id;
             }
             if (grupoId) gruposCache[comunidadRaw] = grupoId;
          }
        }
        
        // Extraer nombres primero para poder usarlos como llave de caché secundaria
        const nombresStr = row['NOMBRES']?.toString().trim() || '-';
        const apellidosStr = row['APELLIDOS']?.toString().trim() || '-';
        const fullNameKey = (nombresStr + " " + apellidosStr).toUpperCase();

        // El código puede estar vacío y la bd acepta nulos, pero "cedula" era requerido en BD
        let ced = row['CÉDULA']?.toString().trim() || row['CEDULA']?.toString().trim() || row['IDENTIFICACION']?.toString().trim() || null;
        if (ced) {
          // Si es una cédula de relleno como "S/N", "0", "NA", "_", la tratamos como nula
          const fakeCedulas = ['S/N', 'SN', '0', 'N/A', 'NA', 'NO TIENE', 'NINGUNO', '-', '_'];
          if (fakeCedulas.includes(ced.toUpperCase())) ced = null;
        }

        let generoVal = row['GÉNERO']?.toString().trim() || row['GENERO']?.toString().trim() || null;
        if (generoVal) {
          const gLower = generoVal.toLowerCase();
          if (gLower.includes('masc')) generoVal = 'Masculino';
          else if (gLower.includes('fem')) generoVal = 'Femenino';
          else if (gLower.includes('otr')) generoVal = 'Otro';
          else if (gLower.includes('pref')) generoVal = 'Prefiero no decirlo';
          else generoVal = 'Otro'; 
        }

        let cod = row['CÓDIGO']?.toString().trim() || row['CODIGO']?.toString().trim() || null;
        if (cod) {
          const fakeCodigos = ['S/N', 'SN', '0', 'N/A', 'NA', 'NO TIENE', 'NINGUNO', '-', '_'];
          if (fakeCodigos.includes(cod.toUpperCase())) cod = null;
        }
        
        let socioId = (ced && sociosCache[ced]) || (cod && sociosCache[cod]) || sociosCache[fullNameKey];

        if (!socioId) {
          // Revisamos en la base de datos oficial si este socio ya existe
          let query = supabase.from('socios').select('id');
          if (ced && cod) {
            query = query.or(`cedula.eq.${ced},codigo_socio.eq.${cod}`);
          } else if (ced) {
            query = query.eq('cedula', ced);
          } else if (cod) {
            query = query.eq('codigo_socio', cod);
          } else {
            // Buscamos por nombre si no hay cédula ni código (para no crear duplicados)
            query = query.eq('nombres', nombresStr).eq('apellidos', apellidosStr);
          }
          
          const { data: existingSocio } = await query.limit(1).maybeSingle();
          
          if (existingSocio && existingSocio.id) {
             socioId = existingSocio.id;
             if (ced) sociosCache[ced] = socioId;
             if (cod) sociosCache[cod] = socioId;
             sociosCache[fullNameKey] = socioId;
          } else {
             // Generar cédula aleatoria SOLO si no se encontró en la BD
             if (!ced) ced = "S/N-" + Math.floor(Math.random() * 1000000);

             const { data: newSocio, error: errS } = await supabase.from('socios').insert([{
               codigo_socio: cod,
               cedula: ced,
               nombres: nombresStr,
               apellidos: apellidosStr,
               telefono: row['TELÉFONO']?.toString().trim() || row['TELEFONO']?.toString().trim() || null,
               email: row['EMAIL']?.toString().trim() || null,
               direccion: null,
               genero: generoVal,
               banco_nombre: row['BANCO']?.toString().trim() || null,
               banco_cuenta: row['CUENTA']?.toString().trim() || null,
               grupo_id: grupoId
             }]).select().single();
             
             if (errS) {
                throw new Error("Error creando Socio (" + nombresStr + " " + apellidosStr + "): " + errS.message + " Detalles: " + errS.details);
             }
             if (newSocio) {
               socioId = newSocio.id;
               if (ced) sociosCache[ced] = socioId;
               if (cod) sociosCache[cod] = socioId;
               sociosCache[fullNameKey] = socioId;
             }
          }
        }
        
        if (socioId) {
           const fincaNombre = row['FINCA']?.toString().trim() || row['NOMBRE DE LA FINCA']?.toString().trim() || 'Finca Principal';
           
           let hasTotal = 0;
           let hasCacao = 0;
           let hasBosque = 0;
           
           Object.keys(row).forEach(k => {
             const keyName = k.toUpperCase().trim();
             if (keyName.includes('HAS') && keyName.includes('FINCA') && !keyName.includes('CACAO')) {
               hasTotal = parseFloat(row[k] || '0');
             } else if (keyName.includes('HAS') && keyName.includes('CACAO')) {
               hasCacao = parseFloat(row[k] || '0');
             } else if (keyName.includes('HAS') && keyName.includes('BOSQUE')) {
               hasBosque = parseFloat(row[k] || '0');
             } else if (keyName === 'HAS. TOTAL') {
               if (hasTotal === 0) hasTotal = parseFloat(row[k] || '0');
             }
           });
           
           // Limpieza de coordenadas para evitar NaN por comas
           const cleanNum = (val: any) => {
             if (!val) return 0;
             const str = val.toString().replace(/,/g, '').trim();
             return parseFloat(str) || 0;
           };

           const x = cleanNum(row['COORDENADA X'] || row['X']);
           const y = cleanNum(row['COORDENADA Y'] || row['Y']);
           const z = cleanNum(row['COORDENADA Z'] || row['Z']);
           
           if (fincaNombre) {
             // 1. Verificamos si la finca ya existe para este socio (idempotencia)
             let { data: existingFinca } = await supabase.from('fincas')
                .select('id')
                .eq('socio_id', socioId)
                .eq('nombre', fincaNombre)
                .limit(1)
                .maybeSingle();
                
             let fincaId = existingFinca?.id;

             // 2. Si no existe, la creamos
             if (!fincaId) {
               const { data: newFinca } = await supabase.from('fincas').insert([{
                 socio_id: socioId,
                 nombre: fincaNombre,
                 hectareas_totales: !isNaN(hasTotal) && hasTotal !== 0 ? hasTotal : null,
                 hectareas_cacao: !isNaN(hasCacao) && hasCacao !== 0 ? hasCacao : null,
                 hectareas_bosque: !isNaN(hasBosque) && hasBosque !== 0 ? hasBosque : null
               }]).select().single();
               
               if (newFinca) fincaId = newFinca.id;
             }
             
             // 3. Verificamos y creamos el Lote si hay coordenadas
             if (fincaId && (x !== 0 || y !== 0)) {
               // Idempotencia para el lote
               let { data: existingLote } = await supabase.from('lotes_finca')
                 .select('id')
                 .eq('finca_id', fincaId)
                 .eq('coord_x', x)
                 .eq('coord_y', y)
                 .limit(1)
                 .maybeSingle();

               if (!existingLote) {
                 const { error: errLote } = await supabase.from('lotes_finca').insert([{
                   finca_id: fincaId,
                   nombre_lote: 'Lote Principal',
                   coord_x: x,
                   coord_y: y,
                   coord_z: z !== 0 ? z : null
                 }]);
                 if (errLote) {
                   throw new Error("Error creando Lote para finca " + fincaNombre + ": " + errLote.message + " Detalles: " + errLote.details);
                 }
               }
             }
           }
        }
          successCount++;
        } catch (innerError: any) {
          console.error(`Fila ${i + 1} falló:`, innerError);
          errorCount++;
          errorDetails.push(`Fila ${i + 1}: ${innerError.message}`);
        }
      }
      
      if (errorCount > 0) {
        alert(`¡Migración finalizada con ${errorCount} errores!\nSe migraron ${successCount} filas exitosamente.\n\nRevisa la consola para más detalles.`);
        console.error("ERRORES DETALLADOS:", errorDetails);
      } else {
        alert(`¡Migración Completada Perfectamente! (${successCount} filas)`);
      }
      
    } catch (e: any) {
      alert("Error en migración: " + e.message);
      console.error(e);
    } finally {
      setIsMigrating(false);
    }
  };

  // Helper para poner la columna "codigo" al principio
  const reorderHeaders = (headerList: string[]) => {
    let sorted = [...headerList];

    // 1. Extraer APELLIDOS y NOMBRES
    const apellidosIndex = sorted.findIndex(h => h.toUpperCase() === 'APELLIDOS');
    let apellidosHeader: string | null = null;
    if (apellidosIndex >= 0) apellidosHeader = sorted.splice(apellidosIndex, 1)[0];

    const nombresIndex = sorted.findIndex(h => h.toUpperCase() === 'NOMBRES');
    let nombresHeader: string | null = null;
    if (nombresIndex >= 0) nombresHeader = sorted.splice(nombresIndex, 1)[0];

    const generoIndex = sorted.findIndex(h => h.toUpperCase() === 'GÉNERO' || h.toUpperCase() === 'GENERO');
    let generoHeader: string | null = null;
    if (generoIndex >= 0) generoHeader = sorted.splice(generoIndex, 1)[0];

    // 2. Extraer CÓDIGO
    const codigoIndex = sorted.findIndex(h => h.toLowerCase().includes('código') || h.toLowerCase().includes('codigo'));
    let insertIndex = 0;
    if (codigoIndex >= 0) {
      const codigoHeader = sorted.splice(codigoIndex, 1)[0];
      sorted.splice(0, 0, codigoHeader);
      insertIndex = 1;
    }

    // 3. Insertar APELLIDOS, NOMBRES y GÉNERO en orden
    if (apellidosHeader) {
      sorted.splice(insertIndex, 0, apellidosHeader);
      insertIndex++;
    }
    if (nombresHeader) {
      sorted.splice(insertIndex, 0, nombresHeader);
      insertIndex++;
    }
    if (generoHeader) {
      sorted.splice(insertIndex, 0, generoHeader);
    }
    
    return sorted;
  };

  // Fetch data when user is authenticated
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoadingData(true);
      const { data: sociosRaw, error } = await supabase
        .from('socios')
        .select(`
          *,
          grupos_base!grupo_id ( nombre, comunidad, parroquia, canton, provincia ),
          fincas ( 
            nombre, hectareas_totales, hectareas_cacao, hectareas_bosque, 
            lotes_finca ( coord_x, coord_y, coord_z, area_hectareas )
          )
        `)
        .order('nombres', { ascending: true });

      if (error) {
        console.error("Error cargando de Supabase:", error);
      } else if (sociosRaw) {
        const flatData: any[] = [];
        sociosRaw.forEach(s => {
          const baseRow = {
            'CÓDIGO': s.codigo_socio || '',
            'CÉDULA': s.cedula || '',
            'NOMBRES': s.nombres || '',
            'APELLIDOS': s.apellidos || '',
            'TELÉFONO': s.telefono || '',
            'GÉNERO': s.genero || '',
            'EMAIL': s.email || '',
            'BANCO': s.banco_nombre || '',
            'CUENTA': s.banco_cuenta || '',
            'COMUNIDAD': s.grupos_base?.comunidad || '',
            'PARROQUIA': s.grupos_base?.parroquia || '',
            'CANTÓN': s.grupos_base?.canton || '',
            'PROVINCIA': s.grupos_base?.provincia || ''
          };

          if (!s.fincas || s.fincas.length === 0) {
            flatData.push(baseRow);
          } else {
            s.fincas.forEach((f: any) => {
              const fincaRow = {
                ...baseRow,
                'FINCA': f.nombre || '',
                'HAS. TOTAL DE FINCA': f.hectareas_totales || '',
                'HAS. TOTAL DE CACAO': f.hectareas_cacao || '',
                'HAS. BOSQUE': f.hectareas_bosque || ''
              };

              if (!f.lotes_finca || f.lotes_finca.length === 0) {
                flatData.push(fincaRow);
              } else {
                f.lotes_finca.forEach((l: any) => {
                  flatData.push({
                    ...fincaRow,
                    'COORDENADA X': l.coord_x || '',
                    'COORDENADA Y': l.coord_y || '',
                    'COORDENADA Z': l.coord_z || ''
                  });
                });
              }
            });
          }
        });

        const loadedHeaders = [
          'CÓDIGO', 'CÉDULA', 'NOMBRES', 'APELLIDOS', 'TELÉFONO', 'GÉNERO', 'EMAIL', 'BANCO', 'CUENTA',
          'COMUNIDAD', 'PARROQUIA', 'CANTÓN', 'PROVINCIA',
          'FINCA', 'HAS. TOTAL DE FINCA', 'HAS. TOTAL DE CACAO', 'HAS. BOSQUE',
          'COORDENADA X', 'COORDENADA Y', 'COORDENADA Z'
        ];
        
        setData(flatData);
        setHeaders(loadedHeaders);
        console.log("DEBUG: First 5 rows of flatData:", JSON.stringify(flatData.slice(0, 5), null, 2));
      }
      setIsLoadingData(false);
    };

    fetchData();
  }, [user]);

  // Auto-corregir teléfonos sin cero inicial
  useEffect(() => {
    if (data.length > 0 && headers.length > 0 && !isLoadingData) {
      let needsFix = false;
      const fixedData = data.map(row => {
        const newRow = { ...row };
        headers.forEach(h => {
          // Convertir a mayúsculas, excepto si es enlace
          if (typeof newRow[h] === 'string') {
            const val = newRow[h];
            const lowerVal = val.toLowerCase();
            const lowerH = h.toLowerCase();
            const isLink = lowerVal.startsWith('http://') || lowerVal.startsWith('https://') || lowerH.includes('drive') || lowerH.includes('documento') || lowerH.includes('enlace') || lowerH.includes('url') || lowerH.includes('link') || lowerH === 'email' || lowerH === 'cuenta';
            
            if (!isLink) {
              const upperVal = val.toUpperCase();
              if (val !== upperVal) {
                newRow[h] = upperVal;
                needsFix = true;
              }
            }
          }

          const lowerH = h.toLowerCase();
          // Fix teléfonos
          if (lowerH.includes('telef') || lowerH.includes('teléf')) {
            let val = newRow[h] ? newRow[h].toString().trim() : '';
            // Si es un número que no empieza con 0 (ej. 987654321), agregarle el 0
            if (val.length > 0 && !val.startsWith('0') && /^[1-9]/.test(val)) {
              newRow[h] = '0' + val;
              needsFix = true;
            }
          }
          // Fix Provincias mal escritas o con mayúsculas/minúsculas diferentes
          if (lowerH === 'provincia') {
            let val = newRow[h] ? newRow[h].toString().trim() : '';
            const lowerVal = val.toLowerCase();

            if (lowerVal.includes('chinchipe') || lowerVal.includes('zamora')) {
              if (val !== 'ZAMORA CHINCHIPE') {
                newRow[h] = 'ZAMORA CHINCHIPE';
                needsFix = true;
              }
            } else if (lowerVal.includes('morona') || lowerVal.includes('santiago')) {
              if (val !== 'MORONA SANTIAGO') {
                newRow[h] = 'MORONA SANTIAGO';
                needsFix = true;
              }
            }
          }
        });
        return newRow;
      });

      let newHeaders = [...headers];
      let finalData = [...fixedData];

      // Dividir "Nombres y Apellidos" en "APELLIDOS" y "NOMBRES"
      const combinedHeaderIndex = newHeaders.findIndex(h => {
        const lower = h.toLowerCase();
        return (lower.includes('nombre') && lower.includes('apellido'));
      });

      if (combinedHeaderIndex >= 0 && !newHeaders.includes('APELLIDOS') && !newHeaders.includes('NOMBRES')) {
        const combinedName = newHeaders[combinedHeaderIndex];
        // Remover la cabecera combinada
        newHeaders.splice(combinedHeaderIndex, 1);
        // Insertar APELLIDOS primero, luego NOMBRES
        newHeaders.splice(combinedHeaderIndex, 0, 'APELLIDOS', 'NOMBRES');

        finalData = finalData.map(r => {
          const rCopy = { ...r };
          const fullName = (rCopy[combinedName] || '').toString().trim();
          const parts = fullName.split(' ').filter(Boolean);

          let apellidos = '';
          let nombres = '';

          const isApellidosFirst = combinedName.toUpperCase().startsWith('APELLIDO');

          if (parts.length >= 4) {
            if (isApellidosFirst) {
              apellidos = parts[0] + ' ' + parts[1];
              nombres = parts.slice(2).join(' ');
            } else {
              nombres = parts[0] + ' ' + parts[1];
              apellidos = parts.slice(2).join(' ');
            }
          } else {
            const half = Math.ceil(parts.length / 2);
            if (isApellidosFirst) {
              apellidos = parts.slice(0, half).join(' ');
              nombres = parts.slice(half).join(' ');
            } else {
              nombres = parts.slice(0, half).join(' ');
              apellidos = parts.slice(half).join(' ');
            }
          }

          rCopy['APELLIDOS'] = apellidos;
          rCopy['NOMBRES'] = nombres;
          delete rCopy[combinedName];

          return rCopy;
        });
        needsFix = true;
      }

      // Autocompletar "GÉNERO" basado en "NOMBRES"
      const generoColIndex = newHeaders.findIndex(h => h.toUpperCase() === 'GÉNERO' || h.toUpperCase() === 'GENERO');
      const nombresIndexForGender = newHeaders.findIndex(h => h.toUpperCase() === 'NOMBRES');
      
      if (generoColIndex === -1 && nombresIndexForGender !== -1) {
        newHeaders.splice(nombresIndexForGender + 1, 0, 'GÉNERO');
        
        finalData = finalData.map(r => {
          const rCopy = { ...r };
          const nombresStr = (rCopy['NOMBRES'] || '').toString().trim();
          let genero = '';
          
          if (nombresStr) {
            const firstWord = nombresStr.split(' ')[0].toUpperCase();
            const femaleExceptions = ['ROCIO', 'CONSUELO', 'AMPARO', 'SOCORRO', 'ROSARIO', 'LOURDES', 'MARILU', 'MARIBEL', 'ISABEL', 'ESTHER', 'RUTH', 'BEATRIZ', 'CARMEN', 'INÉS', 'INES', 'MABEL', 'SHIRLEY', 'EVELYN', 'ABIGAIL', 'RAQUEL', 'MIRIAM', 'MIRIAN', 'EDITH', 'JUDITH', 'MAGALY', 'BETTY', 'GLADYS', 'MILDRED', 'KAREN', 'IVETH', 'JANETH', 'MARIA', 'MARÍA'];
            const maleExceptions = ['JOSE', 'JOSÉ', 'JESUS', 'JESÚS', 'LUCAS', 'MATIAS', 'ELIAS', 'NICOLAS', 'TOMAS', 'BAUTISTA', 'ISAIAS', 'JEREMIAS', 'LUIS', 'CARLOS', 'JUAN'];

            if (femaleExceptions.includes(firstWord)) {
              genero = 'FEMENINO';
            } else if (maleExceptions.includes(firstWord)) {
              genero = 'MASCULINO';
            } else if (firstWord.endsWith('A')) {
              genero = 'FEMENINO';
            } else {
              genero = 'MASCULINO';
            }
          }
          
          rCopy['GÉNERO'] = genero;
          return rCopy;
        });
        needsFix = true;
      }

      if (needsFix) {
        saveData(finalData, newHeaders);
      }
    }
  }, [data, headers, isLoadingData]);

  const filteredData = data.filter(row => {
    // 1. Filtros Geográficos
    if (filterProvincia && row['PROVINCIA'] !== filterProvincia) return false;
    if (filterCanton && row['CANTÓN'] !== filterCanton && row['CANTON'] !== filterCanton) return false;
    if (filterComunidad && row['COMUNIDAD'] !== filterComunidad) return false;

    // 2. Búsqueda de Texto
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const searchTerms = term.split(' ').filter(t => t.trim() !== '');

    if (searchColumn === 'DATOS_BANCARIOS') {
      let rowString = '';
      Object.entries(row).forEach(([key, val]) => {
        const up = key.toUpperCase();
        if (up.includes('APELLIDO') || up.includes('NOMBRE') || up.includes('CÉDULA') || up.includes('CEDULA') || up.includes('IDENTIFICACION') || up === 'CUENTA') {
           if (val) rowString += val.toString().toLowerCase() + ' ';
        }
      });
      return searchTerms.every(t => rowString.includes(t));
    }

    if (searchColumn !== 'all') {
      const val = row[searchColumn] ? row[searchColumn].toString().toLowerCase() : '';
      return searchTerms.every(t => val.includes(t));
    }

    const allString = Object.values(row).map(v => v ? v.toString().toLowerCase() : '').join(' ');
    return searchTerms.every(t => allString.includes(t));
  })
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const valA = (a[sortConfig.key] || '').toString().toLowerCase();
      const valB = (b[sortConfig.key] || '').toString().toLowerCase();
      if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Computed geographic filters
  const uniqueProvincias = Array.from(new Set(data.map(r => r['PROVINCIA']).filter(Boolean))).sort();
  const uniqueCantones = Array.from(new Set(
    data.filter(r => !filterProvincia || r['PROVINCIA'] === filterProvincia)
        .map(r => r['CANTÓN'] || r['CANTON']).filter(Boolean)
  )).sort();
  const uniqueComunidades = Array.from(new Set(
    data.filter(r => (!filterProvincia || r['PROVINCIA'] === filterProvincia) && (!filterCanton || r['CANTÓN'] === filterCanton || r['CANTON'] === filterCanton))
        .map(r => r['COMUNIDAD']).filter(Boolean)
  )).sort();

  // Generar filtros rápidos dinámicos si es una columna geográfica
  const isGeoColumn = searchColumn.toLowerCase().match(/provincia|canton|cantón|parroquia|comunidad/);
  const quickFilters = isGeoColumn ? Array.from(new Set(data.map(row => row[searchColumn]).filter(Boolean))).sort() : [];

  const isBankView = searchColumn === 'DATOS_BANCARIOS';
  const displayedHeaders = isBankView 
    ? headers.filter(h => {
        const up = h.toUpperCase();
        return up.includes('APELLIDO') || up.includes('NOMBRE') || up.includes('IDENTIFICACION') || up.includes('CÉDULA') || up.includes('CEDULA') || up === 'EMAIL' || up === 'BANCO' || up === 'TIPO DE CUENTA' || up === 'CUENTA';
      })
    : headers;

  // Filtrar columnas de numeración del CSV para que no aparezcan en el PDF (ya que el PDF genera su propio '#')
  const pdfAvailableHeaders = displayedHeaders.filter(h => !/^(n°|nro\.?|no\.?|número|numero|#)$/i.test(h.trim()));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      alert("Error: " + error.message);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Drag to Scroll Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDraggingScroll(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };
  const handleMouseLeave = () => {
    setIsDraggingScroll(false);
  };
  const handleMouseUp = () => {
    setIsDraggingScroll(false);
    setTimeout(() => setHasDragged(false), 50);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingScroll || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // velocidad de scroll
    scrollRef.current.scrollLeft = scrollLeft - walk;
    if (Math.abs(walk) > 10) setHasDragged(true);
  };

  // Drag and Drop Column Handlers
  const handleDragStart = (e: React.DragEvent, h: string) => {
    setDraggedCol(h);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target instanceof HTMLElement) e.target.classList.add('opacity-50');
    }, 0);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent, targetH: string) => {
    e.preventDefault();
    if (e.target instanceof HTMLElement) e.target.classList.remove('opacity-50');
    if (!draggedCol || draggedCol === targetH) return;
    
    const newHeaders = [...headers];
    const fromIndex = newHeaders.indexOf(draggedCol);
    const toIndex = newHeaders.indexOf(targetH);
    
    newHeaders.splice(fromIndex, 1);
    newHeaders.splice(toIndex, 0, draggedCol);
    
    saveData(data, newHeaders);
    setDraggedCol(null);
  };
  const handleDragEnd = (e: React.DragEvent) => {
    if (e.target instanceof HTMLElement) e.target.classList.remove('opacity-50');
    setDraggedCol(null);
  };

  // Render helpers
  const renderCellContent = (h: string, val: any) => {
    if (!val || val.toString().trim() === '') return <span className="text-slate-300">-</span>;
    
    const lowerH = h.toLowerCase();
    const valueStr = val.toString();

    if (lowerH.includes('código') || lowerH.includes('codigo')) {
      return <span className="bg-orange-100 text-orange-800 font-mono text-xs font-bold rounded-lg px-2.5 py-1 border border-orange-200 shadow-sm inline-block">{valueStr}</span>;
    }
    if (lowerH.includes('provincia')) {
      return <span className="bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-200 px-2.5 py-1 inline-block">{valueStr}</span>;
    }
    if (lowerH.includes('canton') || lowerH.includes('cantón') || lowerH.includes('parroquia')) {
      return <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200 px-2.5 py-1 inline-block">{valueStr}</span>;
    }
    if (lowerH.includes('apellidos') || lowerH.includes('nombres')) {
      return <span className="font-bold text-slate-800">{valueStr}</span>;
    }
    if (lowerH.includes('género') || lowerH.includes('genero')) {
      const isFem = valueStr.toUpperCase() === 'FEMENINO';
      const badgeClass = isFem 
        ? 'bg-pink-50 text-pink-700 border-pink-200' 
        : 'bg-indigo-50 text-indigo-700 border-indigo-200';
      return <span className={`text-xs font-bold rounded-full border px-2.5 py-1 inline-block ${badgeClass}`}>{valueStr}</span>;
    }
    if (lowerH.includes('identificacion') || lowerH.includes('identificación') || lowerH.includes('cedula') || lowerH.includes('cédula')) {
      return <span className="font-mono text-slate-600 tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs">{valueStr}</span>;
    }

    const lowerVal = valueStr.toLowerCase();
    
    // Si la columna es de enlace, o si el valor empieza con http
    const isLinkColumn = lowerH.includes('drive') || lowerH.includes('documento') || lowerH.includes('enlace') || lowerH.includes('link') || lowerH.includes('url');
    
    if (isLinkColumn || lowerVal.startsWith('http://') || lowerVal.startsWith('https://')) {
      if (lowerVal.startsWith('http://') || lowerVal.startsWith('https://')) {
        return (
          <a 
            href={valueStr} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-bold bg-blue-50 hover:bg-blue-100 border border-blue-200 px-3 py-1.5 rounded-lg w-max shadow-sm transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Abrir Enlace
          </a>
        );
      }
    }

    return <span className="text-slate-600">{valueStr}</span>;
  };

  const calculateAges = (inputData: any[], inputHeaders: string[]) => {
    let newHeaders = [...inputHeaders];
    
    // Buscar la columna de fecha de nacimiento
    const fechaNacKey = newHeaders.find(h => h.toUpperCase().includes('FECHA') && h.toUpperCase().includes('NACIMIENTO'));
    
    if (fechaNacKey) {
      if (!newHeaders.find(h => h.toUpperCase() === 'EDAD')) {
        const idx = newHeaders.indexOf(fechaNacKey);
        newHeaders.splice(idx + 1, 0, 'EDAD');
      }
      
      const edadKey = newHeaders.find(h => h.toUpperCase() === 'EDAD') || 'EDAD';
      
      const newData = inputData.map(row => {
        const fechaStr = row[fechaNacKey];
        if (fechaStr) {
          let birthDate = new Date(fechaStr);
          if (isNaN(birthDate.getTime()) && fechaStr.includes('/')) {
            const parts = fechaStr.split('/');
            if (parts.length === 3) {
              birthDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`); // DD/MM/YYYY fallback
            }
          }
          if (!isNaN(birthDate.getTime())) {
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            return { ...row, [edadKey]: age.toString() };
          }
        }
        return { ...row, [edadKey]: row[edadKey] || '' };
      });
      return { data: newData, headers: newHeaders };
    }
    
    return { data: inputData, headers: inputHeaders };
  };

  const saveData = async (newData: any[], newHeaders: string[]) => {
    // La app ya no guarda en el excel temporal, ahora es solo de vista relacional.
    // Los datos se guardan mediante los formularios FincaForm, ClienteForm, etc.
    const processed = calculateAges(newData, newHeaders);
    setData(processed.data);
    setHeaders(processed.headers);
  };

  const sanitizeImportData = (parsedData: any[], rawHeaders: string[]) => {
    const correoKeyIndex = rawHeaders.findIndex(h => h.toLowerCase().includes('correo'));
    const emailKeyIndex = rawHeaders.findIndex(h => h.toUpperCase() === 'EMAIL');
    
    let finalEmailKey = emailKeyIndex >= 0 ? rawHeaders[emailKeyIndex] : 'EMAIL';
    let correoKey = correoKeyIndex >= 0 ? rawHeaders[correoKeyIndex] : null;

    if (!rawHeaders.includes(finalEmailKey)) {
      rawHeaders.push(finalEmailKey);
    }

    parsedData.forEach(row => {
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
      rawHeaders = rawHeaders.filter(h => h !== correoKey);
    }

    const newCols = ['EMAIL', 'BANCO', 'TIPO DE CUENTA', 'CUENTA'];
    newCols.forEach(col => {
      if (!rawHeaders.find(h => h.toUpperCase() === col)) {
        rawHeaders.push(col);
      }
    });

    const upperHeaders = rawHeaders.map(h => h.toUpperCase());
    const upperData = parsedData.map(row => {
      const newRow: any = {};
      Object.keys(row).forEach(k => {
        if (k) newRow[k.toUpperCase()] = row[k];
      });
      return newRow;
    });

    return { sanitizedData: upperData, sanitizedHeaders: upperHeaders };
  };

  useEffect(() => {
    if (data.length > 0 && headers.length > 0 && !isLoadingData) {
      const migrationKey = 'migration_v3_uppercase_correo';
      if (!localStorage.getItem(migrationKey)) {
        localStorage.setItem(migrationKey, 'true');
        setTimeout(() => {
          const { sanitizedData, sanitizedHeaders } = sanitizeImportData([...data], [...headers]);
          saveData(sanitizedData, reorderHeaders(sanitizedHeaders));
        }, 1000);
      }
    }
  }, [data, headers, isLoadingData]);

  // Simple CSV Parser
  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    if (lines.length === 0) return;

    let rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    let parsedData: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row: any = {};
      rawHeaders.forEach((h, index) => {
        row[h] = values[index] || '';
      });
      parsedData.push(row);
    }

    const { sanitizedData, sanitizedHeaders } = sanitizeImportData(parsedData, rawHeaders);
    saveData(sanitizedData, reorderHeaders(sanitizedHeaders));
  };

  const parseExcel = async (arrayBuffer: ArrayBuffer) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(arrayBuffer);
    const worksheet = workbook.worksheets[0];
    
    if (!worksheet) return;

    let rawHeaders: string[] = [];
    let headerRowNumber = 0;
    const parsedData: any[] = [];

    worksheet.eachRow((row, rowNumber) => {
      if (headerRowNumber === 0) {
        let isHeader = false;
        row.eachCell((cell) => {
          const val = cell.value ? cell.value.toString().toUpperCase().trim() : '';
          if (['#', 'NOMBRES', 'NOMBRE', 'CÓDIGO', 'CODIGO', 'APELLIDOS', 'APELLIDO', 'PROVINCIA', 'CEDULA', 'CÉDULA', 'IDENTIFICACION', 'IDENTIFICACIÓN'].includes(val)) {
            isHeader = true;
          }
        });
        
        if (isHeader) {
          headerRowNumber = rowNumber;
          row.eachCell((cell, colNumber) => {
            rawHeaders[colNumber - 1] = cell.value ? cell.value.toString().trim() : `Column${colNumber}`;
          });
          rawHeaders = Array.from(rawHeaders || []).map(h => h || '');
        }
      } else if (headerRowNumber > 0 && rowNumber > headerRowNumber) {
        const rowData: any = {};
        let hasData = false;
        rawHeaders.forEach((h, index) => {
          if (!h) return;
          const cell = row.getCell(index + 1);
          let val = cell.value;
          if (val instanceof Date) {
            val = val.toISOString().split('T')[0];
          } else if (val && typeof val === 'object' && 'richText' in val) {
             val = (val as any).richText.map((t: any) => t.text).join('');
          }
          const finalVal = val !== null && val !== undefined ? val.toString().trim() : '';
          rowData[h] = finalVal;
          if (finalVal) hasData = true;
        });
        if (hasData) parsedData.push(rowData);
      }
    });

    if (rawHeaders.length > 0 && rawHeaders[0] === '#') {
       rawHeaders.shift();
       parsedData.forEach(row => delete row['#']);
    }

    const { sanitizedData, sanitizedHeaders } = sanitizeImportData(parsedData, rawHeaders);
    saveData(sanitizedData, reorderHeaders(sanitizedHeaders));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCSV(text);
      };
      reader.readAsText(file);
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      const arrayBuffer = await file.arrayBuffer();
      await parseExcel(arrayBuffer);
    } else {
      alert('Formato de archivo no soportado. Por favor sube un archivo .csv o .xlsx');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newFieldInput.trim();
    if (!cleanName) return;

    if (headers.includes(cleanName)) {
      alert("Este campo ya existe en la base de datos.");
      return;
    }

    const newHeaders = [...headers, cleanName];
    const newData = data.map(row => ({
      ...row,
      [cleanName]: ''
    }));

    saveData(newData, newHeaders);
    setNewFieldInput('');
  };

  const handleDeleteField = (fieldName: string) => {
    if (window.confirm(`¿Estás SEGURO de eliminar el campo "${fieldName}"? Se borrarán permanentemente los datos de todos los socios en este campo.`)) {
      const newHeaders = headers.filter(h => h !== fieldName);
      const newData = data.map(row => {
        const newRow = { ...row };
        delete newRow[fieldName];
        return newRow;
      });
      saveData(newData, newHeaders);
    }
  };

  const handleRenameField = (oldName: string) => {
    const cleanName = newColumnName.trim();
    if (!cleanName || cleanName === oldName) {
      setEditingColumn(null);
      return;
    }

    if (headers.includes(cleanName)) {
      alert("Este campo ya existe en la base de datos.");
      return;
    }

    const upOld = oldName.toUpperCase();
    if (['EDAD', 'EMAIL', 'BANCO', 'TIPO DE CUENTA', 'CUENTA'].includes(upOld)) {
      alert(`No puedes cambiar el nombre de la columna "${oldName}" porque es crítica para el funcionamiento del sistema (Vistas Bancarias o Cálculos Automáticos).`);
      setEditingColumn(null);
      return;
    }

    if (window.confirm(`¿Renombrar "${oldName}" a "${cleanName}" en todos los registros?`)) {
      const newHeaders = headers.map(h => h === oldName ? cleanName : h);
      const newData = data.map(row => {
        const newRow = { ...row };
        newRow[cleanName] = newRow[oldName] !== undefined ? newRow[oldName] : '';
        delete newRow[oldName];
        return newRow;
      });
      saveData(newData, newHeaders);
      setEditingColumn(null);
    }
  };

  const getDynamicSubtitle = () => {
    if (!searchTerm) return 'Todos los registros';
    return `Filtrado por: ${searchColumn === 'all' ? 'Cualquier campo' : searchColumn} = "${searchTerm}"`;
  };

  const getBase64Image = async (url: string): Promise<string | null> => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      return null;
    }
  };

  const handleExportExcel = async () => {
    if (filteredData.length === 0 || headers.length === 0) return;

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Directorio Socios', { views: [{ showGridLines: false }] });

    const endColChar = String.fromCharCode(64 + Math.min(headers.length, 26));
    let currentRow = 1;

    // Título Principal
    const titleRow = worksheet.addRow(['Directorio de Socios Asopromas']);
    titleRow.height = 25;
    worksheet.getCell(`A${currentRow}`).font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    worksheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEA580C' } };
    worksheet.getCell(`A${currentRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${currentRow}:${endColChar}${currentRow}`);
    currentRow++;

    // Subtítulo con Filtro Activo
    const subtitle = getDynamicSubtitle();
    worksheet.addRow([subtitle]);
    worksheet.getCell(`A${currentRow}`).font = { size: 10, italic: true, color: { argb: 'FF475569' } };
    worksheet.getCell(`A${currentRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
    worksheet.getCell(`A${currentRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.mergeCells(`A${currentRow}:${endColChar}${currentRow}`);
    currentRow++;

    // Timestamp
    worksheet.addRow([`Reporte generado el: ${new Date().toLocaleString()}`]);
    worksheet.getCell(`A${currentRow}`).font = { size: 8, color: { argb: 'FF94A3B8' } };
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'right' };
    worksheet.mergeCells(`A${currentRow}:${endColChar}${currentRow}`);
    currentRow++;

    // Espacio en blanco
    worksheet.addRow([]);
    currentRow++;

    // Encabezados de Tabla
    const headerRow = worksheet.addRow(['#', ...headers]);
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF334155' } }; // Slate 700
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF475569' } },
        bottom: { style: 'thin', color: { argb: 'FF475569' } }
      };
    });

    // Datos
    filteredData.forEach((row, index) => {
      const dataRow = worksheet.addRow([index + 1, ...headers.map(h => row[h] || '-')]);
      dataRow.eachCell((cell) => {
        cell.border = {
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
        // Alternar colores de filas
        if (index % 2 === 1) {
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF8FAFC' } };
        }
      });
    });

    // Auto-ajustar ancho de columnas
    worksheet.columns.forEach((column) => {
      let maxLength = 12;
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength + 2;
        }
      });
      column.width = Math.min(maxLength, 40); // Cap width at 40
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, `socios_directorio_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const openPdfModal = () => {
    // Buscar campos por defecto (insensible a mayúsculas)
    const defaultFields = headers.filter(h => {
      const lower = h.toLowerCase();
      return lower.includes('nombre') || lower.includes('apellido') || lower.includes('telefono') || lower.includes('teléfono') || lower.includes('comunidad');
    });
    setSelectedPdfFields(defaultFields);
    setIsPdfModalOpen(true);
  };

  const generatePdfDoc = async () => {
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 10;

    try {
      // Cargar logo cuadrado y centrado
      const base64Logo = await getBase64Image('/Logo-Asopromas-Completo.jpg');
      if (base64Logo) {
        const logoSize = 25;
        doc.addImage(base64Logo, 'JPEG', (pageWidth - logoSize) / 2, currentY, logoSize, logoSize);
        currentY += logoSize + 5;
      }

      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('Directorio de Socios Asopromas', pageWidth / 2, currentY, { align: 'center' });
      currentY += 6;

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-500
      const subtitle = getDynamicSubtitle();
      doc.text(`${subtitle} | Total: ${filteredData.length}`, pageWidth / 2, currentY, { align: 'center' });
      currentY += 5;

      // Stats
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const textDemography = `Demografía: Mujeres ${totalMujeres} (${pctMujeres}%) | Hombres ${totalHombres} (${pctHombres}%)`;
      doc.text(textDemography, pageWidth / 2, currentY, { align: 'center' });
      currentY += 4;
      
      if (topProvincias.length > 0) {
        const textProvincias = `Provincias: ${topProvincias.slice(0, 6).map(([p, c]) => `${p} (${Math.round(c/totalConProvincia*100)}%)`).join(', ')}`;
        doc.text(textProvincias, pageWidth / 2, currentY, { align: 'center' });
        currentY += 4;
      }
      
      if (totalConEdad > 0) {
        const textEdades = `Edades: 18-35 años: ${edad18_35} (${Math.round((edad18_35/totalConEdad)*100)}%) | 36-65 años: ${edad36_65} (${Math.round((edad36_65/totalConEdad)*100)}%) | +65 años: ${edadMas65} (${Math.round((edadMas65/totalConEdad)*100)}%)`;
        doc.text(textEdades, pageWidth / 2, currentY, { align: 'center' });
        currentY += 4;
      }
      
      currentY += 2;

    } catch (error) {
      doc.setFontSize(16);
      doc.text('Directorio de Socios Asopromas', pageWidth / 2, 15, { align: 'center' });
      doc.setFontSize(10);
      const subtitle = getDynamicSubtitle();
      doc.text(`${subtitle} | Total: ${filteredData.length}`, pageWidth / 2, 22, { align: 'center' });
      currentY = 28;
    }

    // Agregar la columna "#" al inicio
    const pdfHeaders = ['#', ...selectedPdfFields];

    // Generar la data con la numeración
    const tableData = filteredData.map((row, index) => {
      const rowData = selectedPdfFields.map(h => row[h] || '-');
      return [(index + 1).toString(), ...rowData];
    });

    autoTable(doc, {
      head: [pdfHeaders],
      body: tableData,
      startY: currentY,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [226, 232, 240], // slate-200
        lineWidth: 0.1,
        textColor: [51, 65, 85] // slate-700
      },
      headStyles: {
        fillColor: [234, 88, 12], // orange-600
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // slate-50
      },
      didDrawPage: function (data) {
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // slate-400
        const str = 'Página ' + (doc.internal as any).getCurrentPageInfo().pageNumber;
        doc.text(str, data.settings.margin.left, doc.internal.pageSize.height - 10);

        const timestamp = `Generado: ${new Date().toLocaleString()}`;
        doc.text(timestamp, doc.internal.pageSize.width - data.settings.margin.right - 40, doc.internal.pageSize.height - 10);
      }
    });

    return doc;
  };

  // Efecto para actualizar la vista previa del PDF con debounce y double-buffering
  useEffect(() => {
    if (!isPdfModalOpen) return;

    const timer = setTimeout(() => {
      generatePdfDoc().then(doc => {
        const blobUrl = doc.output('bloburl').toString();
        const nextFrame = frameRef.current === 'a' ? 'b' : 'a';

        // 1. Cargar el nuevo PDF en el iframe oculto
        setPreviewUrls(prev => ({ ...prev, [nextFrame]: blobUrl }));

        // 2. Esperar a que el iframe oculto cargue y haga su "parpadeo negro" de forma invisible
        setTimeout(() => {
          setActiveFrame(nextFrame);
          frameRef.current = nextFrame;

          // 3. Destruir el PDF viejo
          setPreviewUrls(prev => {
            const oldFrame = nextFrame === 'a' ? 'b' : 'a';
            const oldUrl = prev[oldFrame];
            if (oldUrl) URL.revokeObjectURL(oldUrl);
            return { ...prev, [oldFrame]: null };
          });
        }, 500); // 500ms de espera invisible

      }).catch(err => {
        console.error("Error generando PDF preview:", err);
      });
    }, 400); // 400ms de retraso al escribir

    return () => clearTimeout(timer);
  }, [isPdfModalOpen, selectedPdfFields, filteredData]);

  const handleDownloadPdf = async () => {
    const doc = await generatePdfDoc();
    doc.save(`socios_directorio_${new Date().toISOString().split('T')[0]}.pdf`);
    setIsPdfModalOpen(false);
  };

  const handleDelete = (index: number) => {
    if (window.confirm('¿Estás seguro de eliminar este registro para TODOS los usuarios?')) {
      const newData = [...data];
      newData.splice(index, 1);
      saveData(newData, headers);
    }
  };

  const openModal = (row: any = null, index: number | null = null) => {
    if (row) {
      setEditingRow({ ...row });
      setEditingIndex(index);
    } else {
      const newRow: any = {};
      headers.forEach(h => newRow[h] = '');
      setEditingRow(newRow);
      setEditingIndex(null);
    }
    setIsModalOpen(true);
  };

  const validarCedulaEcuatoriana = (cedula: string) => {
    if (cedula.length !== 10) return false;
    
    const digito_region = parseInt(cedula.substring(0, 2), 10);
    if (digito_region < 1 || (digito_region > 24 && digito_region !== 30)) return false;
    
    const tercer_digito = parseInt(cedula.substring(2, 3), 10);
    if (tercer_digito >= 6) return false; 
    
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    const verificador = parseInt(cedula.substring(9, 10), 10);
    
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let valor = parseInt(cedula.substring(i, i + 1), 10) * coeficientes[i];
      if (valor > 9) valor -= 9;
      suma += valor;
    }
    
    const decenaSuperior = Math.ceil(suma / 10) * 10;
    let digitoCalculado = decenaSuperior - suma;
    if (digitoCalculado === 10) digitoCalculado = 0;
    
    return digitoCalculado === verificador;
  };

  const saveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRow) return;

    // Validar Cédula/Identificación (Formato y Unicidad)
    const cedulaKey = headers.find(h => {
      const lowerH = h.toLowerCase();
      return lowerH.includes('identificacion') || lowerH.includes('identificación') || lowerH.includes('cédula') || lowerH.includes('cedula');
    });
    if (cedulaKey && editingRow[cedulaKey]) {
      const cedulaVal = editingRow[cedulaKey].toString().trim();
      if (cedulaVal.length > 0) {
        if (!validarCedulaEcuatoriana(cedulaVal)) {
          alert("El número de cédula ingresado no es válido. Verifica que los 10 dígitos sean correctos.");
          return;
        }
        const isDuplicate = data.some((row, idx) => idx !== editingIndex && row[cedulaKey]?.toString().trim() === cedulaVal);
        if (isDuplicate) {
          alert(`Ya existe un socio registrado con la cédula/identificación "${cedulaVal}". No se permiten duplicados.`);
          return;
        }
      }
    }

    // Validar Unicidad de Código
    const codigoKey = headers.find(h => {
      const lowerH = h.toLowerCase();
      return lowerH === 'codigo' || lowerH === 'código' || lowerH === 'cod' || lowerH === 'código socio';
    });
    if (codigoKey && editingRow[codigoKey]) {
      const codigoVal = editingRow[codigoKey].toString().trim();
      if (codigoVal.length > 0) {
        const isDuplicate = data.some((row, idx) => idx !== editingIndex && row[codigoKey]?.toString().trim() === codigoVal);
        if (isDuplicate) {
          alert(`Ya existe un socio registrado con el código "${codigoVal}". El código debe ser único.`);
          return;
        }
      }
    }

    // Validar Email
    const emailKey = headers.find(h => h.toUpperCase() === 'EMAIL');
    if (emailKey && editingRow[emailKey]) {
      const emailVal = editingRow[emailKey].toString().trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailVal.length > 0 && !emailRegex.test(emailVal)) {
        alert("El formato del correo electrónico (Email) no es válido.");
        return;
      }
    }

    // Forzar mayúsculas antes de guardar, excepto en enlaces
    const upperEditingRow: any = {};
    for (const key in editingRow) {
      if (typeof editingRow[key] === 'string') {
        const val = editingRow[key];
        const lowerVal = val.toLowerCase();
        const lowerKey = key.toLowerCase();
        
        // Si el valor es un enlace web o la columna es explícitamente un link
        if (lowerVal.startsWith('http://') || lowerVal.startsWith('https://') || lowerKey.includes('drive') || lowerKey.includes('documento') || lowerKey.includes('enlace') || lowerKey.includes('link') || lowerKey.includes('url') || lowerKey === 'email' || lowerKey === 'cuenta') {
          upperEditingRow[key] = val;
        } else {
          upperEditingRow[key] = val.toUpperCase();
        }
      } else {
        upperEditingRow[key] = editingRow[key];
      }
    }

    const newData = [...data];
    if (editingIndex !== null) {
      newData[editingIndex] = upperEditingRow;
    } else {
      newData.unshift(upperEditingRow);
    }

    saveData(newData, headers);
    setIsModalOpen(false);
  };

  // ==========================================
  // PANTALLA DE LOGIN
  // ==========================================
  // Gender Stats Calculation
  const generoKey = headers.find(h => h.toUpperCase() === 'GÉNERO' || h.toUpperCase() === 'GENERO');
  let totalMujeres = 0;
  let totalHombres = 0;
  if (generoKey) {
    filteredData.forEach(row => {
      const g = (row[generoKey] || '').toString().toUpperCase();
      if (g === 'FEMENINO') totalMujeres++;
      if (g === 'MASCULINO') totalHombres++;
    });
  }
  const totalConGenero = totalMujeres + totalHombres;
  const pctMujeres = totalConGenero > 0 ? Math.round((totalMujeres / totalConGenero) * 100) : 0;
  const pctHombres = totalConGenero > 0 ? Math.round((totalHombres / totalConGenero) * 100) : 0;

  // Province Stats Calculation
  const provinciaKey = headers.find(h => h.toLowerCase() === 'provincia');
  const provinciaStats: Record<string, number> = {};
  let totalConProvincia = 0;
  if (provinciaKey) {
    filteredData.forEach(row => {
      const p = (row[provinciaKey] || '').toString().toUpperCase().trim();
      if (p && p !== '-') {
        provinciaStats[p] = (provinciaStats[p] || 0) + 1;
        totalConProvincia++;
      }
    });
  }
  const topProvincias = Object.entries(provinciaStats).sort((a, b) => b[1] - a[1]);

  // Age Stats Calculation
  const edadKey = headers.find(h => h.toUpperCase() === 'EDAD');
  let edad18_35 = 0;
  let edad36_65 = 0;
  let edadMas65 = 0;
  let totalConEdad = 0;

  if (edadKey) {
    filteredData.forEach(row => {
      const e = parseInt(row[edadKey], 10);
      if (!isNaN(e)) {
        totalConEdad++;
        if (e >= 18 && e <= 35) edad18_35++;
        else if (e > 35 && e <= 65) edad36_65++;
        else if (e > 65) edadMas65++;
      }
    });
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3]">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF9F3] p-4 font-sans">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-xl p-8 border border-orange-100">
          <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
            <LogIn className="h-8 w-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Acceso al Directorio</h2>
          <p className="text-center text-slate-500 mb-8">
            Ingresa tus credenciales de Supabase para acceder al directorio temporal compartido.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all mt-4"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // PANTALLA PRINCIPAL (LOGUEADO)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FDF9F3] pb-8 font-sans">

      {/* Minimalist Header */}
      <div className="bg-white border-b border-orange-100 shadow-sm px-6 py-4 mb-8 sticky top-0 z-50 flex items-center justify-center md:justify-start">
        <a href="https://asopromas.com" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
          <img src="/Logo-Asopromas-Completo.jpg" alt="Asopromas Logo" className="h-12 object-contain" />
        </a>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv, .xlsx, .xls"
        className="hidden"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-orange-600" />
                <h1 className="text-3xl font-bold text-slate-800">
                  Socios Asopromas
                </h1>
                {isSaving && <span className="flex items-center text-xs font-bold bg-orange-100 text-orange-700 px-2 py-1 rounded-full"><Loader2 className="h-3 w-3 animate-spin mr-1" /> Guardando...</span>}
              </div>
              <p className="text-slate-500 mt-2">
                Conectado a Base de Datos. Los cambios se sincronizan en vivo para todos los usuarios.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-orange-100 text-orange-800 hover:bg-orange-200 px-4 py-2.5 rounded-xl font-medium transition-colors"
              >
                <Upload className="h-4 w-4" /> Subir CSV
              </button>

              <button
                onClick={handleExportExcel}
                disabled={data.length === 0}
                className="flex items-center gap-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Descargar Excel
              </button>

              <button
                onClick={openPdfModal}
                disabled={data.length === 0}
                className="flex items-center gap-2 bg-red-100 text-red-800 hover:bg-red-200 px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                <FileText className="h-4 w-4" /> PDF
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2.5 rounded-xl font-medium transition-colors ml-4 border border-red-200"
              >
                <LogOut className="h-4 w-4" /> Salir
              </button>
            </div>
          </div>
        </div>

        {isLoadingData ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Top Toolbar: Stats & Sort */}
            {data.length > 0 && (
              <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
                {/* Gender Stats */}
                <div className="flex gap-4 items-center w-full md:w-auto">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-500 uppercase">Demografía</span>
                    <div className="flex flex-wrap gap-3 mt-1">
                      <div className="bg-pink-50 border border-pink-100 text-pink-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm">
                        Mujeres: {totalMujeres} ({pctMujeres}%)
                      </div>
                      <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1 shadow-sm">
                        Hombres: {totalHombres} ({pctHombres}%)
                      </div>
                      
                      {topProvincias.length > 0 && (
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
                          <span className="text-xs font-bold text-slate-400">PROVINCIAS:</span>
                          <div className="flex gap-2 overflow-x-auto max-w-[200px] sm:max-w-[300px] md:max-w-md pb-1 hide-scrollbar">
                            {topProvincias.map(([prov, count]) => {
                              const pct = Math.round((count / totalConProvincia) * 100);
                              return (
                                <div key={prov} className="bg-emerald-50 border border-emerald-100 text-emerald-700 px-2.5 py-1.5 rounded-lg text-sm font-bold shadow-sm whitespace-nowrap">
                                  {prov} {pct}%
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      {totalConEdad > 0 && (
                        <div className="flex items-center gap-2 border-l border-slate-200 pl-3 ml-1">
                          <span className="text-xs font-bold text-slate-400">EDADES:</span>
                          <div className="flex gap-2 overflow-x-auto max-w-[200px] sm:max-w-[300px] md:max-w-md pb-1 hide-scrollbar">
                            <div className="bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1.5 rounded-lg text-sm font-bold shadow-sm whitespace-nowrap">
                              18-35: {edad18_35} ({totalConEdad > 0 ? Math.round((edad18_35 / totalConEdad) * 100) : 0}%)
                            </div>
                            <div className="bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1.5 rounded-lg text-sm font-bold shadow-sm whitespace-nowrap">
                              36-65: {edad36_65} ({totalConEdad > 0 ? Math.round((edad36_65 / totalConEdad) * 100) : 0}%)
                            </div>
                            <div className="bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1.5 rounded-lg text-sm font-bold shadow-sm whitespace-nowrap">
                              +65: {edadMas65} ({totalConEdad > 0 ? Math.round((edadMas65 / totalConEdad) * 100) : 0}%)
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Search & Actions */}
            {data.length > 0 && (
              <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div className="flex flex-col md:flex-row gap-3 flex-1 max-w-2xl">
                    <select
                      value={searchColumn}
                      onChange={(e) => {
                        setSearchColumn(e.target.value);
                        setSearchTerm(''); // Limpiar búsqueda al cambiar columna
                      }}
                      className="bg-white border border-slate-200 px-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-slate-700 min-w-[200px]"
                    >
                      <option value="all">Todos los campos</option>
                      {headers.filter(h => {
                         const up = h.toUpperCase();
                         return up !== 'BANCO' && up !== 'TIPO DE CUENTA' && up !== 'CUENTA';
                      }).map((h, i) => (
                        <option key={i} value={h}>{h}</option>
                      ))}
                      <option value="DATOS_BANCARIOS" className="font-bold text-orange-600">Vista: Datos Bancarios</option>
                    </select>

                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder={searchColumn === 'all' ? "Buscar por cualquier campo..." : searchColumn === 'DATOS_BANCARIOS' ? "Buscar socio para transferencia..." : `Buscar en ${searchColumn}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-slate-200 pl-11 pr-4 py-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => openModal()}
                    className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-3 rounded-xl font-bold shadow-sm hover:shadow transition-all whitespace-nowrap h-[50px]"
                  >
                    <Plus className="h-5 w-5" /> Agregar Socio
                  </button>
                </div>

                {/* Geographics Filters */}
                <div className="w-full mt-3 mb-2 flex flex-col md:flex-row gap-3 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <span className="text-sm font-bold text-slate-500 flex items-center min-w-[140px]"><MapPin className="w-4 h-4 mr-1" /> Filtros por Zona:</span>
                  
                  <select
                    value={filterProvincia}
                    onChange={(e) => {
                      setFilterProvincia(e.target.value);
                      setFilterCanton('');
                      setFilterComunidad('');
                    }}
                    className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium w-full min-w-[150px]"
                  >
                    <option value="">Todas las Provincias</option>
                    {uniqueProvincias.map((p: any, i) => <option key={i} value={p}>{p}</option>)}
                  </select>

                  <select
                    value={filterCanton}
                    onChange={(e) => {
                      setFilterCanton(e.target.value);
                      setFilterComunidad('');
                    }}
                    disabled={!filterProvincia && uniqueCantones.length > 20}
                    className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium disabled:bg-slate-100 disabled:text-slate-400 w-full min-w-[150px]"
                  >
                    <option value="">Todos los Cantones</option>
                    {uniqueCantones.map((c: any, i) => <option key={i} value={c}>{c}</option>)}
                  </select>

                  <select
                    value={filterComunidad}
                    onChange={(e) => setFilterComunidad(e.target.value)}
                    disabled={!filterCanton && uniqueComunidades.length > 30}
                    className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm font-medium disabled:bg-slate-100 disabled:text-slate-400 w-full min-w-[150px]"
                  >
                    <option value="">Todas las Comunidades</option>
                    {uniqueComunidades.map((c: any, i) => <option key={i} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Filtros Rápidos Dinámicos */}
                {quickFilters.length > 0 && (
                  <div className="w-full mt-3 flex flex-wrap gap-2 items-center bg-slate-50/80 p-3 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-2">
                    <span className="text-sm font-bold text-slate-500 mr-2 flex items-center"><FileText className="w-4 h-4 mr-1" />Filtro Rápido ({searchColumn}):</span>
                    <button
                      onClick={() => setSearchTerm('')}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${searchTerm === ''
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100 hover:border-slate-400'
                        }`}
                    >
                      Mostrar Todos
                    </button>
                    {quickFilters.map((qf: any, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSearchTerm(qf)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-full transition-all ${searchTerm === qf
                          ? 'bg-orange-600 text-white shadow-md scale-105'
                          : 'bg-white text-slate-600 border border-orange-200 hover:bg-orange-50 hover:border-orange-300'
                          }`}
                      >
                        {qf}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty State */}
            {data.length === 0 && (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center shadow-sm">
                <div className="mx-auto w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                  <Upload className="h-10 w-10 text-orange-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">La base de datos en la nube está vacía</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8">
                  Nadie ha subido un archivo CSV todavía. Si tienes el archivo original de socios, súbelo ahora para que quede disponible para todos.
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Subir Primer Archivo CSV
                </button>
              </div>
            )}

            {/* Table */}
            {data.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div 
                  className={`overflow-x-auto ${isDraggingScroll ? 'cursor-grabbing' : 'cursor-grab'}`}
                  ref={scrollRef}
                  onMouseDown={handleMouseDown}
                  onMouseLeave={handleMouseLeave}
                  onMouseUp={handleMouseUp}
                  onMouseMove={handleMouseMove}
                >
                  <table className="w-full text-left text-sm text-slate-600 select-none">
                    <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 whitespace-nowrap w-16 text-center">#</th>
                        {displayedHeaders.map((h, i) => (
                          <th
                            key={i}
                            draggable={true}
                            onDragStart={(e) => handleDragStart(e, h)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, h)}
                            onDragEnd={handleDragEnd}
                            className={`px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-slate-200 transition-colors ${draggedCol === h ? 'opacity-50 bg-orange-100' : ''}`}
                            onClick={() => {
                              if (hasDragged) return;
                              requestSort(h);
                            }}
                            title={`Arrastra para mover, o haz click para ordenar por ${h}`}
                          >
                            <div className="flex items-center gap-2 pointer-events-none">
                              {h}
                              {sortConfig?.key === h && (
                                <span className="text-orange-500 text-xs">
                                  {sortConfig.direction === 'asc' ? '▲' : '▼'}
                                </span>
                              )}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredData.map((row, rowIndex) => (
                        <tr
                          key={rowIndex}
                          onClick={() => {
                            if (hasDragged) return;
                            openModal(row, data.indexOf(row));
                          }}
                          className="odd:bg-white even:bg-slate-50/80 hover:bg-orange-100/60 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-slate-400 border-r border-slate-100/50 group-hover:bg-orange-200/40 transition-colors">
                            {rowIndex + 1}
                          </td>
                          {displayedHeaders.map((h, colIndex) => (
                            <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                              {renderCellContent(h, row[h])}
                            </td>
                          ))}
                        </tr>
                      ))}
                      {filteredData.length === 0 && (
                        <tr>
                          <td colSpan={headers.length} className="px-6 py-12 text-center text-slate-500">
                            No se encontraron resultados para "{searchTerm}"
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-sm text-slate-500 font-medium flex justify-between">
                  <span>Mostrando {filteredData.length} de {data.length} socios.</span>
                  <span className="text-orange-600 font-bold">Autoguardado Activado</span>
                </div>
              </div>
            )}
          </>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-slate-800">
                    {editingIndex !== null ? 'Editar Socio' : 'Nuevo Socio'}
                  </h2>
                  {editingIndex !== null && (editingRow?.['CÓDIGO'] || editingRow?.['CODIGO']) && (
                    <button
                      type="button"
                      onClick={() => setIsLotesModalOpen(true)}
                      className="flex items-center gap-2 bg-orange-100 hover:bg-orange-200 text-orange-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                    >
                      <MapPin className="h-4 w-4" />
                      Ver Lotes y Mapa
                    </button>
                  )}
                </div>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={saveModal} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 pb-2">
                  {headers.map((h, i) => (
                    <div key={i} className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">{h}</label>
                      {(h.toLowerCase().includes('género') || h.toLowerCase().includes('genero')) ? (
                        <div className="flex flex-col gap-2">
                          <select
                            value={['MASCULINO', 'FEMENINO', ''].includes((editingRow?.[h] || '').toString().toUpperCase()) ? (editingRow?.[h] || '').toString().toUpperCase() : 'OTRO'}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === 'OTRO') {
                                setEditingRow({ ...editingRow, [h]: 'OTRO_ESPECIFICAR' });
                              } else {
                                setEditingRow({ ...editingRow, [h]: val });
                              }
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="" disabled>Seleccionar...</option>
                            <option value="MASCULINO">MASCULINO</option>
                            <option value="FEMENINO">FEMENINO</option>
                            <option value="OTRO">OTRO (Especificar)</option>
                          </select>
                          {!['MASCULINO', 'FEMENINO', ''].includes((editingRow?.[h] || '').toString().toUpperCase()) && (
                            <input
                              type="text"
                              placeholder="Especifique su género..."
                              value={editingRow?.[h] === 'OTRO_ESPECIFICAR' ? '' : editingRow?.[h] || ''}
                              onChange={(e) => setEditingRow({ ...editingRow, [h]: e.target.value })}
                              className="w-full bg-white border border-orange-300 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                              autoFocus
                            />
                          )}
                        </div>
                      ) : h.toUpperCase() === 'EDAD' ? (
                        <input
                          type="text"
                          readOnly
                          value={editingRow?.[h] || ''}
                          placeholder="Autocalculado..."
                          className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-400 focus:outline-none cursor-not-allowed"
                        />
                      ) : (h.toUpperCase().includes('FECHA') && h.toUpperCase().includes('NACIMIENTO')) ? (
                        <input
                          type="date"
                          value={editingRow?.[h] || ''}
                          onChange={(e) => setEditingRow({ ...editingRow, [h]: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        />
                      ) : h.toLowerCase().includes('drive') || h.toLowerCase().includes('documento') || h.toLowerCase().includes('enlace') || h.toLowerCase().includes('url') || h.toLowerCase().includes('link') ? (
                        <input
                          type="url"
                          value={editingRow?.[h] || ''}
                          onChange={(e) => setEditingRow({ ...editingRow, [h]: e.target.value.trim() })}
                          className="w-full bg-blue-50 border border-blue-300 rounded-lg px-4 py-2 text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm placeholder-blue-300"
                          placeholder="https://..."
                          autoComplete="off"
                        />
                      ) : h.toUpperCase() === 'EMAIL' ? (
                        <input
                          type="email"
                          value={editingRow?.[h] || ''}
                          onChange={(e) => setEditingRow({ ...editingRow, [h]: e.target.value.trim() })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          placeholder="ejemplo@correo.com"
                        />
                      ) : h.toUpperCase() === 'TIPO DE CUENTA' ? (
                        <select
                          value={['AHORROS', 'CORRIENTE', ''].includes((editingRow?.[h] || '').toString().toUpperCase()) ? (editingRow?.[h] || '').toString().toUpperCase() : ''}
                          onChange={(e) => setEditingRow({ ...editingRow, [h]: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="" disabled>Seleccionar tipo...</option>
                          <option value="AHORROS">AHORROS</option>
                          <option value="CORRIENTE">CORRIENTE</option>
                        </select>
                      ) : (
                        <>
                          <input
                            type="text"
                            list={h.toLowerCase().match(/provincia|canton|cantón|parroquia|comunidad/) ? `datalist-${h}` : undefined}
                            value={editingRow?.[h] || ''}
                            onChange={(e) => {
                              let val = e.target.value;
                              const lowerH = h.toLowerCase();
                              
                              if (lowerH.includes('identificacion') || lowerH.includes('identificación') || lowerH.includes('cédula') || lowerH.includes('cedula')) {
                                val = val.replace(/\D/g, '').substring(0, 10);
                              } else if (lowerH.includes('teléf') || lowerH.includes('telef') || lowerH.includes('celular') || lowerH.includes('telefono')) {
                                val = val.replace(/\D/g, '').substring(0, 10);
                              }
                              
                              setEditingRow({ ...editingRow, [h]: val });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            autoComplete="off"
                          />
                          {h.toLowerCase().match(/provincia|canton|cantón|parroquia|comunidad/) && (
                            <datalist id={`datalist-${h}`}>
                              {Array.from(new Set(data.map(row => row[h]).filter(val => val && val.toString().trim() !== ''))).sort().map((val: any, idx) => (
                                <option key={idx} value={val} />
                              ))}
                            </datalist>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
                  {editingIndex !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        handleDelete(editingIndex);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-colors mr-auto"
                    >
                      <Trash2 className="h-4 w-4" /> Eliminar
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors"
                  >
                    <Save className="h-4 w-4" /> Guardar y Subir a Nube
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de Campos */}
        {isFieldsModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md my-8">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-600" /> Administrar Campos
                </h2>
                <button onClick={() => setIsFieldsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                <form onSubmit={handleAddField} className="mb-6 flex gap-2">
                  <input
                    type="text"
                    required
                    value={newFieldInput}
                    onChange={(e) => setNewFieldInput(e.target.value)}
                    placeholder="Nombre nuevo campo..."
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-bold transition-colors whitespace-nowrap"
                  >
                    Agregar
                  </button>
                </form>

                <h3 className="text-sm font-bold text-slate-500 mb-3">Campos Actuales</h3>
                <div className="max-h-[50vh] overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50">
                  {headers.map((h, i) => (
                    <div key={i} className="flex justify-between items-center p-3 hover:bg-white transition-colors group">
                      {editingColumn === h ? (
                        <div className="flex w-full gap-2 items-center">
                          <input
                            type="text"
                            autoFocus
                            value={newColumnName}
                            onChange={(e) => setNewColumnName(e.target.value)}
                            className="flex-1 bg-white border border-orange-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRenameField(h);
                              if (e.key === 'Escape') setEditingColumn(null);
                            }}
                          />
                          <button onClick={() => handleRenameField(h)} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors" title="Guardar Nuevo Nombre"><Save className="h-4 w-4" /></button>
                          <button onClick={() => setEditingColumn(null)} className="text-slate-400 hover:bg-slate-100 p-1.5 rounded-lg transition-colors" title="Cancelar"><X className="h-4 w-4" /></button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium text-slate-700">{h}</span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setEditingColumn(h);
                                setNewColumnName(h);
                              }}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title={`Editar nombre de: ${h}`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteField(h)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title={`Eliminar campo: ${h}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setIsFieldsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de PDF Config y Preview */}
        {isPdfModalOpen && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl my-8 flex flex-col h-[85vh]">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 shrink-0">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-red-600" /> Configuración de PDF
                </h2>
                <button onClick={() => setIsPdfModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                {/* Columna Izquierda: Controles */}
                <div className="w-full md:w-1/3 border-r border-slate-100 flex flex-col p-6 bg-slate-50 overflow-y-auto">
                  <h3 className="font-bold text-slate-700 mb-2">Campos a imprimir</h3>
                  <p className="text-xs text-slate-500 mb-4">La columna "#" (numeración) se agregará automáticamente al inicio.</p>

                  <div className="flex gap-2 mb-4">
                    <button
                      onClick={() => setSelectedPdfFields(pdfAvailableHeaders)}
                      className="flex-1 text-xs font-bold bg-white border border-slate-200 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Todos
                    </button>
                    <button
                      onClick={() => setSelectedPdfFields([])}
                      className="flex-1 text-xs font-bold bg-white border border-slate-200 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      Ninguno
                    </button>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    {pdfAvailableHeaders.map((h, i) => (
                      <label key={i} className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-transparent hover:border-slate-200">
                        <input
                          type="checkbox"
                          checked={selectedPdfFields.includes(h)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPdfFields([...selectedPdfFields, h]);
                            } else {
                              setSelectedPdfFields(selectedPdfFields.filter(f => f !== h));
                            }
                          }}
                          className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-slate-700">{h}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Columna Derecha: Vista Previa */}
                <div className="w-full md:w-2/3 flex flex-col p-6 bg-slate-200/50 relative">
                  <h3 className="font-bold text-slate-700 mb-2">Vista Previa en Vivo</h3>
                  <div className="relative flex-1 rounded-xl overflow-hidden border border-slate-200 bg-white shadow-inner">
                    {/* Iframe A */}
                    <iframe
                      src={previewUrls.a ? `${previewUrls.a}#toolbar=0` : 'about:blank'}
                      className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${activeFrame === 'a' && previewUrls.a ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      title="PDF Preview A"
                    />

                    {/* Iframe B */}
                    <iframe
                      src={previewUrls.b ? `${previewUrls.b}#toolbar=0` : 'about:blank'}
                      className={`absolute inset-0 w-full h-full border-0 transition-opacity duration-300 ${activeFrame === 'b' && previewUrls.b ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                      title="PDF Preview B"
                    />

                    {/* Loader inicial */}
                    {!previewUrls.a && !previewUrls.b && (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400 z-20 bg-white">
                        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3 shrink-0 bg-white rounded-b-2xl">
                <button
                  onClick={() => setIsPdfModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDownloadPdf}
                  disabled={selectedPdfFields.length === 0}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Download className="h-5 w-5" /> Descargar PDF Definitivo
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      <SocioLotesModal 
        isOpen={isLotesModalOpen}
        onClose={() => setIsLotesModalOpen(false)}
        socioCodigo={(editingRow?.['CÓDIGO'] || editingRow?.['CODIGO'] || '').toString()}
        socioNombre={`${editingRow?.['NOMBRES'] || ''} ${editingRow?.['APELLIDOS'] || ''}`.trim()}
        socioFinca={(editingRow?.['NOMBRE DE LA FINCA'] || editingRow?.['FINCA'] || '').toString().trim()}
      />

      {/* Floating Action Button for Migration (Admin Only) */}
      {data.length > 0 && (
        <button
          onClick={migrateToSupabase}
          disabled={isMigrating}
          className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center group"
          title="Migrar datos a base de datos relacional"
        >
          {isMigrating ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              <Database className="h-6 w-6 group-hover:scale-110 transition-transform" />
              <span className="max-w-0 overflow-hidden group-hover:max-w-[200px] transition-all duration-300 ease-in-out whitespace-nowrap group-hover:ml-2 font-bold">
                Migrar a Supabase
              </span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
