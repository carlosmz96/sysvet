import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-recordar-clave',
  templateUrl: './recordar-clave.component.html',
  styleUrls: ['./recordar-clave.component.css']
})
export class RecordarClaveComponent implements OnInit {

  public title: string = 'SYSVET';
  public usuario: Usuario;
  public identity: any = false; // usuario logueado

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private elementRef: ElementRef,
    private messageService: MessageService
  ) {
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '', '', '', '');
    this.identity = this.usuarioService.getIdentity();

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
   * Método encargado de realizar la petición rest
   * 1. Comprueba que el email existe en la base de datos
   * 2. Envia un correo al email del usuario con un enlace
   */
  public onSubmitEmail(): void {
    this.usuarioService.recordarContrasena(this.usuario).subscribe(
      response => {
        const user = response.user;

        if(!user.email) {
          this.addErrorMessage('Error al enviar el correo.');
        }else{
          this.addSuccessMessage('Se ha enviado un enlace a tu correo electrónico, por favor, revísalo.');
        }
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    )
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
