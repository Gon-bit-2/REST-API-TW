'use strict'
import { Request, Response } from 'express'
import 'dotenv/config'
import { SuccessResponse } from '~/middleware/success.response'
import { ServerErrorResponse } from '~/middleware/error.middleware'
import { logger } from '~/log/logger'
import authService from '~/services/auth.service'
import { LoginBodyType, RegisterBodyType } from '~/middleware/validator/auth.validator'
export class AuthController {
  /**
   *
   */
  async register(req: Request, res: Response): Promise<void> {
    // Logic xử lý register ở đây
    try {
      const { email, password, confirmPassword, role } = req.body as RegisterBodyType
      const newUser = await authService.registerUser({ email, password, confirmPassword, role })
      new SuccessResponse({
        message: 'New User Created',
        metadata: newUser.metadata
      }).send(res)
    } catch (error) {
      logger.error('Error during user registration', error)
      throw new ServerErrorResponse()
    }
  }
  async login(req: Request, res: Response): Promise<void> {
    // Logic xử lý register ở đây
    try {
      const { email, password } = req.body as LoginBodyType
      const newUser = await authService.login({ email, password })
      new SuccessResponse({
        message: 'Login Successfully',
        metadata: newUser.metadata
      }).send(res)
    } catch (error) {
      logger.error('Error during user registration', error)
      throw new ServerErrorResponse()
    }
  }
  async refreshToken(req: Request, res: Response): Promise<void> {
    console.log('Check User::::', req.user)

    try {
      const tokens = await authService.refreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore
      })

      new SuccessResponse({
        message: 'created new tokens',
        metadata: tokens
      }).send(res)
    } catch (error) {
      logger.error('Error during user registration', error)
      throw new ServerErrorResponse()
    }
  }
}

const authController = new AuthController()
export default authController
