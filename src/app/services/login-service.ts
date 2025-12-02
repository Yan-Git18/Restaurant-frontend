import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface ILoginRequest {
  correo: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private url: string = `${environment.HOST}/login`;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(correo: string, contrasena: string){
    const body: ILoginRequest = { correo, contrasena };
    return this.http.post<any>(this.url, body);
  }

  isLogged(){
    return sessionStorage.getItem(environment.TOKEN_NAME) != null;
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['login']);
  }
}
