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

    const params = JSON.stringify(user_to_login);
    const headers = new HttpHeaders().set('Content-Type','application/json');

    return this.httpClient.post(this.url + 'login', params, {headers: headers});
  }

  /**
   * Método encargado de llamar al api para dar de alta a un usuario
   * @param user_to_register Usuario a registrar
   */
  public altaUsuario(user_to_register: any):Observable<any> {
    const params = JSON.stringify(user_to_register);
    const headers = new HttpHeaders().set('Content-Type','application/json');

    return this.httpClient.post(this.url + 'registro', params, {headers: headers});  
  }

  /**
   * Método encargado de llamar al api para obtener el listado de usuarios
   */
  public listarUsuarios():Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    return this.httpClient.get(this.url + '/usuarios', {headers: headers});
  }

  /**
   * Método encargado de llamar al api para consultar los datos de un usuario
   * @param user_to_update Usuario a consultar
   */
   public consultarUsuario(dni: any):Observable<any> {
    return this.httpClient.get(this.url + 'usuarios/' + dni);
  }

  /**
   * Método encargado de llamar al api para modificar los datos de un usuario
   * @param user_to_update Usuario a modificar
   */
  public modificarUsuario(user_to_update: any):Observable<any> {
    const params = JSON.stringify(user_to_update);
    const headers = new HttpHeaders().set('Content-Type','application/json');

    return this.httpClient.put(this.url + 'modificar-usuario/' + user_to_update.dni, params, {headers: headers});
  }

  /**
   * Método encargado de llamar al api para cambiar la contraseña de un usuario
   * @param user_to_update Usuario a modificar
   */
   public cambiarClaveUsuario(user_to_update: any):Observable<any> {
    const params = JSON.stringify(user_to_update);
    const headers = new HttpHeaders().set('Content-Type','application/json');

    return this.httpClient.put(this.url + 'modificar-clave-usuario/' + user_to_update.dni, params, {headers: headers});
  }

  /**
   * Método encargado de llamar al api para recordar contraseña del usuario
   * @param user_email Email del usuario
   */
  public recordarContrasena(user_email: any):Observable<any> {
    const params = JSON.stringify(user_email);
    const headers = new HttpHeaders().set('Content-Type','application/json');

    return this.httpClient.post(this.url + 'recordar-contrasena', params, {headers: headers});
  }

  /**
   * Método que obtiene la identidad a partir del local storage
   */
  public getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity')!);

    if(identity != "undefined"){
      this.identity = identity;
    }else{
      this.identity = null;
    }

    return this.identity;
  }

  /**
   * Método que obtiene el token a partir del local storage
   */
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
