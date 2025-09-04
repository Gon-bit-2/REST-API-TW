'use strict'

import { Request, Response } from 'express'
import { SuccessResponse } from '~/middleware/success.response'
import blogService from '~/services/blog.service'
import { BlogData } from '~/types/blog.type'

class BlogController {
  async createBlog(req: Request, res: Response) {
    const userId = req.user
    const newBlog = await blogService.createBlog({
      blogData: req.body as BlogData,
      userId
    })
    new SuccessResponse({
      message: 'Created Blog Successfully',
      metadata: newBlog
    }).send(res)
  }
}
const blogController = new BlogController()
export default blogController
