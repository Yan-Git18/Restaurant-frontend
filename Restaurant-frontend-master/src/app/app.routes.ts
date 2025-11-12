import { Routes } from '@angular/router';
import { ClienteComponent } from './pages/cliente-component/cliente-component';
import { UsuarioComponent } from './pages/usuario-component/usuario-component';
import { RolComponent } from './pages/rol-component/rol-component';
import { MesaComponent } from './pages/mesa-component/mesa-component';
import { ReservaComponent } from './pages/reserva-component/reserva-component';
import { CategoriaComponent } from './pages/categoria-component/categoria-component';
import { InventarioComponent } from './pages/inventario-component/inventario-component';
import { ProductoComponent } from './pages/producto-component/producto-component';
import { PedidoComponent } from './pages/pedido-component/pedido-component';

export const routes: Routes = [
    
    { path: 'pages/clientes', component: ClienteComponent },
    { path: 'pages/usuarios', component: UsuarioComponent },
    { path: 'pages/roles', component: RolComponent },
    { path: 'pages/mesas', component: MesaComponent },
    { path: 'pages/reservas', component: ReservaComponent },
    { path: 'pages/categorias', component: CategoriaComponent },
    { path: 'pages/inventarios', component: InventarioComponent },
    { path: 'pages/productos', component: ProductoComponent },
    { path: 'pages/pedidos', component: PedidoComponent }
];

