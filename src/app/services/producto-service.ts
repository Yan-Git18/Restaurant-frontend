import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Producto } from '../model/producto';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { GenericService } from './generic-service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService extends GenericService<Producto>{
  private productoChange: Subject<Producto[]> = new Subject<Producto[]>;
  private messageChange: Subject<string> = new Subject<string>;

  constructor(){
    super(
      inject(HttpClient),
    `${environment.HOST}/productos`
    )
  }

  //////////////////////////
  setProductoChange(data: Producto[]){
    this.productoChange.next(data);
  }

  getProductoChange(){
    return this.productoChange.asObservable();
  }

  setMessageChange(data: string){
    this.messageChange.next(data);
  }

  getMessageChange(){
    return this.messageChange.asObservable();
  }
}