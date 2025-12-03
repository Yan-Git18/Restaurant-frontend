import { Routes } from '@angular/router';
import { certGuard } from '../guard/cert.guard';
import { UsuarioComponent } from './usuario-component/usuario-component';
import { RolComponent } from './rol-component/rol-component';
import { ClienteComponent } from './cliente-component/cliente-component';
import { MesaComponent } from './mesa-component/mesa-component';
import { ReservaComponent } from './reserva-component/reserva-component';
import { CategoriaComponent } from './categoria-component/categoria-component';
import { ProductoComponent } from './producto-component/producto-component';
import { PedidoComponent } from './pedido-component/pedido-component';
import { PanelComponent } from './panel-component/panel-component';
import { MenuComponent } from './menu-component/menu-component';
import { AsignarMenuComponent } from './asignar-menu-component/asignar-menu-component';
import { VentaComponent } from './ventas-component/ventas-component';

export const pagesRoutes: Routes = [
  { path: 'panel', component: PanelComponent, canActivate: [certGuard] },
  { path: 'usuarios', component: UsuarioComponent, canActivate: [certGuard] },
  { path: 'roles', component: RolComponent, canActivate: [certGuard] },
  { path: 'pedidos', component: PedidoComponent, canActivate: [certGuard] },
  { path: 'clientes', component: ClienteComponent, canActivate: [certGuard] },
  { path: 'mesas', component: MesaComponent, canActivate: [certGuard] },
  { path: 'reservas', component: ReservaComponent, canActivate: [certGuard] },
  { path: 'categorias', component: CategoriaComponent, canActivate: [certGuard] },
  { path: 'productos', component: ProductoComponent, canActivate: [certGuard] },
  { path: 'menus', component: MenuComponent, canActivate: [certGuard] },
  { path: 'menu-roles', component: AsignarMenuComponent, canActivate: [certGuard] },
  { path: 'ventas', component: VentaComponent, canActivate: [certGuard] }
];

