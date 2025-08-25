'use strict'
import { Request, Response } from 'express'
import 'dotenv/config'
import { SuccessResponse } from '~/middleware/success.response'
import { ServerErrorResponse } from '~/middleware/error.middleware'
import { logger } from '~/log/logger'
import { IUser } from '~/model/schema/user.model'
import authService from '~/services/auth.service'
type userData = Pick<IUser, 'email' | 'password' | 'role'>
export class AuthController {
  /**
   *
   */
  async register(req: Request, res: Response): Promise<void> {
    // Logic xử lý register ở đây
    try {
      const { email, password, role } = req.body as userData
      const newUser = await authService.registerUser({ email, password, role })
      new SuccessResponse({
        message: 'New User Created',
        metadata: newUser
      }).send(res)
    } catch (error) {
      logger.error('Error during user registration', error)
      throw new ServerErrorResponse()
    }
  }
}

const authController = new AuthController()
export default authController
