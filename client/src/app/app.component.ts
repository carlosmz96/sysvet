import { Component, OnInit } from '@angular/core';
import { Usuario } from './models/Usuario';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UsuarioService]
})
export class AppComponent implements OnInit {
  public title = 'SYSVET';
  public usuario: Usuario;
  public identity: any = false;
  public token: any = null;
  public mensajeError: string = "";

  constructor(
    private usuarioService: UsuarioService
  ) {
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '');
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.identity = this.usuarioService.getIdentity();
    this.token = this.usuarioService.getToken();

    console.log(this.identity);
    console.log(this.token);
  }

  /**
   * Método encargado de iniciar sesión en la aplicación
   */
  public onSubmit(): void {
    // Conseguir los datos del usuario identificado
    this.usuarioService.iniciarSesion(this.usuario).subscribe(
      response => {
        this.identity = response.user;
        if (!this.identity.dni) {
          this.mensajeError = "El usuario no está correctamente identificado";
        } else {
          // Crear elemento en localStorage para tener al usuario logueado
          localStorage.setItem('identity', JSON.stringify(this.identity));

          // Conseguir el token para enviarselo a cada petición http
          this.usuarioService.iniciarSesion(this.usuario, true).subscribe(
            response => {
              this.token = response.token;
              if (this.token.length <= 0) {
                this.mensajeError = "El token no se ha generado";
              } else {
                // Crear elemento en localStorage para tener el token disponible
                localStorage.setItem('token', this.token);
              }
            },
            error => {
              this.mensajeError = error.error.message;
            }
          );
        }
      },
      error => {
        this.mensajeError = error.error.message;
      }
    );
  }

}
