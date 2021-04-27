import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button'

import { AppComponent } from './app.component';
import { RecordarClaveComponent } from './recordar-clave/recordar-clave.component';
import { NavegacionComponent } from './navegacion/navegacion.component';
import { CambiarClaveComponent } from './cambiar-clave/cambiar-clave.component';
import { PrincipalComponent } from './principal/principal.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { ModificarUsuarioComponent } from './modificar-usuario/modificar-usuario.component';
import { BajaUsuarioComponent } from './baja-usuario/baja-usuario.component';
import { AccesoDenegadoComponent } from './acceso-denegado/acceso-denegado.component';
import { ListadoMascotasComponent } from './listado-mascotas/listado-mascotas.component';

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
    ListadoMascotasComponent
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
    ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
