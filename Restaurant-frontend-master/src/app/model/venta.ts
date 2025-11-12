import { Cliente } from "./cliente";
import { Pedido } from "./pedido";

export class Venta{
    idVenta: number;
    fecha: Date;
    total: number;
    pedido: Pedido;
    cliente: Cliente;
}