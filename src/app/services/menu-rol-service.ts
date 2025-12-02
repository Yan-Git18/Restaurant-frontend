import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Menu } from '../model/menu';

@Injectable({
  providedIn: 'root',
})
export class MenuRolService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.HOST}/menu-roles`;

  asignarMenu(idMenu: number, idRol: number) {
    return this.http.post(`${this.baseUrl}`, {
      idMenu,
      idRol,
    });
  }

  eliminarMenu(idMenu: number, idRol: number) {
    return this.http.delete(`${this.baseUrl}/${idMenu}/${idRol}`);
  }

  getMenusByRol(idRol: number) {
    return this.http.get<Menu[]>(`${environment.HOST}/menu-roles/${idRol}`);
  }
}
