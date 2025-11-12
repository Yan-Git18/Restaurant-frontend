import { inject, Injectable } from '@angular/core';
import { GenericService } from './generic-service';
import { Rol } from '../model/rol';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService extends GenericService<Rol> {
  private rolChange = new Subject<Rol[]>();
  private messageChange = new Subject<string>();

  constructor() {
    super(inject(HttpClient), `${environment.HOST}/roles`);
  }

  setRolChange(data: Rol[]) {
    this.rolChange.next(data);
  }

  getRolChange() {
    return this.rolChange.asObservable();
  }

  setMessageChange(data: string) {
    this.messageChange.next(data);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }
}
