import { Rol } from "./rol";

export class Usuario{
    id: number;
    nombre: string;
    correo: string;
    contrasena: string;
    rol: Rol;    
}