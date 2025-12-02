import { inject, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Menu } from '../model/menu';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { GenericService } from './generic-service';

@Injectable({
  providedIn: 'root',
})
export class MenuService extends GenericService<Menu> {
  private menuChange = new Subject<Menu[]>();
  private messageChange = new Subject<string>();

  private menuUrl = `${environment.HOST}/menus`;
  private menuRolUrl = `${environment.HOST}/menu-roles`;

  constructor() {
    super(inject(HttpClient), `${environment.HOST}/menus`);
  }

  getMenusByCorreo(correo: string) {
    return this.http.post<Menu[]>(`${this.menuUrl}/user`, { correo });
  }

  getMenuChange() {
    return this.menuChange.asObservable();
  }

  setMenuChange(menus: Menu[]) {
    this.menuChange.next(menus);
  }

  getMessageChange() {
    return this.messageChange.asObservable();
  }

  setMessageChange(msg: string) {
    this.messageChange.next(msg);
  }
}
