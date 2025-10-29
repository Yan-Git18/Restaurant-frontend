import { Cliente } from "./cliente";
import { Rol } from "./rol";

export class Usuario{
    idUsuario: number;
    contraseña: string;
    correo: string;
    nombre: string;
    cliente: Cliente;
    rol: Rol;    
}