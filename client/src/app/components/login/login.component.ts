import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../models/Usuario';

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

  constructor(
    private usuarioService: UsuarioService,
    private elementRef: ElementRef,
    private router: Router,
    private messageService: MessageService
  ) {
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '', '', '', ''); // usuario de inicio de sesion
    this.identity = this.usuarioService.getIdentity();
    this.token = this.usuarioService.getToken();

    // si el usuario ya está logueado, redirecciona a index
    if(this.identity) {
      this.router.navigate(['index']);
    }
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
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
          this.addErrorMessage('El usuario no está correctamente identificado');
        } else {
          // Crear elemento en localStorage para tener al usuario logueado
          localStorage.setItem('identity', JSON.stringify(this.identity));

          // Conseguir el token para enviarselo a cada petición http
          this.usuarioService.iniciarSesion(this.usuario, true).subscribe(
            response => {
              this.token = response.token;
              if (this.token.length <= 0) {
                this.addErrorMessage('El token no se ha generado');
              } else {
                // Crear elemento en localStorage para tener el token disponible
                localStorage.setItem('token', this.token);
              }
              this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(243, 243, 243)';
              // redirige a pagina principal
              this.router.navigate(['index']);
            },
            error => {
              this.addErrorMessage(error.error.message);
            }
          );
        }
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

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

  /**
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
   public addErrorMessage(msg: string): void {
    this.messageService.add({severity: 'error', summary: 'Error', detail: msg});
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de éxito
   * @param msg Mensaje pasado por parámetro
   */
   public addSuccessMessage(msg: string): void {
    this.messageService.add({severity: 'success', summary: 'Éxito', detail: msg});
  }

}
