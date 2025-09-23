import { Router } from 'express';
import tasksController from '../controllers/TasksController';
import { catchAsync } from 'error-handler-express-ts';
const router = Router();

router.get('/', catchAsync(tasksController.getTasks)); // Obtener todas las tareas del usuario autenticado
router.post('/', catchAsync(tasksController.createTask)); // Crear nueva tarea
router.put('/:id', catchAsync(tasksController.updateTask)); // Actualizar tarea
router.delete('/:id', catchAsync(tasksController.deleteTask)); // Eliminar tarea
router.patch('/:id/completar', catchAsync(tasksController.completeTask)); // Cambiar estado de completado

export default router;