export interface UserAuth {
  userId: string;
  userName: string;
  email: string;
  role: string;
}

export interface UserRow {
  userId: string;
  name: string;
  email: string;
  passwordHash: string
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string
}