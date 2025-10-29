import { Pedido } from "./pedido";
import { Producto } from "./producto";

export class DetallePedido{
    idDetallePedido: number;
    cantidad: number;
    subtotal: number;
    pedido: Pedido;
    producto: Producto;
}