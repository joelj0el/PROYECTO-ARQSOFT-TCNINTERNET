import { createContext } from 'react';
import type { User } from '../types';

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
