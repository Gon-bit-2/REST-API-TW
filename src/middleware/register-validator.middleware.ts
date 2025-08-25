import { NextFunction, Request, Response } from 'express'
import z from 'zod'
import { BadRequestError } from '~/middleware/error.middleware'

const RegisterUser = z
  .object({
    email: z.string().email().nonempty(),
    password: z.string().min(6).nonempty(),
    confirmPassword: z.string().min(6).nonempty(),
    role: z.string().optional()
  })
  .strict()
  .superRefine(({ password, confirmPassword }) => {
    if (password !== confirmPassword) {
      throw new BadRequestError('Password not match Confirm Password')
    }
  })
const RegisterValidator = (req: Request, res: Response, next: NextFunction) => {
  const validator = RegisterUser.safeParse(req.body)
  if (!validator.success) {
    res.status(400).json({
      errors: validator.error.issues
    })
    return
  }
  next()
}
export { RegisterValidator }
