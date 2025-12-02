import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { LoginService } from '../services/login-service';
import { MenuService } from '../services/menu-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment.development';
import { Menu } from '../model/menu';
import { map } from 'rxjs';

export const certGuard = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const loginService = inject(LoginService);
  const menuService = inject(MenuService);
  const router = inject(Router);

  const token = sessionStorage.getItem(environment.TOKEN_NAME);

  // ⛔ Si no hay token NO SE PUEDE EVALUAR
  if (!token) {
    loginService.logout();
    return false;
  }

  const helper = new JwtHelperService();

  // ⛔ Si está expirado → logout
  if (helper.isTokenExpired(token)) {
    loginService.logout();
    return false;
  }

  // ✔ Extraer correo del token
  const correo = helper.decodeToken(token).sub;

  // ✔ Validar menús del usuario
  return menuService.getMenusByCorreo(correo).pipe(
    map((data: Menu[]) => {
      menuService.setMenuChange(data);

      const url = state.url;
      let count = data.some((m) => url.startsWith(m.url)) ? 1 : 0;

      if (count > 0) {
        return true;
      } else {
        router.navigate(['/pages/not-403']);
        return false;
      }
    })
  );
};
