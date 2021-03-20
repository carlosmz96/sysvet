import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit {
  public title = 'SYSVET';
  public identity: any = false; // usuario logueado
  // @Output() logoutEmitter = new EventEmitter<boolean>();

  constructor(
    private router: Router
  ) {
    this.identity = JSON.parse(localStorage.getItem('identity')!);
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
   * Método encargado de redirigir a la gestión de usuarios
   */
  public goUsuarios(): void {
    this.router.navigate(['listado-usuarios']);
  }

}
