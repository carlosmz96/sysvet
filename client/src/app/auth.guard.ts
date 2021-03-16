import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public identity: any;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ){
    this.identity = this.usuarioService.getIdentity();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.identity){
      return true;
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
  
}
