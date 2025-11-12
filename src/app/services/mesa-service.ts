import { inject, Injectable } from '@angular/core';
import { Mesa } from '../model/mesa';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic-service';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MesaService extends GenericService<Mesa>{
  private mesaChange: Subject<Mesa[]> = new Subject<Mesa[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(){
    super(
      inject(HttpClient),
    `${environment.HOST}/mesas`
    )
  }

  //////////////////////////
  setMesaChange(data: Mesa[]){
    this.mesaChange.next(data);
  }

  getMesaChange(){
    return this.mesaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
