/**
 * 🔒 Utilidades para sistema Provably Fair
 * 
 * Permite verificar que cada resultado del juego es justo y no manipulado.
 * Usa SHA256 para verificación criptográfica.
 */

/**
 * Genera un client seed aleatorio
 */
export const generateClientSeed = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Calcula SHA256 de un string
 */
export const sha256 = async (message: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Genera un número de resultado a partir de seeds
 * 
 * @param serverSeed - Seed del servidor (revelado después de la apuesta)
 * @param clientSeed - Seed del cliente (generado antes de la apuesta)
 * @param nonce - Contador de rondas
 * @returns Número entre 1 y 6 (dado estándar)
 */
export const generateResult = async (
  serverSeed: string,
  clientSeed: string,
  nonce: number
): Promise<number> => {
  // Combinar seeds y nonce
  const combined = `${serverSeed}:${clientSeed}:${nonce}`;
  
  // Hash
  const hash = await sha256(combined);
  
  // Tomar los primeros 8 caracteres del hash
  const hex = hash.substring(0, 8);
  
  // Convertir a número decimal
  const decimal = parseInt(hex, 16);
  
  // Mapear a rango 1-6 (dado estándar)
  const result = (decimal % 6) + 1;
  
  return result;
};

/**
 * Verifica que un resultado es válido
 * 
 * @param serverSeed - Server seed revelado
 * @param clientSeed - Client seed usado
 * @param nonce - Nonce de la ronda
 * @param claimedResult - Resultado recibido del servidor
 * @returns true si el resultado es válido
 */
export const verifyResult = async (
  serverSeed: string,
  clientSeed: string,
  nonce: number,
  claimedResult: number
): Promise<boolean> => {
  const computedResult = await generateResult(serverSeed, clientSeed, nonce);
  return computedResult === claimedResult;
};

/**
 * Verifica que el server seed hash coincide con el server seed
 * 
 * @param serverSeed - Server seed revelado
 * @param serverSeedHash - Hash que se mostró antes de la apuesta
 * @returns true si coinciden
 */
export const verifyServerSeed = async (
  serverSeed: string,
  serverSeedHash: string
): Promise<boolean> => {
  const computed = await sha256(serverSeed);
  return computed === serverSeedHash;
};

/**
 * Ejemplo de flujo completo de verificación:
 * 
 * 1. Servidor muestra serverSeedHash (antes de apuesta)
 * 2. Cliente genera clientSeed
 * 3. Cliente apuesta
 * 4. Servidor revela serverSeed y resultado
 * 5. Cliente verifica:
 *    a) sha256(serverSeed) === serverSeedHash
 *    b) generateResult(serverSeed, clientSeed, nonce) === resultado
 * 
 * Si ambas verificaciones pasan, el resultado es provably fair.
 */

export default {
  generateClientSeed,
  sha256,
  generateResult,
  verifyResult,
  verifyServerSeed
};

