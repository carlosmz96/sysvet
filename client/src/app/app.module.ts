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

@NgModule({
  declarations: [
    AppComponent,
    RecordarClaveComponent,
    NavegacionComponent,
    CambiarClaveComponent,
    PrincipalComponent,
    LoginComponent,
    RegistroComponent,
    ListadoUsuariosComponent
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
