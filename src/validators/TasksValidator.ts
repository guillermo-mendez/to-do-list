import * as yup from 'yup';
import {validateSchema} from "./ValidateSchema";

class AuthValidator {
  /**
   * Valida los datos crear tarea.
   * @param data - Datos a validar.
   */
  public createTaskValidation(data: any) {
    const schema = yup.object().shape({
      categoriaId: yup
        .string()
        .required('El campo categoria es requerido'),
      prioridadId: yup
        .string()
        .required('El campo prioridad es requerido'),
      titulo: yup
        .string()
        .required('Debe ingresar un titulo'),
      descripcion: yup
        .string()
        .required('Debe ingresar una descripcion'),
      fechaVencimiento: yup
        .string()
        .required('Debe ingresar una fecha de vencimiento'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos de actualizar tarea.
   * @param data - Datos a validar.
   */
  public updateTaskValidation(data: any) {
    const schema = yup.object().shape({
      taskId: yup
        .string()
        .required('El campo ID de tarea es requerido'),
      categoriaId: yup
        .string()
        .required('El campo categoria es requerido'),
      prioridadId: yup
        .string()
        .required('El campo prioridad es requerido'),
      titulo: yup
        .string()
        .required('Debe ingresar un titulo'),
      descripcion: yup
        .string()
        .required('Debe ingresar una descripcion'),
      fechaVencimiento: yup
        .string()
        .required('Debe ingresar una fecha de vencimiento'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos de eliminar una tarea.
   * @param data - Datos a validar.
   */
  public deleteTaskValidation(data: any) {
    const schema = yup.object().shape({
      taskId: yup
        .string()
        .required('El campo ID de tarea es requerido'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos de eliminar una tarea.
   * @param data - Datos a validar.
   */
  public completeTaskValidation(data: any) {
    const schema = yup.object().shape({
      taskId: yup
        .string()
        .required('El campo ID de tarea es requerido'),
    });
    validateSchema(schema, data);
  }

}

export default new AuthValidator();
