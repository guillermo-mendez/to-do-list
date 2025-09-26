import { Router } from 'express';
import etiquetasController from '../controllers/EtiquetasController';
import { catchAsync } from 'error-handler-express-ts';
const router = Router();

router.get('/', catchAsync(etiquetasController.getEtiquetas)); // Obtener todas las etiquetas del usuario autenticado
router.post('/', catchAsync(etiquetasController.createEtiqueta)); // Crear nueva etiquetas
router.put('/:id', catchAsync(etiquetasController.updateEtiqueta)); // Actualizar etiqueta
router.delete('/:id', catchAsync(etiquetasController.deleteEtiqueta)); // Eliminar etiqueta


export default router;