import express from 'express'
import { uploadDisk, uploadMemory } from '~/config/multer.config'
import blogController from '~/controller/blog.controller'
import { authentication } from '~/middleware/authentication'
import { uploadBanner } from '~/middleware/upload.middleware'
import { createBlogValidator } from '~/middleware/validator/blog.validator'

const router = express.Router()
router.use(authentication)
router.post('', uploadMemory.single('file'), uploadBanner('post'), createBlogValidator, blogController.createBlog)
export default router
