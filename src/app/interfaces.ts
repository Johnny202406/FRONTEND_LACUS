export interface User {
  id: number;
  sub: string;
  nombre: string;
  apellido: string;
  dni?: string | null;
  numero?: string | null;
  correo: string;
  habilitado: boolean;
  id_tipo_usuario: TypeUser;
}

export interface TypeUser {
  id: number;
  nombre: string;
  users?: User[];
}

export interface UpdateUser {
  nombre: string;
  apellido: string;
  dni:number;
  numero: number;
}
