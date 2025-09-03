'use strict'

import mongoose, { Types } from 'mongoose'
import mongoDB from '~/db/mongoDatabase'
import { logger } from '~/log/logger'
import { BadRequestError, ForbiddenError, NotFoundError, ServerErrorResponse } from '~/middleware/error.middleware'
import { UpdateBodyType } from '~/middleware/validator/user.validator'
import { getInfoData } from '~/utils/info'
export type AuthRole = 'admin' | 'user'
class UserService {
  async getAllUser() {
    try {
      const users = await mongoDB.user.find().select('-password -createdAt -updatedAt -__v').lean()
      if (!users) {
        throw new BadRequestError('Danh Sách Rỗng')
      }
      logger.info('Get List user successfully')
      return {
        code: 200,
        metadata: {
          users: users
        }
      }
    } catch (error) {
      logger.error('Get List User Failed', error)
      throw new ServerErrorResponse()
    }
  }
  async getCurrentUser({ userId }: { userId: Types.ObjectId }) {
    const roles: AuthRole[] = ['admin', 'user']
    const foundUser = await mongoDB.user.findById(userId)
    if (!foundUser) {
      logger.warn('Not Found User, pls Register')
      throw new NotFoundError('Not Found User, pls Register')
    }
    if (!roles.includes(foundUser.role)) {
      logger.warn('Access Denied, insufficient permissions')
      throw new ForbiddenError('Access Denied, insufficient permissions')
    }
    return {
      code: 200,
      metadata: {
        user: getInfoData({ fields: ['_id', 'username', 'email', 'role'], object: foundUser })
      }
    }
  }
  async updateUser({ userId, body }: { userId: any; body: UpdateBodyType }) {
    try {
      console.log(body)

      const roles: AuthRole[] = ['admin', 'user']
      const updateUser = await mongoDB.user.findByIdAndUpdate(userId, body, { new: true })
      if (!updateUser) {
        throw new NotFoundError('Not Found User, pls Register')
      }
      if (!roles.includes(updateUser.role)) {
        throw new ForbiddenError('Access Denied, insufficient permissions')
      }
      await updateUser.save()
      logger.info('Update user successfully!')
      return {
        code: 200,
        metadata: {
          user: getInfoData({ fields: ['_id', 'username', 'email', 'role'], object: updateUser })
        }
      }
    } catch (error) {
      console.log(error)
      throw new ServerErrorResponse('Lỗi Update User')
    }
  }
  async deleteCurrentUser({ userId }: { userId: Types.ObjectId }) {
    const roles: AuthRole[] = ['admin', 'user']
    //1: transaction thuộc 1 session,create session
    const session = await mongoose.startSession()
    try {
      //2: tạo transaction
      session.startTransaction()
      //3:delete user
      const deleteUser = await mongoDB.user.findByIdAndDelete(userId, { session })
      if (!deleteUser) {
        throw new BadRequestError('Xóa người dùng không thành công kiểm tra lại')
      }
      //4. xóa token liên quan
      await mongoDB.token.findOneAndDelete(userId, { session })
      //5. Hoàn thành tất cả
      session.commitTransaction()
      logger.info('✅ Xóa người dùng và token thành công!')
      return {
        code: 200,
        message: 'Xóa người dùng thành công'
      }
    } catch (error) {
      // 6. Nếu có lỗi, hủy bỏ mọi thay đổi
      if (session.inTransaction()) {
        await session.abortTransaction()
      }
      logger.error('❌ Lỗi xảy ra, transaction đã được hủy bỏ:', error)
      // Ném lỗi ra ngoài để hàm gọi nó có thể xử lý
      throw error
    } finally {
      // 7. Luôn luôn kết thúc session
      session.endSession()
    }
  }
}
const userService = new UserService()
export default userService
