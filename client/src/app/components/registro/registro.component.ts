import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  public title = 'SYSVET';
  public identity: any;
  public usuario_registro: Usuario;
  public rePass: string = ""; // repite contraseña

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private elementRef: ElementRef,
    private messageService: MessageService
  ) {
    this.usuario_registro = new Usuario('', '', '', '', '', 'cliente', '', '', '');
    this.identity = this.usuarioService.getIdentity();

    // si el usuario ya está logueado, redirecciona a index
    if(this.identity) {
      this.router.navigate(['index']);
    }
  }

  ngOnInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(153, 224, 153)';
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
            this.addErrorMessage('Error al registrarse');
          } else {
            this.addSuccessMessage('Te has registrado correctamente');
            this.usuario_registro = new Usuario('', '', '', '', '', 'cliente', '', '', '');
            this.rePass = "";
          }
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    } else {
      this.addErrorMessage('La contraseña debe coincidir');
    }
  }

  /**
   * Método encargado de redireccionar a login
   */
  public goLogin(): void {
    this.router.navigate(['login']);
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
