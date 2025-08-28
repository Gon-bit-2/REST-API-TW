import express from 'express'
import authController from '~/controller/auth.controller'
import { authentication } from '~/middleware/authentication'
import { loginValidator, registerValidator } from '~/middleware/validator/auth.validator'
const router = express.Router()
router.post('/register', registerValidator, authController.register)
router.use(authentication)
router.post('/refresh-token', authController.refreshToken)
router.post('/login', loginValidator, authController.login)

export default router
