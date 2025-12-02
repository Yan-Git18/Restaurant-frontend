import { inject, Injectable } from '@angular/core';
import { Venta } from '../model/venta';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GenericService } from './generic-service';

@Injectable({
  providedIn: 'root',
})
export class VentaService extends GenericService<Venta> {

  private ventaChange = new Subject<Venta[]>();
  private messageChange = new Subject<string>();

  constructor() {
    super(inject(HttpClient), `${environment.HOST}/ventas`);
  }

  generarVenta(pedidoId: number) {
    return this.http.post<Venta>(`${environment.HOST}/ventas/generar/${pedidoId}`, {});
  }

  setVentaChange(data: Venta[]) {
    this.ventaChange.next(data);
  }

  getVentaChange() {
    return this.ventaChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
