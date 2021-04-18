import { Component, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilUsuarioComponent } from '../perfil-usuario/perfil-usuario.component';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit {
  public title = 'SYSVET';
  public identity: any = false; // usuario logueado
  @ViewChild(PerfilUsuarioComponent) perfilUsuario?: PerfilUsuarioComponent;

  constructor(
    private router: Router
  ) {
    this.identity = JSON.parse(localStorage.getItem('identity')!);
  }

  ngOnInit(): void {
    
  }

  /**
   * Método encargado de redirigir a la gestión de usuarios
   */
   public goUsuarios(): void {
    this.router.navigate(['listado-usuarios']);
  }

  /**
   * Método encargado de cerrar la sesión y así eliminar todos los elementos del localStorage
   */
  public logout(): void {
    localStorage.clear();

    // this.logoutEmitter.emit();
    this.router.navigate(['login']);
  }

  /**
   * Método encargado de redireccionar a la página principal
   */
  public goHome(): void {
    this.router.navigate(['index']);
  }

  /**
   * Método encargado de redireccionar al perfil del usuario
   */
  public recargarPerfil(): void {
    
  }

}
