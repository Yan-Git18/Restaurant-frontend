import { inject, Injectable } from '@angular/core';
import { Pago } from '../model/pago';
import { GenericService } from './generic-service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagoService extends GenericService<Pago> {
  private pagoChange: Subject<Pago[]> = new Subject<Pago[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor() {
    super(inject(HttpClient), `${environment.HOST}/pagos`);
  }

registrarPago(dto: PagoDTO) {
  return this.http.post<Pago>(`${environment.HOST}/pagos/registrar`, dto);
}


  //////////////////////////
  setPagoChange(data: Pago[]) {
    this.pagoChange.next(data);
  }

  getPagoChange() {
    return this.pagoChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}


export class PagoDTO {
  metodo: string;
  monto: number;
  ventaId: number;
}
