import { Router } from 'express';
import authController from '../controllers/AuthController';
import { catchAsync } from 'error-handler-express-ts';
const router = Router();

router.get('/perfil', catchAsync(authController.getUserProfile));
router.post('/registro', catchAsync(authController.userRegistration));
router.post('/login', catchAsync(authController.login));
router.post('/refreshToken', catchAsync(authController.refreshToken));

export default router;