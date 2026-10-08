import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { s3StorageService } from './s3StorageService';

export interface Banner {
  id?: string;
  imageUrl: string;
  linkTo: string;
  active: boolean;
  order: number;
  createdAt?: any;
}

/**
 * Servicio para gestionar los banners del Hero Slider en Firestore y Backblaze B2 S3 Storage
 */
export const bannersService = {
  /**
   * Subir imagen a Backblaze B2 via S3 Proxy
   */
  async uploadImage(file: File): Promise<string> {
    try {
      return await s3StorageService.uploadFile(file, 'banners');
    } catch (error) {
      console.error('Error al subir imagen a B2 S3:', error);
      throw error;
    }
  },

  /**
   * Eliminar imagen de Backblaze B2 S3
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      await s3StorageService.deleteFile(imageUrl);
    } catch (error) {
      console.error('Error al eliminar imagen de B2 S3:', error);
    }
  },
  /**
   * Obtener todos los banners activos ordenados
   */
  async getBanners(): Promise<Banner[]> {
    try {
      const bannersRef = collection(db, 'banners');
      const q = query(bannersRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Banner[];
    } catch (error) {
      console.error('Error al obtener banners:', error);
      return [];
    }
  },

  /**
   * Obtener solo banners activos
   */
  async getActiveBanners(): Promise<Banner[]> {
    try {
      const bannersRef = collection(db, 'banners');
      const q = query(bannersRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);
      
      // Filtrar activos en el cliente
      const allBanners = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Banner[];
      
      return allBanners.filter(banner => banner.active);
    } catch (error) {
      console.error('Error al obtener banners activos:', error);
      return [];
    }
  },

  /**
   * Crear un nuevo banner
   */
  async createBanner(banner: Omit<Banner, 'id'>): Promise<string> {
    try {
      const bannersRef = collection(db, 'banners');
      const docRef = await addDoc(bannersRef, {
        ...banner,
        createdAt: new Date()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error al crear banner:', error);
      throw error;
    }
  },

  /**
   * Actualizar un banner existente
   */
  async updateBanner(id: string, banner: Partial<Banner>): Promise<void> {
    try {
      const bannerRef = doc(db, 'banners', id);
      await updateDoc(bannerRef, banner);
    } catch (error) {
      console.error('Error al actualizar banner:', error);
      throw error;
    }
  },

  /**
   * Eliminar un banner y su imagen
   */
  async deleteBanner(id: string, imageUrl: string): Promise<void> {
    try {
      // Eliminar imagen de Storage
      await this.deleteImage(imageUrl);
      
      // Eliminar documento de Firestore
      const bannerRef = doc(db, 'banners', id);
      await deleteDoc(bannerRef);
    } catch (error) {
      console.error('Error al eliminar banner:', error);
      throw error;
    }
  },

  /**
   * Activar/Desactivar un banner
   */
  async toggleBannerActive(id: string, active: boolean): Promise<void> {
    try {
      const bannerRef = doc(db, 'banners', id);
      await updateDoc(bannerRef, { active });
    } catch (error) {
      console.error('Error al cambiar estado del banner:', error);
      throw error;
    }
  }
};
