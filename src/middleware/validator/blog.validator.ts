import { NextFunction, Request, Response } from 'express'
import { z } from 'zod'
import { BadRequestError } from '~/middleware/error.middleware'
enum BlogStatus {
  draft = 'draft',
  published = 'published'
}
const BlogSchema = z.object({
  title: z.string().nonempty('Title is Required').max(200, 'Title must be at most 200 characters').trim(),
  content: z.string().nonempty('Title is Required').trim(),
  status: z.enum([BlogStatus.draft, BlogStatus.published]).optional()
})
export type BlogBodyType = z.infer<typeof BlogSchema>
const createBlogValidator = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = BlogSchema.safeParse(req.body)
    if (!result.success) {
      const errorMessages = result.error.issues.map((issue) => issue.message).join(', ')
      throw new BadRequestError(`Validation failed: ${errorMessages}`)
    }
    req.body = {
      ...req.body,
      ...result.data
    }
    next()
  } catch (error) {
    next(error) // Pass error to error middleware
  }
}

export { createBlogValidator }
