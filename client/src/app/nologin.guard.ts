import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from './services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class NologinGuard implements CanActivate {

  public identity: any;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  /**
   * Método encargado de comprobar si el usuario está logueado
   * o no para poder acceder a dicha url
   * @param route Ruta específica a la que quiere acceder
   * @param state Estado de la ruta
   * @returns TRUE/FALSE
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    this.identity = this.usuarioService.getIdentity();
    if (this.identity) {
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }

}
