export interface CreateTask {
  userId?: string;
  categoriaId: string;
  prioridadId: string;
  titulo: string;
  descripcion: string;
  fechaVencimiento: string;
}

export interface UpdateTask {
  categoriaId: string;
  prioridadId: string;
  titulo: string;
  descripcion: string;
  fechaVencimiento: string;
}
