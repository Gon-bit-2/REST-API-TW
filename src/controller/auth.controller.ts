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
      logger.error('Error during user refreshToken', error)
      throw new ServerErrorResponse()
    }
  }
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const handleLogout = await authService.logout({ user: req.user, refreshToken: req.refreshToken })
      new SuccessResponse({
        message: 'Logout Success',
        metadata: handleLogout
      }).send(res)
    } catch (error) {
      logger.error('Error during user logout', error)
      throw new ServerErrorResponse()
    }
  }
}

const authController = new AuthController()
export default authController
