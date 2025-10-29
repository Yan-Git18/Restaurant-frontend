import { Usuario } from "./usuario";

export class Cliente{
    idCliente: number;
    correo: string;
    nombre: string;
    telefono: number;
    direccion: string;
    usuario: Usuario;
}