export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  id: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthUser {
  id: string;
  email: string;
  role: UserRole;
}
