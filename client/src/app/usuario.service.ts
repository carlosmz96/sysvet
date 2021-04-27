import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GLOBAL } from './global';

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
    this.url = GLOBAL.url;
  }

  /**
   * Método encargado de llamar al api para iniciar sesión
   * @param user_to_login Usuario a loguearse
   * @param gethash Token generado
   * @returns Usuario consultado
   */
  public iniciarSesion(user_to_login: any, gethash: any = null): Observable<any> {
    if (gethash != null) {
      user_to_login.gethash = gethash;
    }

    const params = JSON.stringify(user_to_login);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post(this.url + 'login', params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para dar de alta a un usuario
   * @param user_to_register Usuario a registrar
   * @returns Usuario creado
   */
  public altaUsuario(user_to_register: any): Observable<any> {
    const params = JSON.stringify(user_to_register);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post(this.url + 'registro', params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para obtener el listado de usuarios
   * @returns Listado de usuarios
   */
  public listarUsuarios(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    return this.httpClient.get(this.url + '/usuarios', { headers: headers });
  }

  /**
   * Método encargado de llamar al api para consultar los datos de un usuario
   * @param user_to_update Usuario a consultar
   * @returns Usuario consultado
   */
  public consultarUsuario(dni: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.getToken());
    return this.httpClient.get(this.url + 'usuarios/' + dni, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para modificar los datos de un usuario
   * @param user_to_update Usuario a modificar
   * @returns Usuario actualizado
   */
  public modificarUsuario(user_to_update: any): Observable<any> {
    const params = JSON.stringify(user_to_update);
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.getToken()});

    return this.httpClient.put(this.url + 'modificar-usuario/' + user_to_update.dni, params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para eliminar la foto de perfil del usuario
   * @param dni Dni del usuario
   * @returns Respuesta tras la eliminación de la foto de perfil
   */
  public eliminarFotoUsuario(dni: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.getToken()});

    return this.httpClient.post(this.url + 'eliminar-foto-perfil/' + dni, {}, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para eliminar a un usuario por completo
   * @param dni Dni del usuario
   * @returns Usuario eliminado
   */
  public bajaUsuario(dni: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json', 'Authorization': this.getToken()});
    const options = {
      headers: headers
    }

    return this.httpClient.delete(this.url + 'baja-usuario/' + dni, options);
  }

  /**
   * Método encargado de llamar al api para comprobar la clave del usuario
   * @param dni Dni del usuario
   * @returns Si es correcta o no
   */
  public comprobarClaveUsuario(dni: any, pass: string): Observable<any> {
    return this.httpClient.get(this.url + 'comprobar-clave/' + dni + '/' + pass);
  }

  /**
   * Método encargado de llamar al api para cambiar la contraseña de un usuario
   * @param user_to_update Usuario a modificar
   * @returns Usuario actualizado
   */
  public cambiarClaveUsuario(user_to_update: any): Observable<any> {
    const params = JSON.stringify(user_to_update);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.put(this.url + 'modificar-clave-usuario/' + user_to_update.dni, params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para recordar contraseña del usuario
   * @param user_email Email del usuario
   * @returns Usuario consultado
   */
  public recordarContrasena(user_email: any): Observable<any> {
    const params = JSON.stringify(user_email);
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.httpClient.post(this.url + 'recordar-contrasena', params, { headers: headers });
  }

  /**
   * Método que obtiene la identidad a partir del local storage
   */
  public getIdentity() {
    const identity = JSON.parse(localStorage.getItem('identity')!);

    if (identity != "undefined") {
      this.identity = identity;
    } else {
      this.identity = null;
    }

    return this.identity;
  }

  /**
   * Método que obtiene el token a partir del local storage
   */
  public getToken() {
    const token = localStorage.getItem('token');

    if (token != "undefined") {
      this.token = token;
    } else {
      this.token = null;
    }

    return this.token;
  }

}
