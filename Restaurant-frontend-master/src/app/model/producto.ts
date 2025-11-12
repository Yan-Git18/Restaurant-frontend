import { Categoria } from "./categoria";
import { Inventario } from "./inventario";

export class Producto{
    id: number;
    nombre: String;
    precio: number;
    categoria: Categoria;
    inventario: Inventario;
    descripcion: string;
    stockActual: number;
}