/**
 * Servicio de almacenamiento S3 en Backblaze B2 a través del servidor proxy
 */
export const s3StorageService = {
  /**
   * Subir un archivo al servidor proxy S3 (Backblaze B2)
   * @param file Archivo a subir (File)
   * @param folder Carpeta dentro del bucket B2 (ej: 'banners', 'casino/covers')
   * @returns URL pública del archivo subido
   */
  async uploadFile(file: File, folder: string = 'uploads'): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.details || errorData.error || 'Error al subir archivo a Backblaze B2');
    }

    const data = await response.json();
    return data.url;
  },

  /**
   * Eliminar un archivo de Backblaze B2
   * @param urlOrKey URL pública o Key del archivo
   */
  async deleteFile(urlOrKey: string): Promise<void> {
    if (!urlOrKey) return;
    
    try {
      const response = await fetch('/api/upload', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlOrKey }),
      });

      if (!response.ok) {
        console.warn('Advertencia al eliminar archivo de B2:', await response.text());
      }
    } catch (error) {
      console.error('Error al solicitar eliminación de archivo en B2:', error);
    }
  }
};
