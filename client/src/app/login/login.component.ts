import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/Usuario';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public title = 'SYSVET';
  public usuario: Usuario;
  public identity: any = false; // usuario logueado
  public token: any = null; // token generado tras el login
  public mensajeError: string = "";
  public mensajeExito: string = "";  

  constructor(
    private usuarioService: UsuarioService,
    private elementRef: ElementRef,
    private router: Router
  ) {
    this.usuario = new Usuario('', '', '', '', '', '', '', '', ''); // usuario de inicio de sesion
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.identity = this.usuarioService.getIdentity();
    this.token = this.usuarioService.getToken();

    this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(153, 224, 153)';
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
              this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(243, 243, 243)';
              // redirige a pagina principal
              this.router.navigate(['index']);
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
  // public logout(): void {
  //   localStorage.clear();

  //   this.identity = null;
  //   this.token = null;
  //   this.usuario = new Usuario('', '', '', '', '', '', '', '', '');
  //   this.mensajeError = "";

  //   // cambia el color de fondo del body
  //   this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(153, 224, 153)';
  // }

  /**
   * Método encargado de redirigir al formulario de registro
   */
  public goRegister(): void {
    this.router.navigate(['registro']);
  }

  /**
   * Método encargado de redirigir al formulario de recordar clave
   */
  public goRecordarClave(): void {
    this.router.navigate(['recordar-clave']);
  }

}
