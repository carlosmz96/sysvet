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
import { BajaUsuarioComponent } from './components/baja-usuario/baja-usuario.component';
import { AccesoDenegadoComponent } from './components/acceso-denegado/acceso-denegado.component';
import { ListadoMascotasComponent } from './components/listado-mascotas/listado-mascotas.component';
import { DatosMascotaComponent } from './components/datos-mascota/datos-mascota.component';
import { BajaMascotaComponent } from './components/baja-mascota/baja-mascota.component';
import { AltaMascotaComponent } from './components/alta-mascota/alta-mascota.component';
import { MessageService } from 'primeng/api';

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
    BajaUsuarioComponent,
    AccesoDenegadoComponent,
    ListadoMascotasComponent,
    DatosMascotaComponent,
    BajaMascotaComponent,
    AltaMascotaComponent
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
    ToastModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
