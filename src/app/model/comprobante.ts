import { Venta } from "./venta";

export class Comprobante{
    idComprobante: number;
    formato: string;
    tipo: string;
    venta: Venta;
    numero: number;
}