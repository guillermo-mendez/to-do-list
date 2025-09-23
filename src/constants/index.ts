export const STATUSES = {
  ACTIVE:{ id: 1, code: 'ACTIVE' }, // El recurso está activo
  INACTIVE: { id: 2, code: 'INACTIVE' }, // El recurso está inactivo
  DELETED: { id: 5, code: 'DELETED' }, // El recurso fue eliminado
};

export const ENDPOINTS_WITH_AUTHORIZATION = [
  '/api/auth/login',
  '/api/auth/refreshToken',
];

export const BASE_ENDPOINT = '/api';

export const ROLES = {
  ADMINISTRADOR: 'Administrador',
};

export const BCRYPT_SALT_ROUNDS = 10;
