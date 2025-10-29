import { Cliente } from "./cliente";
import { Mesa } from "./mesa";

export class Reserva{
    idReseva: number;
    estado: string;
    fechaHora: Date;
    cliente: Cliente;
    mesa: Mesa;
    numeroPersonas: number;
    observaciones: string;
}