'use strict'

import mongoDB from '~/db/mongoDatabase'
import crypto from 'crypto'
import { IUser } from '~/model/schema/user.model'
import { genUsername } from '~/utils/genUserName'
import { hashPassword } from '~/utils/hashPassword'
import { createTokenPair } from '~/utils/jwt'
import keyTokenService from '~/services/token.service'
import { getInfoData } from '~/utils/info'
import { logger } from '~/log/logger'
import { BadRequestError } from '~/middleware/error.middleware'
type userData = Pick<IUser, 'email' | 'password' | 'role'>
class AuthService {
  registerUser = async ({ email, password, role }: userData) => {
    const username = await genUsername()
    const hashPw = await hashPassword(password)
    const foundUser = await mongoDB.user.findOne({ email: email })
    if (foundUser) {
      logger.warn('Email đã tồn tại trong hệ thống')
      throw new BadRequestError('Email đã tồn tại trong hệ thống') // Ném lỗi thay vì return
    }
    const newUser = await mongoDB.user.create({
      username,
      email,
      password: hashPw,
      role
    })
    if (newUser) {
      const privateKey = crypto.randomBytes(64).toString('hex')
      const publicKey = crypto.randomBytes(64).toString('hex')
      const tokens = await createTokenPair({ userId: newUser.id, email }, publicKey, privateKey)
      const keyStore = await keyTokenService.createKeyToken({
        userId: newUser._id.toString(),
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken
      })
      if (!keyStore) {
        return {
          code: 'xxxx',
          message: 'publicKey error'
        }
      }
      logger.info('User created successfully', getInfoData({ fields: ['_id', 'name', 'email'], object: newUser }))
      return {
        code: 201,
        metadata: {
          user: getInfoData({ fields: ['_id', 'name', 'email'], object: newUser }),
          tokens
        }
      }
    }
    return {
      code: 200,
      metadata: null
    }
  }
}
const authService = new AuthService()
export default authService
