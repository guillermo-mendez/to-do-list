export interface CreateTask {
  categoriaId: string;
  userId?: string;
  titulo: string;
  descripcion: string;
  prioridad: string;
  completada: string;
  fechaVencimeinto: string;
  completadaEn: string;
}
