import express from 'express'
import userController from '~/controller/user.controller'
import { authentication } from '~/middleware/authentication'
import { updateValidator } from '~/middleware/validator/user.validator'

const router = express.Router()
router.get('/all', userController.getAllUser)
router.use(authentication)
router.get('', userController.getCurrentUser)
router.put('/update', updateValidator, userController.updateUser)
router.delete('', userController.deleteCurrentUser)
export default router
