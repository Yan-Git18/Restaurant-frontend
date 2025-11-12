import { Cliente } from "./cliente";
import { Mesa } from "./mesa";
import { Usuario } from "./usuario";

export class Pedido{
    idPedido: number;
    estado: string;
    fecha: Date;
    cliente: Cliente;
    mesa: Mesa;
    usuario: Usuario;
}