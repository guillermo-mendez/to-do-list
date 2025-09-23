import * as yup from 'yup';
import {validateSchema} from "./ValidateSchema";

class AuthValidator {
  /**
   * Valida los datos del login.
   * @param data - Datos a validar.
   */
  public createTaskValidation(data: any) {
    const schema = yup.object().shape({
      categoriaId: yup
        .number()
        .required('El campo categoria es requerido'),
      titulo: yup
        .string()
        .required('Debe ingresar un titulo'),
      descripcion: yup
        .string()
        .required('Debe ingresar una descripcion'),
      prioridad: yup
        .string()
        .required('Debe ingresar una prioridad'),
      completada: yup
        .string()
        .required('Debe ingresar una prioridad'),
      fechaVencimeinto: yup
        .string()
        .required('Debe ingresar una fecha de vencimiento'),
      completadaEn: yup
        .string()
        .required('Debe ingresar una fecha de completada'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos del registro de usuario.
   * @param data
   */
  public userRegistrationValidation(data: any) {
    const schema = yup.object().shape({
      name: yup
        .string()
        .required('El campo nombre es requerido'),
      email: yup
        .string()
        .required('El campo email es requerido')
        .min(3, 'El email debe tener al menos 3 caracteres'),
      password: yup
        .string()
        .required('Debe ingresar una contraseña')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos del refresh token.
   * @param data - Datos a validar.
   */
  public refreshTokenValidation(data: any) {
    const schema = yup.object().shape({
      refreshToken: yup.string().required('Es necesario un refreshToken'),
    });
    validateSchema(schema, data);
  }
}

export default new AuthValidator();
