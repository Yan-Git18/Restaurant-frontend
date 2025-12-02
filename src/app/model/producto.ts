import { Categoria } from "./categoria";

export class Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stockActual: number;
    categoriaId: number;
    categoria?: Categoria;
}
