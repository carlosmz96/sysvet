import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarClaveComponent } from './cambiar-clave/cambiar-clave.component';
import { PrincipalComponent } from './principal/principal.component';
import { RecordarClaveComponent } from './recordar-clave/recordar-clave.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'index',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    path: 'index',
    component: PrincipalComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'recordar-clave',
    component: RecordarClaveComponent
  },
  {
    path: 'cambiar-clave/:token',
    component: CambiarClaveComponent
  },
  {
    path: 'listado-usuarios',
    component: ListadoUsuariosComponent
  },
  {
    path: 'usuario/:dni',
    component: PerfilUsuarioComponent
  },
  {
    path: '**',
    redirectTo: 'index',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
