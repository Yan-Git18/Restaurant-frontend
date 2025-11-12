import { inject, Injectable } from '@angular/core';
import { Cliente } from '../model/cliente';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { GenericService } from './generic-service';
import { environment } from '../../environments/environment.development';
import { Categoria } from '../model/categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService extends GenericService<Categoria>{
  private categoriaChange: Subject<Categoria[]> = new Subject<Categoria[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(){
    super(
      inject(HttpClient),
    `${environment.HOST}/categorias`
    )
  }

  //////////////////////////
  setCategoriaChange(data: Categoria[]){
    this.categoriaChange.next(data);
  }

  getCategoriaChange(){
    return this.categoriaChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}
