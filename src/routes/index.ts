import express from 'express'
const route = express.Router()
import authRouter from './auth'
route.use('/v1/api/auth', authRouter)
