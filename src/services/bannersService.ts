import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '@/config/firebase';

export interface Banner {
  id?: string;
  imageUrl: string;
  linkTo: string;
  active: boolean;
  order: number;
  createdAt?: any;
}

/**
 * Servicio para gestionar los banners del Hero Slider en Firestore y Storage
 */
export const bannersService = {
  /**
   * Subir imagen a Firebase Storage
   */
  async uploadImage(file: File): Promise<string> {
    try {
      const timestamp = Date.now();
      const fileName = `banners/${timestamp}_${file.name}`;
      const storageRef = ref(storage, fileName);
      
      // Subir archivo
      await uploadBytes(storageRef, file);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir imagen:', error);
      throw error;
    }
  },

  /**
   * Eliminar imagen de Firebase Storage
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extraer la ruta del storage desde la URL
      const decodedUrl = decodeURIComponent(imageUrl);
      const startIndex = decodedUrl.indexOf('/o/') + 3;
      const endIndex = decodedUrl.indexOf('?');
      const filePath = decodedUrl.substring(startIndex, endIndex);
      
      const storageRef = ref(storage, filePath);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      // No lanzar error si la imagen no existe
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
