import { inject, Injectable } from '@angular/core';
import { generate, Subject } from 'rxjs';
import { GenericService } from './generic-service';
import { Usuario } from '../model/usuario';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends GenericService<Usuario>{
  private usuarioChange: Subject<Usuario[]> = new Subject<Usuario[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(){
    super(
      inject(HttpClient),
    `${environment.HOST}/usuarios`
    )
  }

  //////////////////////////
  setUsuarioChange(data: Usuario[]){
    this.usuarioChange.next(data);
  }

  getUsuarioChange(){
    return this.usuarioChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
