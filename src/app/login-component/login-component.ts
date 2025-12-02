import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MaterialModule } from '../material/material-module';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../services/login-service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { MenuService } from '../services/menu-service';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule, MatCardModule, MaterialModule, RouterLink],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  correo: string;
  contrasena: string;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private menuService: MenuService
  ) {}

  login() {
    this.loginService.login(this.correo, this.contrasena).subscribe({
      next: (data) => {
        sessionStorage.setItem(environment.TOKEN_NAME, data.access_token);

        this.menuService.getMenusByCorreo(this.correo).subscribe((menus) => {
          this.menuService.setMenuChange(menus);

          if (menus.length > 0) {
            this.router.navigate([menus[0].url]);
          } else {
            alert('No tienes menús asignados.');
          }
        });
      },
    });
  }
}
