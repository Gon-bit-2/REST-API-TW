import { NextFunction, Request, Response } from 'express'
import z from 'zod'
enum UserRole {
  user = 'user',
  admin = 'admin'
}
const updateSchema = z.object({
  username: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  password: z.string().trim().optional(),
  role: z.enum([UserRole.user, UserRole.admin]).optional(),
  firstName: z.string().trim().optional(),
  lastName: z.string().trim().optional(),
  socialLinks: z.object({
    website: z.string().trim().optional(),
    facebook: z.string().trim().optional(),
    instagram: z.string().trim().optional(),
    x: z.string().trim().optional(),
    youtube: z.string().trim().optional()
  })
})
export type UpdateBodyType = z.infer<typeof updateSchema>
const updateValidator = (req: Request, res: Response, next: NextFunction) => {
  const result = updateSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({
      message: 'update Schema Fail',
      error: result.error.issues
    })
    return
  }
  req.body = result.data
  next()
}
//

export { updateValidator }
