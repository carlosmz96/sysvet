import { Component, ElementRef, OnInit } from '@angular/core';
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
  public identity: any = false;
  public token: any = null;
  public mensajeError: string = "";
  public enRegistro: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private elementRef: ElementRef
  ) {
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '');
    this.usuario_registro = new Usuario('', '', '', '', '', 'Cliente', '', '', '');
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.identity = this.usuarioService.getIdentity();
    this.token = this.usuarioService.getToken();

    console.log(this.identity);
    console.log(this.token);

    if(this.identity == null) {
      this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(153, 224, 153)';
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

    // Le cambio el color
    this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(243, 243, 243)';
  }

  /**
   * Método encargado de cerrar la sesión y así eliminar todos los elementos del localStorage
   */
  public logout(): void {
    localStorage.clear();

    this.identity = null;
    this.token = null;
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '');

    this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(153, 224, 153)';
  }

  /**
   * Método encargado de settear la variable de registro a true
   */
  public goRegister(): void {
    this.enRegistro = true;
  }

  /**
   * Método encargado de settear la variable de registro a false
   */
  public goLogin(): void {
    this.enRegistro = false;
  }

}
