export type UserRole = 'estudiante' | 'profesor' | 'administrativo';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (
    username: string,
    password: string,
    email: string,
    firstName?: string,
    lastName?: string,
    role?: UserRole
  ) => Promise<boolean>;
  logout: () => void;
}

export interface Course {
  id: number;
  nombre: string;
  descripcion: string;
  dias: string[];
  horas: {
    start_time: string;
    end_time: string;
  };
  profesor?: number | null;
  profesor_details?: User | null; // Campo para los detalles completos del profesor
  estudiantes?: number[];
  estudiantes_details?: Student[]; // Campo para los detalles completos de los estudiantes
  cantidad_notas?: number | null;
}

export interface Student {
  id: number;
  user_details: User;
  grado: string;
}

export interface StudentRowType {
  id: number;
  avatarSrc?: string;
  name: string;
  username: string;
  email: string;
  iconClass: string;
  roleIcon?: string;
  role: UserRole;
  status: string;
}

export interface Grade {
  id: number;
  curso: number;
  estudiante: number;
  calificacion: number;
  descripcion: string | null;
  fecha_evaluacion: string;
}

export interface GradeInput {
  estudiante: number;
  calificacion: number;
  descripcion?: string;
  fecha_evaluacion: string;
}
