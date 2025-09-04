import { NextFunction, Request, Response } from 'express'
import { AuthFailureError } from '~/middleware/error.middleware'
import keyTokenService from '~/services/token.service'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { logger } from '~/log/logger'

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'refreshtoken'
}

const authentication = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.headers[HEADER.CLIENT_ID] as string
  if (!userId) throw new AuthFailureError('Invalid Request')

  const keyStore = await keyTokenService.findByUserId(userId)
  if (!keyStore) throw new AuthFailureError('Not found keyStore')
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      //xử phần lấy lại cặp key
      const refreshToken = req.headers[HEADER.REFRESHTOKEN]
      if (!refreshToken || Array.isArray(refreshToken)) throw new AuthFailureError('REFRESHTOKEN IN VALID')
      const decodeUser = jwt.verify(refreshToken, keyStore.privateKey)
      if (typeof decodeUser !== 'object' || !decodeUser.userId) {
        throw new AuthFailureError('Invalid Token Payload')
      }
      if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')
      req.user = decodeUser
      req.keyStore = keyStore
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      if (error instanceof Error)
        if (error.name === 'TokenExpiredError') {
          throw new AuthFailureError('Token expired. Please relogin.')
        }
      // Các lỗi khác như `JsonWebTokenError` sẽ bị bắt ở đây
      throw new AuthFailureError('Invalid Token')
    }
  }

  //verify token
  const authHeader = req.headers[HEADER.AUTHORIZATION] as string
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthFailureError('Invalid Request')
  }

  // Tách lấy token
  const accessToken = authHeader.split(' ')[1]
  if (!accessToken) throw new AuthFailureError('Invalid Request')

  try {
    const decodeUser = jwt.verify(accessToken, keyStore.publicKey) as JwtPayload & { userId: string }
    if (!decodeUser.userId) {
      throw new AuthFailureError('Invalid Token Payload')
    }
    if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')

    // Convert Mongoose document to plain object
    const keyStoreObject = keyStore.toObject()

    // Gán thông tin vào request và gọi next()
    req.user = decodeUser.userId
    req.keyStore = keyStore
    return next()
  } catch (error) {
    if (error instanceof Error && error.name === 'TokenExpiredError') {
      throw new AuthFailureError('Token expired. Please relogin.')
    }
    logger.error('Error:::', error)
    throw new AuthFailureError('Invalid Token')
  }
}

export { authentication }
