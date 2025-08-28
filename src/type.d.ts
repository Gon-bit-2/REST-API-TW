import { ObjectId } from 'mongoose'

declare global {
  namespace Express {
    interface Request {
      user?: any
      keyStore?: any
      refreshToken?: any
    }
  }
}

export {}
