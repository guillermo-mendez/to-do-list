import { Router } from 'express';
import categoriesController from '../controllers/CategoriesController';
import { catchAsync } from 'error-handler-express-ts';
const router = Router();

router.get('/', catchAsync(categoriesController.getCategories)); // Obtener todas las categoria del usuario autenticado
router.post('/', catchAsync(categoriesController.createCategory)); // Crear nueva categoria
router.put('/:id', catchAsync(categoriesController.updateCategory)); // Actualizar categoria
router.delete('/:id', catchAsync(categoriesController.deleteCategory)); // Eliminar categoria


export default router;