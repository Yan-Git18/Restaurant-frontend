import { inject, Injectable } from '@angular/core';
import { Reserva } from '../model/reserva';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic-service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReservaService extends GenericService<Reserva>{
  private reservaChange: Subject<Reserva[]> = new Subject<Reserva[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(){
    super(
      inject(HttpClient),
    `${environment.HOST}/reservas`
    )
  }

  //////////////////////////
  setReservaChange(data: Reserva[]){
    this.reservaChange.next(data);
  }

  getReservaChange(){
    return this.reservaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
