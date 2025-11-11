import { inject, Injectable } from '@angular/core';
import { Pedido } from '../model/pedido';
import { GenericService } from './generic-service';
import { Subject } from 'rxjs/internal/Subject';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PedidoService extends GenericService<Pedido>{
  private pedidoChange: Subject<Pedido[]> = new Subject<Pedido[]>;
  private messageChange: Subject<string> = new Subject<string>;
  constructor(){
    super(
      inject(HttpClient),
    `${environment.HOST}/pedidos`
    )
  }
  //////////////////////////
  setPedidoChange(data: Pedido[]){
    this.pedidoChange.next(data);
  }
  getPedidoChange(){
    return this.pedidoChange.asObservable();
  }
  setMessageChange(data: string){
    this.messageChange.next(data);
  }
  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
