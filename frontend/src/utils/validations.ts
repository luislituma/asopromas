export function validarIdentificacionEcuador(id: string, tipoIdentificacion: 'cedula' | 'ruc'): { valido: boolean; error?: string } {
  if (!id) return { valido: false, error: 'Identificación vacía' };
  
  const cleanId = id.trim();
  
  if (tipoIdentificacion === 'cedula' && cleanId.length !== 10) {
    return { valido: false, error: 'La cédula debe tener exactamente 10 dígitos numéricos' };
  }
  
  if (tipoIdentificacion === 'ruc' && cleanId.length !== 13) {
    return { valido: false, error: 'El RUC debe tener exactamente 13 dígitos numéricos' };
  }

  if (!/^\d+$/.test(cleanId)) {
    return { valido: false, error: 'La identificación solo debe contener números' };
  }

  const provincia = parseInt(cleanId.substring(0, 2), 10);
  if (provincia < 1 || (provincia > 24 && provincia !== 30)) {
    return { valido: false, error: 'El código de provincia (primeros 2 dígitos) es inválido' };
  }

  const tercerDigito = parseInt(cleanId.charAt(2), 10);
  
  // Persona Natural (Cédula o RUC terminando en 001)
  if (tercerDigito < 6) {
    if (tipoIdentificacion === 'ruc' && !cleanId.endsWith('001')) {
      return { valido: false, error: 'El RUC de persona natural debe terminar en 001' };
    }
    
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      let valor = parseInt(cleanId.charAt(i), 10) * coeficientes[i];
      if (valor > 9) valor -= 9;
      suma += valor;
    }
    const digitoVerificador = parseInt(cleanId.charAt(9), 10);
    const decenaSuperior = Math.ceil(suma / 10) * 10;
    let calculado = decenaSuperior - suma;
    if (calculado === 10) calculado = 0;
    
    if (calculado !== digitoVerificador) {
      return { valido: false, error: 'Dígito verificador de cédula/RUC incorrecto' };
    }
    return { valido: true };
  } 
  
  // Sociedad Privada / Extranjeros (RUC) - tercer dígito = 9
  if (tercerDigito === 9) {
    if (tipoIdentificacion !== 'ruc') return { valido: false, error: 'El tercer dígito 9 es exclusivo para RUC de empresas privadas' };
    if (!cleanId.endsWith('001')) return { valido: false, error: 'El RUC debe terminar en 001' };
    
    const coeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    for (let i = 0; i < 9; i++) {
      suma += parseInt(cleanId.charAt(i), 10) * coeficientes[i];
    }
    const digitoVerificador = parseInt(cleanId.charAt(9), 10);
    let calculado = 11 - (suma % 11);
    if (calculado === 11) calculado = 0;
    
    if (calculado !== digitoVerificador) {
      return { valido: false, error: 'Dígito verificador de RUC de empresa incorrecto' };
    }
    return { valido: true };
  }
  
  // Entidad Pública (RUC) - tercer dígito = 6
  if (tercerDigito === 6) {
    if (tipoIdentificacion !== 'ruc') return { valido: false, error: 'El tercer dígito 6 es exclusivo para RUC público' };
    
    const coeficientes = [3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;
    for (let i = 0; i < 8; i++) {
      suma += parseInt(cleanId.charAt(i), 10) * coeficientes[i];
    }
    const digitoVerificador = parseInt(cleanId.charAt(8), 10);
    let calculado = 11 - (suma % 11);
    if (calculado === 11) calculado = 0;
    
    if (calculado !== digitoVerificador) {
      return { valido: false, error: 'Dígito verificador de entidad pública incorrecto' };
    }
    return { valido: true };
  }
  
  return { valido: false, error: 'El tercer dígito es inválido para una identificación ecuatoriana' };
}
