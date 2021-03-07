import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Usuario } from '../models/Usuario';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-recordar-clave',
  templateUrl: './recordar-clave.component.html',
  styleUrls: ['./recordar-clave.component.css']
})
export class RecordarClaveComponent implements OnInit {

  public title: string = 'SYSVET';
  public usuario: Usuario;
  public identity: any = false; // usuario logueado
  public mensajeError: string = "";
  public mensajeExito: string = "";

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '');
  }

  /**
   * Método que se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.identity = this.usuarioService.getIdentity();

    console.log(this.identity);
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
          this.mensajeError = "Error al enviar el correo.";
          this.mensajeExito = "";
        }else{
          this.mensajeExito = "Se ha enviado un enlace a tu correo electrónico, por favor, revísalo.";
          this.mensajeError = "";
        }
      },
      error => {
        this.mensajeError = error.error.message;
      }
    )
  }

  /**
   * Método encargado de redirigir al login
   */
  public goLogin(): void {
    this.router.navigate(['/']);
  }

}
