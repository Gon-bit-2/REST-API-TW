import { UploadApiErrorResponse } from 'cloudinary'
import { NextFunction, Request, Response } from 'express'
import { uploadCloudinary } from '~/config/cloudinary.config'
import mongoDB from '~/db/mongoDatabase'
import { logger } from '~/log/logger'
import { BadRequestError, ServerErrorResponse } from '~/middleware/error.middleware'

const uploadBanner = (method: 'post' | 'put') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (method === 'put' && !req.file) {
      next()
      return
    }
    if (!req.file) {
      throw new BadRequestError('Blog Banner is required')
    }
    try {
      // if (method === 'put') {
      //   const { blogId } = req.params
      //   const blog = await mongoDB.blog.findById(blogId).select('banner.publicId').exec()
      //   const publicId = blog?.banner.publicId
      // }

      const data = await uploadCloudinary(
        req.file.buffer
        //blog?.banner.publicId('blog-api/,'')
      )
      if (!data) {
        logger.error('Error while uploading blog banner to cloudinary', {
          // blogId,
          // publicId: publicId
        })
        throw new ServerErrorResponse()
      }
      const newBanner = {
        publicId: data.public_id,
        url: data.secure_url,
        width: data.width,
        height: data.height
      }
      logger.info('Blog Banner Upload to Cloudinary success', {
        // blogId,
        banner: newBanner
      })
      req.body.banner = newBanner
      next()
    } catch (err: UploadApiErrorResponse | any) {
      logger.error('Uploading Banner to Cloudinary Error', err)
      if (err instanceof BadRequestError || err instanceof ServerErrorResponse) {
        throw err
      }
      throw new ServerErrorResponse('Error uploading banner to cloudinary')
    }
  }
}

export { uploadBanner }
