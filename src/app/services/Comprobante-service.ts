import { inject, Injectable } from '@angular/core';
import { Comprobante } from '../model/comprobante';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic-service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ComprobanteService extends GenericService<Comprobante> {
  private comprobanteChange: Subject<Comprobante[]> = new Subject<Comprobante[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor() {
    super(
      inject(HttpClient),
      `${environment.HOST}/comprobantes`
    );
  }

  setComprobanteChange(data: Comprobante[]) {
    this.comprobanteChange.next(data);
  }

  getComprobanteChange() {
    return this.comprobanteChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}