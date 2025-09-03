'use strict'

import { Request, Response } from 'express'
import { SuccessResponse } from '~/middleware/success.response'
import userService from '~/services/user.service'

class UserController {
  async getAllUser(req: Request, res: Response) {
    const users = await userService.getAllUser()

    new SuccessResponse({
      message: 'Get List user successfully',
      metadata: users.metadata
    }).send(res)
  }
  async getCurrentUser(req: Request, res: Response) {
    const user = await userService.getCurrentUser({ userId: req.user.userId })
    new SuccessResponse({
      message: 'Get info User success',
      metadata: user.metadata
    }).send(res)
  }
  async updateUser(req: Request, res: Response) {
    const user = await userService.updateUser({ userId: req.user.userId, body: req.body })
    new SuccessResponse({
      message: 'Update User success',
      metadata: user.metadata
    }).send(res)
  }
  async deleteCurrentUser(req: Request, res: Response) {
    const user = await userService.deleteCurrentUser({ userId: req.user.userId })
    new SuccessResponse({
      message: 'delete User success'
    }).send(res)
  }
}
const userController = new UserController()
export default userController
