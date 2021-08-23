import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

// PrimeNG
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { EditorModule } from 'primeng/editor';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { PickListModule } from 'primeng/picklist';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CaptchaModule } from 'primeng/captcha';

// Componentes
import { AppComponent } from './app.component';
import { RecordarClaveComponent } from './components/recordar-clave/recordar-clave.component';
import { NavegacionComponent } from './components/navegacion/navegacion.component';
import { CambiarClaveComponent } from './components/cambiar-clave/cambiar-clave.component';
import { PrincipalComponent } from './components/principal/principal.component';
import { LoginComponent } from './components/login/login.component';
import { RegistroComponent } from './components/registro/registro.component';
import { ListadoUsuariosComponent } from './components/listado-usuarios/listado-usuarios.component';
import { PerfilUsuarioComponent } from './components/perfil-usuario/perfil-usuario.component';
import { ModificarUsuarioComponent } from './components/modificar-usuario/modificar-usuario.component';
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';
import { ListadoMascotasComponent } from './components/listado-mascotas/listado-mascotas.component';
import { DatosMascotaComponent } from './components/datos-mascota/datos-mascota.component';
import { AltaMascotaComponent } from './components/alta-mascota/alta-mascota.component';
import { MessageService } from 'primeng/api';
import { ListadoCitasComponent } from './components/listado-citas/listado-citas.component';
import { NuevaCitaComponent } from './components/nueva-cita/nueva-cita.component';
import { CitaSolicitadaComponent } from './components/cita-solicitada/cita-solicitada.component';
import { ConsultarCitaComponent } from './components/consultar-cita/consultar-cita.component';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ListadoServiciosComponent } from './components/listado-servicios/listado-servicios.component';
import { AltaServicioComponent } from './components/alta-servicio/alta-servicio.component';
import { ModificarServicioComponent } from './components/modificar-servicio/modificar-servicio.component';
import { HistorialMascotaComponent } from './components/historial-mascota/historial-mascota.component';
import { CrearEntradaComponent } from './components/crear-entrada/crear-entrada.component';
import { ModificarEntradaComponent } from './components/modificar-entrada/modificar-entrada.component';
import { ConsultarEntradaComponent } from './components/consultar-entrada/consultar-entrada.component';

@NgModule({
  declarations: [
    AppComponent,
    RecordarClaveComponent,
    NavegacionComponent,
    CambiarClaveComponent,
    PrincipalComponent,
    LoginComponent,
    RegistroComponent,
    ListadoUsuariosComponent,
    PerfilUsuarioComponent,
    ModificarUsuarioComponent,
    AccesoDenegadoComponent,
    ListadoMascotasComponent,
    DatosMascotaComponent,
    AltaMascotaComponent,
    ListadoCitasComponent,
    NuevaCitaComponent,
    CitaSolicitadaComponent,
    ConsultarCitaComponent,
    ServiciosComponent,
    ListadoServiciosComponent,
    AltaServicioComponent,
    ModificarServicioComponent,
    HistorialMascotaComponent,
    CrearEntradaComponent,
    ModificarEntradaComponent,
    ConsultarEntradaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TableModule,
    InputTextModule,
    AccordionModule,
    ButtonModule,
    DropdownModule,
    EditorModule,
    ToastModule,
    ConfirmDialogModule,
    CalendarModule,
    DialogModule,
    PickListModule,
    PaginatorModule,
    ProgressBarModule,
    ProgressSpinnerModule,
    CaptchaModule
  ],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent]
})
export class AppModule { }
