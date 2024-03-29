import { ConsultarPublicacionComponent } from './components/consultar-publicacion/consultar-publicacion.component';
import { NologinGuard } from './nologin.guard';
import { ConsultarEntradaComponent } from './components/consultar-entrada/consultar-entrada.component';
import { ModificarEntradaComponent } from './components/modificar-entrada/modificar-entrada.component';
import { CrearEntradaComponent } from './components/crear-entrada/crear-entrada.component';
import { HistorialMascotaComponent } from './components/historial-mascota/historial-mascota.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ModificarServicioComponent } from './components/modificar-servicio/modificar-servicio.component';
import { AltaServicioComponent } from './components/alta-servicio/alta-servicio.component';
import { ListadoServiciosComponent } from './components/listado-servicios/listado-servicios.component';
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
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';
import { ListadoMascotasComponent } from './components/listado-mascotas/listado-mascotas.component';
import { DatosMascotaComponent } from './components/datos-mascota/datos-mascota.component';
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
    canActivate: [NologinGuard]
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
    path: 'historial-mascota/:idMascota',
    component: HistorialMascotaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'historial-mascota/:idMascota/crear-entrada',
    component: CrearEntradaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'historial-mascota/:idMascota/modificar-entrada/:idEntrada',
    component: ModificarEntradaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'historial-mascota/:idMascota/entrada/:idEntrada',
    component: ConsultarEntradaComponent,
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
    path: 'listado-servicios',
    component: ListadoServiciosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'alta-servicio',
    component: AltaServicioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'modificar-servicio/:id',
    component: ModificarServicioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'servicios',
    component: ServiciosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'publicacion/:id',
    component: ConsultarPublicacionComponent,
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
