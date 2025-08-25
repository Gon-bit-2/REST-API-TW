import express from 'express'
import authController from '~/controller/auth.controller'
import { RegisterValidator } from '~/middleware/register-validator.middleware'
const router = express.Router()
router.post('/register', RegisterValidator, authController.register)
export default router
