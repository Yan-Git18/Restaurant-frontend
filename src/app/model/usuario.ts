import { Rol } from "./rol";

export class Usuario{
    id: number;
    nombre: string;
    correo: string;
    contrasena: string;
    roles: Rol[]; 
}