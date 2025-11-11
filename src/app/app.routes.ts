import { Routes } from '@angular/router';
import { ClienteComponent } from './pages/cliente-component/cliente-component';
import { UsuarioComponent } from './pages/usuario-component/usuario-component';
import { RolComponent } from './pages/rol-component/rol-component';

export const routes: Routes = [
    
    { path: 'pages/clientes', component: ClienteComponent },
    { path: 'pages/usuarios', component: UsuarioComponent },
    { path: 'pages/roles', component: RolComponent },
];
