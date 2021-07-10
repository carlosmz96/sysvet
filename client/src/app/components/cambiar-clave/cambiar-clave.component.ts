import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/Usuario';
import { JwtHelperService } from "@auth0/angular-jwt";
import * as moment from 'moment';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html',
  styleUrls: ['./cambiar-clave.component.css']
})
export class CambiarClaveComponent implements OnInit {
  public title: string = 'SYSVET';
  public usuario: Usuario;
  public identity: any = false; // usuario logueado
  public expirado: boolean = false;
  public exito: boolean = false;
  public nuevaPass: string = "";
  public rePass: string = "";
  public payload: any = null;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute,
    private elementRef: ElementRef,
    private messageService: MessageService
  ) {
    this.identity = this.usuarioService.getIdentity();

    // si el usuario ya está logueado, redirecciona a index
    if(this.identity) {
      this.router.navigate(['index']);
    }

    // obtengo el parametro token
    const myRawToken: string = this.route.snapshot.paramMap.get('token')!;
    const helper = new JwtHelperService();
    // decodifica el token
    const decodedToken = helper.decodeToken(myRawToken);
    this.payload = decodedToken;

    this.usuario = new Usuario(decodedToken.sub, '', '', '', '', '', '', '', '', '', '');
  }

  ngOnInit(): void {
    // si la fecha del token ha expirado
    if(this.payload.exp < moment().unix()){
      this.addErrorMessage('Este enlace ha expirado, vuelve a intentarlo de nuevo.');
      this.expirado = true;
    }

    this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(153, 224, 153)';
  }

  /**
   * Método encargado de realizar el cambio de clave
   */
  public onSubmitCambioClave() {
    if (this.usuario.pass == this.rePass) {
      this.usuarioService.cambiarClaveUsuario(this.usuario).subscribe(
        response => {
          const user = response.user;

          if (!user) {
            this.addErrorMessage('Error al cambiar la contraseña.');
          } else {
            this.addSuccessMessage('Has cambiado la contraseña correctamente.');
            this.exito = true;
            this.usuario.pass = "";
            this.rePass = "";
          }
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      )
    }else{
      this.addErrorMessage('Ambos campos deben coincidir.');
    }
  }

  /**
   * Método encargado de redirigir a recordar clave
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
