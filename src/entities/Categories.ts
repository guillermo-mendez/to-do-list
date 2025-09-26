export interface CreateCategory {
  userId?: string;
  name: string;
  color: string;
}

export interface UpdateCategory {
  name: string;
  color: string;
}
