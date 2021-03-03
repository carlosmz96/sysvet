import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Usuario } from './models/Usuario';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public url: string;
  public identity: any;
  public token: any;

  constructor(
    private httpClient: HttpClient
  ) {
    this.url = "http://localhost:3000/api/";
  }

  /**
   * Método encargado de llamar al api para iniciar sesión
   * @param user_to_login Usuario a loguearse
   * @param gethash Token generado
   */
  public iniciarSesion(user_to_login: any, gethash: any = null):Observable<any> {
    if(gethash != null) {
      user_to_login.gethash = gethash;
    }

    const json = JSON.stringify(user_to_login);
    const params = json;

    const headers = new HttpHeaders().set('Content-Type','application/json');

    return this.httpClient.post(this.url + 'login', params, {headers: headers});
  }

  public getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity')!);

    if(identity != "undefined"){
      this.identity = identity;
    }else{
      this.identity = null;
    }

    return this.identity;
  }

  public getToken() {
    const token = localStorage.getItem('token');

    if(token != "undefined"){
      this.token = token;
    }else{
      this.token = null;
    }

    return this.token;
  }

}
