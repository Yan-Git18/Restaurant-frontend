import { Venta } from "./venta";

export class Pago{
    idPago: number;
    metodo: string;
    monto: number;
    venta: Venta;
    fechaPago: Date;
}