import { Router } from 'express';
import authController from '../controllers/AuthController';
import { catchAsync } from 'error-handler-express-ts';
const router = Router();

router.get('/', catchAsync(authController.login)); // Obtener todas las etiquetas del usuario autenticado
router.post('/', catchAsync(authController.login)); // Crear nueva etiquetas

export default router;