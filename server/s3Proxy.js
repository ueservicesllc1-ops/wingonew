import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME || 'wingonew';
const B2_ENDPOINT = process.env.B2_ENDPOINT || 'https://s3.us-east-005.backblazeb2.com';
const B2_REGION = process.env.B2_REGION || 'us-east-005';
const B2_ACCESS_KEY_ID = process.env.B2_ACCESS_KEY_ID || '005c2b526be0baa0000000041';
const B2_SECRET_ACCESS_KEY = process.env.B2_SECRET_ACCESS_KEY || 'K005AvC5bsGi/c24/xL3QX4EBoHOtNs';

// Inicializar cliente AWS S3 configurado para Backblaze B2
export const s3Client = new S3Client({
  endpoint: B2_ENDPOINT,
  region: B2_REGION,
  credentials: {
    accessKeyId: B2_ACCESS_KEY_ID,
    secretAccessKey: B2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // Requerido para Backblaze B2 S3 API
});

// Configurar multer en memoria para recibir archivos
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB max file size
  },
});

export const router = express.Router();

/**
 * POST /api/upload
 * Sube un archivo a Backblaze B2 via S3 API y retorna la URL pública
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se envió ningún archivo' });
    }

    const folder = req.body.folder || 'uploads';
    const timestamp = Date.now();
    const cleanFileName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `${folder}/${timestamp}_${cleanFileName}`;

    const command = new PutObjectCommand({
      Bucket: B2_BUCKET_NAME,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });

    await s3Client.send(command);

    // URL pública formateada para Backblaze B2 S3 / Native download URL
    const publicUrl = `https://f005.backblazeb2.com/file/${B2_BUCKET_NAME}/${key}`;

    return res.json({
      success: true,
      url: publicUrl,
      key: key,
      fileName: cleanFileName,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('Error al subir archivo a Backblaze B2 S3:', error);
    return res.status(500).json({
      error: 'Error al subir el archivo al almacenamiento B2',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

/**
 * DELETE /api/upload
 * Elimina un archivo de Backblaze B2 pasando el 'url' o 'key'
 */
router.delete('/upload', async (req, res) => {
  try {
    const { url, key: inputKey } = req.body;
    let key = inputKey;

    if (!key && url) {
      // Extraer la Key de la URL pública si solo viene la URL
      const prefix = `/file/${B2_BUCKET_NAME}/`;
      const idx = url.indexOf(prefix);
      if (idx !== -1) {
        key = url.substring(idx + prefix.length);
      } else {
        const s3Prefix = `${B2_BUCKET_NAME}/`;
        const s3Idx = url.indexOf(s3Prefix);
        if (s3Idx !== -1) {
          key = url.substring(s3Idx + s3Prefix.length);
        }
      }
    }

    if (!key) {
      return res.status(400).json({ error: 'No se especificó la key o url del archivo a eliminar' });
    }

    const command = new DeleteObjectCommand({
      Bucket: B2_BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);

    return res.json({ success: true, message: 'Archivo eliminado de B2 correctamente', key });
  } catch (error) {
    console.error('Error al eliminar archivo de Backblaze B2:', error);
    return res.status(500).json({
      error: 'Error al eliminar el archivo',
      details: error instanceof Error ? error.message : String(error)
    });
  }
});

export default router;
