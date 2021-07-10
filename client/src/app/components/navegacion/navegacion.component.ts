import { SelectItem } from 'primeng/api';
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
  public roles: SelectItem[] = [];
  public rolSeleccionado: any;
  public mostrarRoles = false;

  constructor(
    private router: Router
  ) {
    this.identity = JSON.parse(localStorage.getItem('identity')!);
    this.rolSeleccionado = { label: this.identity.rol.charAt(0).toUpperCase() + this.identity.rol.slice(1), value: this.identity.rol.toString() };
    this.obtenerRoles();
  }

  ngOnInit(): void {

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


  public showResponsiveDialog(): void {
    this.mostrarRoles = true;
  }

  /**
   * Método encargado de obtener los roles del usuario identificado
   */
  public obtenerRoles(): void {
    const rolesIdentity: string[] = this.identity.roles.split(', ');
    rolesIdentity.forEach(rol => this.roles.push({ label: rol.charAt(0).toUpperCase() + rol.slice(1), value: rol.toString() }));
  }

  /**
   * Método encargado de cambiar el rol del usuario
   */
  public cambiarRol(): void {
    this.identity.rol = this.rolSeleccionado.value;
    localStorage.setItem('identity', JSON.stringify(this.identity));
    this.mostrarRoles = false;
    this.router.navigate(['index']);
  }

}
