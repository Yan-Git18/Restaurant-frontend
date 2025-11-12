import { Cliente } from "./cliente";
import { DetallePedido } from "./detallePedido";
import { Mesa } from "./mesa";
import { Usuario } from "./usuario";

export class Pedido{
    id: number;
    estado: string;
    fecha: Date;
    cliente: Cliente;
    mesa: Mesa;
    usuario: Usuario;
    detalles: DetallePedido[]=[];
}