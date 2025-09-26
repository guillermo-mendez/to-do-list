import * as yup from 'yup';
import {validateSchema} from "./ValidateSchema";

class AuthValidator {
  /**
   * Valida los datos crear etiqueta.
   * @param data - Datos a validar.
   */
  public createEtiquetaValidation(data: any) {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required('Debe ingresar el nombre de la etiqueta'),
      color: yup
        .string()
        .required('Debe ingresar el color de la etiqueta'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos de actualizar etiqueta.
   * @param data - Datos a validar.
   */
  public updateEtiquetaValidation(data: any) {
    const schema = yup.object().shape({
      etiquetaId: yup
        .string()
        .required('El campo ID de etiqueta es requerido'),
      name: yup
        .string()
        .required('Debe ingresar el nombre de la etiqueta'),
      color: yup
        .string()
        .required('Debe ingresar el color de la etiqueta'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos de eliminar una etiqueta.
   * @param data - Datos a validar.
   */
  public deleteEtiquetaValidation(data: any) {
    const schema = yup.object().shape({
      etiquetaId: yup
        .string()
        .required('El campo ID de etiqueta es requerido'),
    });
    validateSchema(schema, data);
  }

}

export default new AuthValidator();
