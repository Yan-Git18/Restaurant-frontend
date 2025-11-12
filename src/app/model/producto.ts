import { Categoria } from "./categoria";
import { Inventario } from "./inventario";

export class Producto{
    idProducto: number;
    nombre: number;
    precio: number;
    categoria: Categoria;
    inventario: Inventario;
    descripcion: string;
    stockActual: number;
}