export enum UserRole {
  ADMIN = 'admin',
  COMERCIAL = 'comercial',
  SUPORTE = 'suporte',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  totalCalls: number;
  averageCallDuration: number;
  successRate: number;
  lastCallAt?: Date;
}

