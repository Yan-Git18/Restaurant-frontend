import { inject, Injectable } from '@angular/core';
import { Pedido } from '../model/pedido';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

export interface PedidoDTO {
  clienteId: number | null;
  mesaId: number;
  usuarioId: number;
  detalles: { productoId: number; cantidad: number }[];
}

@Injectable({
  providedIn: 'root',
})
export class PedidoService extends GenericService<Pedido> {
  private pedidoChange = new Subject<Pedido[]>();
  private messageChange = new Subject<string>();

  constructor() {
    super(inject(HttpClient), `${environment.HOST}/pedidos`);
  }

  registrarPedido(dto: PedidoDTO) {
    return this.http.post(`${environment.HOST}/pedidos`, dto);
  }

  cambiarEstado(id: number, estado: string) {
    return this.http.put(`${environment.HOST}/pedidos/${id}/estado`, { estado });
  }

  setPedidoChange(data: Pedido[]) {
    this.pedidoChange.next(data);
  }
  getPedidoChange() {
    return this.pedidoChange.asObservable();
  }

  setMessageChange(message: string) {
    this.messageChange.next(message);
  }
  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
