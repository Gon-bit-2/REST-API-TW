'use strict'
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary'
import 'dotenv/config'
import { logger } from '~/log/logger'
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: process.env.NODE_ENV === 'production'
})
console.log(cloudinary.config)
const uploadCloudinary = (
  buffer: Buffer<ArrayBufferLike>,
  publicId?: string
): Promise<UploadApiResponse | undefined> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          allowed_formats: ['png', 'jpg', 'webp'],
          resource_type: 'image',
          folder: 'blog-api',
          public_id: publicId,
          transformation: {
            quality: 'auto'
          }
        },
        (err, result) => {
          if (err) {
            logger.error('Error Upload Image to Cloudinary', err)
            reject(err)
          }
          resolve(result)
        }
      )
      .end(buffer)
  })
}
export { uploadCloudinary, cloudinary }
