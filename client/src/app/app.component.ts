import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  public usuario_registro: Usuario;
  public identity: any = false; // usuario logueado 
  public token: any = null; // token generado tras el login
  public mensajeError: string = "";
  public mensajeExito: string = "";
  public enLogin: boolean = true;
  public enRegistro: boolean = false;
  public rePass: string = ""; // repite contraseña

  constructor(
    private usuarioService: UsuarioService,
    private elementRef: ElementRef,
    private router: Router
  ) {
    this.usuario = new Usuario('', '', '', '', '', '', '', '', ''); // usuario de inicio de sesion
    this.usuario_registro = new Usuario('', '', '', '', '', 'cliente', '', '', ''); // usuario de registro
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.identity = this.usuarioService.getIdentity();
    this.token = this.usuarioService.getToken();

    // Comprueba que está en la url correcta
    if (window.location.href.endsWith('recordar-clave')) {
      this.enLogin = false;
      this.enRegistro = false;
    } else if (window.location.href.indexOf('cambiar-clave') > -1){
      this.enLogin = false;
      this.enRegistro = false;
    } else if (window.location.href.endsWith('')) {
      this.enLogin = true;
    } 

    if (this.identity == null) {
      // cambia el color de fondo del body
      this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(153, 224, 153)';
    }
  }

  /**
   * Método encargado de registrar a un usuario en la aplicación
   */
  public onSubmitRegister(): void {
    if (this.usuario_registro.pass == this.rePass) {
      this.usuarioService.altaUsuario(this.usuario_registro).subscribe(
        response => {
          const user = response.user;
          this.usuario_registro = user;

          if (!user.dni) {
            this.mensajeError = "Error al registrarse";
            this.mensajeExito = "";
          } else {
            this.mensajeExito = "Te has registrado correctamente";
            this.mensajeError = "";
            this.usuario_registro = new Usuario('', '', '', '', '', 'cliente', '', '', '');
            this.rePass = "";
          }
        },
        error => {
          this.mensajeError = error.error.message;
        }
      );
    } else {
      this.mensajeError = "La contraseña debe coincidir";
    }
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
              // cambia el color de fondo del body
              this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(243, 243, 243)';
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

  /**
   * Método encargado de cerrar la sesión y así eliminar todos los elementos del localStorage
   */
  public logout(): void {
    localStorage.clear();

    this.identity = null;
    this.token = null;
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '');
    this.mensajeError = "";

    // cambia el color de fondo del body
    this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(153, 224, 153)';
  }

  /**
   * Método encargado de settear las variables de registro a true y de login a false
   */
  public goRegister(): void {
    this.enRegistro = true;
    this.enLogin = false;
  }

  /**
   * Método encargado de settear las variables de registro a false y de login a true
   */
  public goBack(): void {
    this.enRegistro = false;
    this.enLogin = true;
  }

  /**
   * Método encargado de settear las variables login y registro a false
   */
  public goRecordarClave(): void {
    this.enLogin = false;
    this.enRegistro = false;
  }

}
