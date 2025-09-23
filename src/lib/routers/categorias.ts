import { Router } from 'express';
import authController from '../controllers/AuthController';
import { catchAsync } from 'error-handler-express-ts';
const router = Router();

router.get('/', catchAsync(authController.login)); // Obtener todas las categoria del usuario autenticado
router.post('/', catchAsync(authController.login)); // Crear nueva categoria
router.put('/:id', catchAsync(authController.login)); // Actualizar categoria
router.delete('/:id', catchAsync(authController.login)); // Eliminar categoria


export default router;