import { Router } from 'express';
import authController from '../controllers/AuthController';
import { catchAsync } from 'error-handler-express-ts';
const router = Router();

router.get('/logout', catchAsync(authController.logout));
router.post('/login', catchAsync(authController.login));
router.post('/refreshToken', catchAsync(authController.refreshToken));
router.post('/roles', catchAsync(authController.getUserRoles));
router.post('/resetPassword', catchAsync(authController.resetPassword));
router.post('/changePassword', catchAsync(authController.changePassword));

export default router;