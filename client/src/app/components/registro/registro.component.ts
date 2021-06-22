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
    if (this.identity) {
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
    if (this.validarDni(this.usuario_registro.dni)) {
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
    } else {
      this.addErrorMessage('El dni no es válido.');
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
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de éxito
   * @param msg Mensaje pasado por parámetro
   */
  public addSuccessMessage(msg: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: msg });
  }

  /**
   * Método encargado de comprobar que el dni es correcto
   * @param dni Dni introducido
   * @returns TRUE/FALSE
   */
  public validarDni(dni: string): Boolean {
    let esValido = false;
    let numero: any;
    let letra: string;
    let letras: string;
    const exp_regular_dni = /^\d{8}[a-zA-Z]$/;

    if (exp_regular_dni.test(dni) == true) {
      numero = dni.substr(0, dni.length - 1);
      letra = dni.substr(dni.length-1, 1);
      numero = numero % 23;
      letras = 'TRWAGMYFPDXBNJZSQVHLCKET';
      letras = letras.substr(numero, 1);
      if (letras != letra.toUpperCase()) {
        esValido = false;
      } else {
        esValido = true;
      }
    } else {
      esValido = false;
    }

    return esValido;
  }

}
