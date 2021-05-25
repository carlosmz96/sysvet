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
import { ModificarUsuarioComponent } from './modificar-usuario/modificar-usuario.component';
import { BajaUsuarioComponent } from './baja-usuario/baja-usuario.component';
import { AccesoDenegadoComponent } from './acceso-denegado/acceso-denegado.component';
import { ListadoMascotasComponent } from './listado-mascotas/listado-mascotas.component';
import { DatosMascotaComponent } from './datos-mascota/datos-mascota.component';
import { BajaMascotaComponent } from './baja-mascota/baja-mascota.component';
import { AltaMascotaComponent } from './alta-mascota/alta-mascota.component';

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
    component: ListadoUsuariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'listado-mascotas',
    component: ListadoMascotasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'usuario/:dni',
    component: PerfilUsuarioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'modificar-usuario/:dni',
    component: ModificarUsuarioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'baja-usuario/:dni',
    component: BajaUsuarioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'alta-mascota',
    component: AltaMascotaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'datos-mascota/:microchip',
    component: DatosMascotaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'baja-mascota/:microchip',
    component: BajaMascotaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'acceso-denegado',
    component: AccesoDenegadoComponent
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
