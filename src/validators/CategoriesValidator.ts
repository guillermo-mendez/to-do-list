import * as yup from 'yup';
import {validateSchema} from "./ValidateSchema";

class AuthValidator {
  /**
   * Valida los datos crear categoria.
   * @param data - Datos a validar.
   */
  public createCategoryValidation(data: any) {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required('Debe ingresar el nombre de la categoria'),
      color: yup
        .string()
        .required('Debe ingresar el color de la categoria'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos de actualizar categoria.
   * @param data - Datos a validar.
   */
  public updateTaskValidation(data: any) {
    const schema = yup.object().shape({
      categoryId: yup
        .string()
        .required('El campo ID de categoria es requerido'),
      name: yup
        .string()
        .required('Debe ingresar el nombre de la categoria'),
      color: yup
        .string()
        .required('Debe ingresar el color de la categoria'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos de eliminar una categoria.
   * @param data - Datos a validar.
   */
  public deleteTaskValidation(data: any) {
    const schema = yup.object().shape({
      categoryId: yup
        .string()
        .required('El campo ID de categoria es requerido'),
    });
    validateSchema(schema, data);
  }

}

export default new AuthValidator();
