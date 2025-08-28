import { NextFunction, Request, Response } from 'express'
import z from 'zod'
enum UserRole {
  user = 'user',
  admin = 'admin'
}
const registerSchema = z
  .object({
    email: z.string().email('Email sai định dạng').nonempty().trim(),
    password: z.string().min(6).nonempty('Password không được rỗng'),
    role: z.enum([UserRole.user, UserRole.admin])
  })
  .extend({
    confirmPassword: z.string().min(6).nonempty('Password không được rỗng')
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'password not match confirmPassword',
        path: ['confirmPassword']
      })
    }
  })
export type RegisterBodyType = z.infer<typeof registerSchema>
const registerValidator = (req: Request, res: Response, next: NextFunction) => {
  const result = registerSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({
      message: 'Validator Fail',
      error: result.error.issues
    })
    return
  }
  req.body = result.data
  next()
}
//
const LoginSchema = z.object({
  email: z.string().email('Email sai định dạng').nonempty().trim(),
  password: z.string().min(6).nonempty('Password không được rỗng')
})
export type LoginBodyType = z.infer<typeof LoginSchema>

const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const result = LoginSchema.safeParse(req.body)
  if (!result.success) {
    res.status(400).json({
      message: 'Validator Fail',
      error: result.error.issues
    })
    return
  }
  req.body = result.data
  next()
}
export { registerValidator, loginValidator }
