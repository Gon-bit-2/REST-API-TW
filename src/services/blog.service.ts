'use strict'
import DOMPurify from 'dompurify'
import { JSDOM } from 'jsdom'
import { Schema } from 'mongoose'
import mongoDB from '~/db/mongoDatabase'
import { logger } from '~/log/logger'
import { BadRequestError } from '~/middleware/error.middleware'
import { BlogData } from '~/types/blog.type'
class BlogService {
  async createBlog({ blogData, userId }: { blogData: BlogData; userId: Schema.Types.ObjectId }) {
    const { title, content, banner, status } = blogData
    const foundBlog = await mongoDB.blog.findOne({ title })
    if (foundBlog) {
      throw new BadRequestError('Blog đã Tồn Tại')
    }
    const window = new JSDOM('').window
    const purify = DOMPurify(window)
    const cleanContent = purify.sanitize(content)
    const newBlog = await mongoDB.blog.create({
      title,
      content: cleanContent,
      banner,
      status,
      author: userId
    })
    logger.info('created new blog successfully', newBlog)
    return {
      code: 201,
      metadata: {
        blog: newBlog
      }
    }
  }
}

const blogService = new BlogService()
export default blogService
