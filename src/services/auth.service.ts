'use strict'

import mongoDB from '~/db/mongoDatabase'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { genUsername } from '~/utils/genUserName'
import { comparePassword, hashPassword } from '~/utils/hashPassword'
import { createTokenPair } from '~/utils/jwt'
import keyTokenService from '~/services/token.service'
import { getInfoData } from '~/utils/info'
import { logger } from '~/log/logger'
import { AuthFailureError, BadRequestError, ForbiddenError, ServerErrorResponse } from '~/middleware/error.middleware'
import { LoginBodyType, RegisterBodyType } from '~/middleware/validator/auth.validator'
class AuthService {
  registerUser = async ({ email, password, role }: RegisterBodyType) => {
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
  async login({ email, password }: LoginBodyType) {
    const foundUser = await mongoDB.user.findOne({
      email
    })
    if (!foundUser) {
      throw new Error('Người dùng chưa tồn tại')
    }
    // 2. So khớp mật khẩu
    const isMatch = await comparePassword(password, foundUser.password)
    if (!isMatch) throw new AuthFailureError('Sai thông tin xác thực')
    //
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    const tokens = await createTokenPair({ userId: foundUser.id, email }, publicKey, privateKey)
    const keyStore = await keyTokenService.createKeyToken({
      userId: foundUser._id.toString(),
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken
    })
    return {
      code: 200,
      metadata: {
        user: getInfoData({ fields: ['_id', 'name', 'email'], object: foundUser }),
        tokens
      }
    }
  }
  async refreshToken({ refreshToken, user, keyStore }) {
    const { userId, email } = user

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await keyTokenService.deleteKeyById(userId)
      throw new ForbiddenError('Something wrong happend !! Pls reLogin')
    }
    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError('Shop not registered 1')
    }

    //create token mới
    const tokens = await createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey)
    //update
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken //đã sử dụng lấy token mới nên add vô phần đã sử dụng
      }
    })

    return {
      user: { userId, email },
      tokens
    }
  }
}
const authService = new AuthService()
export default authService
