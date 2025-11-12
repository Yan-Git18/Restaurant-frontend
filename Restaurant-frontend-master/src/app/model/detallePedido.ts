import { Pedido } from "./pedido";
import { Producto } from "./producto";

export class DetallePedido{
    id: number;
    cantidad: number;
    subtotal: number;
    pedido: Pedido;
    producto: Producto;
}