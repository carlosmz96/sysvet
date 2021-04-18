import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/Usuario';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {
  public title = 'SYSVET';
  public identity: any;
  public usuario_registro: Usuario;
  public mensajeExito: string = "";
  public mensajeError: string = "";
  public rePass: string = ""; // repite contraseña

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private elementRef: ElementRef
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
   * Método encargado de redireccionar a login
   */
  public goLogin(): void {
    this.router.navigate(['login']);
  }

}
