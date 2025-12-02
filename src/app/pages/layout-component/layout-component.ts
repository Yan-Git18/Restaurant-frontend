import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from "@angular/material/toolbar";

import { MenuService } from '../../services/menu-service';
import { LoginService } from '../../services/login-service';
import { Menu } from '../../model/menu';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../../environments/environment.development';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatToolbar,
    CommonModule
  ],
  templateUrl: './layout-component.html',
  styleUrls: ['./layout-component.css'],
})
export class LayoutComponent {

  menus: Menu[] = [];

  userName: string = '';
  userRole: string = '';
  userInitials: string = '';
  isCollapsed: boolean = false;

  constructor(
    private menuService: MenuService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = sessionStorage.getItem(environment.TOKEN_NAME);

    if (token) {
      const decoded = helper.decodeToken(token);

      this.userName = decoded.sub ?? 'Usuario';
      this.userRole = decoded.role ?? 'Rol';
      this.userInitials = this.userName
        .split(' ')
        .map(p => p[0])
        .join('')
        .toUpperCase();
    }

    const correo = this.userName;
    this.menuService.getMenusByCorreo(correo).subscribe((data) => {
      this.menus = data;
    });

    this.menuService.getMenuChange().subscribe((data) => {
      this.menus = [...data];
    });
  }

  logout() {
    this.loginService.logout();
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
