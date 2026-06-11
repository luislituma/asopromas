import { kml } from '@tmcw/togeojson';
import JSZip from 'jszip';

export const parseKMLToGeoJSON = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const isKmz = file.name.toLowerCase().endsWith('.kmz');

    const processText = (text: string) => {
      try {
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'text/xml');
        
        // Verificar si hay errores de parsing XML
        const parseError = xml.querySelector('parsererror');
        if (parseError) {
          throw new Error('El archivo no es un KML/XML válido.');
        }

        const geojson = kml(xml);
        
        // Buscar el primer polígono o geometría válida
        const features = geojson.features;
        if (!features || features.length === 0) {
          throw new Error('No se encontraron geometrías en el archivo KML/KMZ.');
        }

        // Devolver la colección completa para que se dibuje
        resolve(geojson);
      } catch (err) {
        reject(err);
      }
    };

    if (isKmz) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const zip = await JSZip.loadAsync(buffer);
          
          // Buscar el primer archivo .kml dentro del zip
          let kmlFileName = '';
          zip.forEach((relativePath, zipEntry) => {
            if (relativePath.toLowerCase().endsWith('.kml') && !zipEntry.dir) {
              kmlFileName = relativePath;
            }
          });

          if (!kmlFileName) {
            throw new Error('El archivo KMZ no contiene un archivo KML válido.');
          }

          const text = await zip.file(kmlFileName)!.async('text');
          processText(text);
        } catch (error) {
          reject(new Error('Error al extraer el archivo KMZ: ' + (error as Error).message));
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo KMZ.'));
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        processText(text);
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo KML.'));
      reader.readAsText(file);
    }
  });
};
