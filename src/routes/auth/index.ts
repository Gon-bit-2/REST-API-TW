import express from 'express'
import authController from '~/controller/auth.controller'
const router = express.Router()
router.post('/register', authController.register)
export default router
