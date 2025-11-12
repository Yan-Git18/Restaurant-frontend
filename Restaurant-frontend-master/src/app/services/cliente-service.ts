import { inject, Injectable } from '@angular/core';
import { Cliente } from '../model/cliente';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic-service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClienteService extends GenericService<Cliente>{
  private clienteChange: Subject<Cliente[]> = new Subject<Cliente[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(){
    super(
      inject(HttpClient),
    `${environment.HOST}/clientes`
    )
  }

  //////////////////////////
  setClienteChange(data: Cliente[]){
    this.clienteChange.next(data);
  }

  getClienteChange(){
    return this.clienteChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
