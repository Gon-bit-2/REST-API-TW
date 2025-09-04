import express from 'express'
import authRouter from './auth'
import userRouter from './user'
import blogRouter from './blog'

const router = express.Router()
router.use('/v1/api/auth', authRouter)
router.use('/v1/api/user', userRouter)
router.use('/v1/api/blog', blogRouter)

export default router
