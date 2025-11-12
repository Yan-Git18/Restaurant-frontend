import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GenericService } from './generic-service';
import { Inventario } from '../model/inventario';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class InventarioService extends GenericService<Inventario> {
  private inventarioChange: Subject<Inventario[]> = new Subject<Inventario[]>();
  private messageChange: Subject<string> = new Subject<string>();

  constructor() {
    super(
      inject(HttpClient),
      `${environment.HOST}/inventarios`
    );
  }

  //////////////////////////
  setInventarioChange(data: Inventario[]) {
    this.inventarioChange.next(data);
  }

  getInventarioChange() {
    return this.inventarioChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
