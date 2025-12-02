import { Venta } from "./venta";

export class Comprobante {
  id: number;              
  tipo: string;
  formato: string;
  numero: string;
  venta: Venta;          
}
