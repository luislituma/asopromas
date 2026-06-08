import { useState, useEffect, useRef } from 'react';
import { Upload, Download, Search, Plus, Trash2, Save, X, FileText, LogIn, Loader2, LogOut, Settings } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export default function SociosDirectorio() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [data, setData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchColumn, setSearchColumn] = useState('all');
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

  // Modal PDF
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [selectedPdfFields, setSelectedPdfFields] = useState<string[]>([]);

  // Double buffering for PDF to prevent flickering
  const [previewUrls, setPreviewUrls] = useState({ a: null as string | null, b: null as string | null });
  const [activeFrame, setActiveFrame] = useState<'a' | 'b'>('a');
  const frameRef = useRef<'a' | 'b'>('a');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check auth session on load
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

    // 2. Extraer CÓDIGO
    const codigoIndex = sorted.findIndex(h => h.toLowerCase().includes('código') || h.toLowerCase().includes('codigo'));
    let insertIndex = 0;
    if (codigoIndex >= 0) {
      const codigoHeader = sorted.splice(codigoIndex, 1)[0];
      sorted.splice(0, 0, codigoHeader);
      insertIndex = 1;
    }

    // 3. Insertar APELLIDOS y NOMBRES en orden
    if (apellidosHeader) {
      sorted.splice(insertIndex, 0, apellidosHeader);
      insertIndex++;
    }
    if (nombresHeader) {
      sorted.splice(insertIndex, 0, nombresHeader);
    }

    return sorted;
  };

  // Fetch data when user is authenticated
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setIsLoadingData(true);
      const { data: dbData, error } = await supabase
        .from('directorio_temporal')
        .select('*')
        .eq('id', 1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error("Error cargando de Supabase:", error);
      } else if (dbData) {
        setData(dbData.socios_data || []);
        setHeaders(reorderHeaders(dbData.headers || []));
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
          // Convertir a mayúsculas
          if (typeof newRow[h] === 'string') {
            const upperVal = newRow[h].toUpperCase();
            if (newRow[h] !== upperVal) {
              newRow[h] = upperVal;
              needsFix = true;
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

      if (needsFix) {
        saveData(finalData, newHeaders);
      }
    }
  }, [data, headers, isLoadingData]);

  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    if (searchColumn !== 'all') {
      const val = row[searchColumn] ? row[searchColumn].toString().toLowerCase() : '';
      return val.includes(term);
    }
    return Object.values(row).some(v =>
      v ? v.toString().toLowerCase().includes(term) : false
    );
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

  // Generar filtros rápidos dinámicos si es una columna geográfica
  const isGeoColumn = searchColumn.toLowerCase().match(/provincia|canton|cantón|parroquia|comunidad/);
  const quickFilters = isGeoColumn ? Array.from(new Set(data.map(row => row[searchColumn]).filter(Boolean))).sort() : [];

  // Filtrar columnas de numeración del CSV para que no aparezcan en el PDF (ya que el PDF genera su propio '#')
  const pdfAvailableHeaders = headers.filter(h => !/^(n°|nro\.?|no\.?|número|numero|#)$/i.test(h.trim()));

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

  const saveData = async (newData: any[], newHeaders: string[]) => {
    setData(newData);
    setHeaders(newHeaders);
    setIsSaving(true);

    const { error } = await supabase
      .from('directorio_temporal')
      .update({
        socios_data: newData,
        headers: newHeaders,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) {
      alert("Error guardando en la nube: " + error.message);
      console.error(error);
    }

    setIsSaving(false);
  };

  // Simple CSV Parser
  const parseCSV = (text: string) => {
    const lines = text.split('\n');
    if (lines.length === 0) return;

    const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const parsedData = [];

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

    saveData(parsedData, reorderHeaders(rawHeaders));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);

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

    try {
      // Cargar logo
      const base64Logo = await getBase64Image('/Logo-Asopromas-Completo.jpg');
      if (base64Logo) {
        doc.addImage(base64Logo, 'JPEG', 14, 10, 45, 18);
      }

      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text('Directorio de Socios Asopromas', 65, 18);
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // slate-500

      const subtitle = getDynamicSubtitle();
      doc.text(`${subtitle} | Total exportados: ${filteredData.length}`, 65, 25);

    } catch (error) {
      doc.setFontSize(16);
      doc.text('Directorio de Socios Asopromas', 14, 15);
      doc.setFontSize(10);
      const subtitle = getDynamicSubtitle();
      doc.text(`${subtitle} | Total exportados: ${filteredData.length}`, 14, 22);
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
      startY: 35,
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

    // Validar Cédula/Identificación antes de guardar
    const cedulaKey = headers.find(h => {
      const lowerH = h.toLowerCase();
      return lowerH.includes('identificacion') || lowerH.includes('identificación') || lowerH.includes('cédula') || lowerH.includes('cedula');
    });
    if (cedulaKey && editingRow[cedulaKey]) {
      const cedulaVal = editingRow[cedulaKey].toString().trim();
      if (cedulaVal.length > 0 && !validarCedulaEcuatoriana(cedulaVal)) {
        alert("El número de cédula ingresado no es válido. Verifica que los 10 dígitos sean correctos.");
        return;
      }
    }

    // Forzar mayúsculas antes de guardar
    const upperEditingRow: any = {};
    for (const key in editingRow) {
      if (typeof editingRow[key] === 'string') {
        upperEditingRow[key] = editingRow[key].toUpperCase();
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
              {user?.email?.toLowerCase().trim() !== 'invitado@asopromas.com' && (
                <>
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    <Upload className="h-4 w-4" /> Importar CSV
                  </button>

                  <button
                    onClick={() => setIsFieldsModalOpen(true)}
                    disabled={data.length === 0}
                    className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    <Settings className="h-4 w-4" /> Administrar Campos
                  </button>
                </>
              )}

              <button
                onClick={handleExportExcel}
                disabled={data.length === 0}
                className="flex items-center gap-2 bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-4 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50"
              >
                <Download className="h-4 w-4" /> Excel
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
                      {headers.map((h, i) => (
                        <option key={i} value={h}>Solo en: {h}</option>
                      ))}
                    </select>

                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        placeholder={searchColumn === 'all' ? "Buscar por cualquier campo..." : `Buscar en ${searchColumn}...`}
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
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4 whitespace-nowrap w-16 text-center">#</th>
                        {headers.map((h, i) => (
                          <th
                            key={i}
                            className="px-6 py-4 whitespace-nowrap cursor-pointer hover:bg-slate-200 transition-colors select-none"
                            onClick={() => requestSort(h)}
                            title={`Click para ordenar por ${h}`}
                          >
                            <div className="flex items-center gap-2">
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
                          onClick={() => openModal(row, data.indexOf(row))}
                          className="hover:bg-orange-50/50 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-center font-bold text-slate-400">
                            {rowIndex + 1}
                          </td>
                          {headers.map((h, colIndex) => (
                            <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                              {row[h] || '-'}
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
                <h2 className="text-xl font-bold text-slate-800">
                  {editingIndex !== null ? 'Editar Socio' : 'Nuevo Socio'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={saveModal} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 pb-2">
                  {headers.map((h, i) => (
                    <div key={i} className="space-y-1">
                      <label className="text-xs font-bold text-slate-500 uppercase">{h}</label>
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
                      <span className="font-medium text-slate-700">{h}</span>
                      <button
                        onClick={() => handleDeleteField(h)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title={`Eliminar campo: ${h}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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
    </div>
  );
}
