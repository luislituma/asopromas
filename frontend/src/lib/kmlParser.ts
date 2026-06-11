import { kml } from '@tmcw/togeojson';

export const parseKMLToGeoJSON = async (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
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
          throw new Error('No se encontraron geometrías en el archivo KML.');
        }

        // Devolver la colección completa para que se dibuje
        resolve(geojson);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo.'));
    reader.readAsText(file);
  });
};
