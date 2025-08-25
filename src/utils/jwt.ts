import jwt from 'jsonwebtoken'
import { Types } from 'mongoose'
interface IPayLoad {
  userId: Types.ObjectId
  email: string
}
const createTokenPair = async (payload: IPayLoad, publicKey: string, privateKey: string) => {
  const accessToken = await jwt.sign(payload, publicKey, {
    expiresIn: '2d'
  })
  const refreshToken = await jwt.sign(payload, privateKey, {
    expiresIn: '7d'
  })
  //
  jwt.verify(accessToken, publicKey, (err, decoded) => {
    if (err) {
      console.error(`error verify`, err)
    } else {
      console.log(`decoded verify`, decoded)
    }
  })
  return {
    accessToken,
    refreshToken
  }
}

export { createTokenPair }
