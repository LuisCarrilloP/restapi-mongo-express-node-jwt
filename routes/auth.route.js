import { Router } from 'express'
import { body } from 'express-validator'
import { infoUser, login, register, refreshToken, logout } from "../controllers/auth.controller.js";
import { requireToken } from '../middlewares/requireToken.js';
import { requireRefreshToken } from '../middlewares/requireRefreshToken.js';
import { loginValidator, registerValidator } from '../middlewares/validatorManager.js';

const router = Router()

router.post('/register', registerValidator, register)
router.post('/login', loginValidator, login)
router.get('/protected',requireToken, infoUser)
router.get('/refresh', requireRefreshToken, refreshToken)
router.get('/logout', logout)

export default router;