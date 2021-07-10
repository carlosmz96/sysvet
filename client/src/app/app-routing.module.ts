import { ConsultarCitaComponent } from './components/consultar-cita/consultar-cita.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CambiarClaveComponent } from './components/cambiar-clave/cambiar-clave.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { RecordarClaveComponent } from './components/recordar-clave/recordar-clave.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ListadoUsuariosComponent } from './components/listado-usuarios/listado-usuarios.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { ModificarUsuarioComponent } from './components/modificar-usuario/modificar-usuario.component';
import { BajaUsuarioComponent } from './components/baja-usuario/baja-usuario.component';
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';
import { ListadoMascotasComponent } from './components/listado-mascotas/listado-mascotas.component';
import { DatosMascotaComponent } from './components/datos-mascota/datos-mascota.component';
import { BajaMascotaComponent } from './components/baja-mascota/baja-mascota.component';
import { AltaMascotaComponent } from './components/alta-mascota/alta-mascota.component';
import { ListadoCitasComponent } from './components/listado-citas/listado-citas.component';
import { NuevaCitaComponent } from './components/nueva-cita/nueva-cita.component';
import { CitaSolicitadaComponent } from './components/cita-solicitada/cita-solicitada.component';

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
    path: 'datos-mascota/:idMascota',
    component: DatosMascotaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'baja-mascota/:idMascota',
    component: BajaMascotaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'listado-citas',
    component: ListadoCitasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nueva-cita',
    component: NuevaCitaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cita-solicitada',
    component: CitaSolicitadaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'cita/:id_cita',
    component: ConsultarCitaComponent,
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
