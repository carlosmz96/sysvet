import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from '../global';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  public url: string;
  public identity: any;
  public token: any;

  constructor(
    private httpClient: HttpClient,
    private usuarioService: UsuarioService
  ) {
    this.url = GLOBAL.url;
    this.identity = this.usuarioService.getIdentity();
    this.token = this.usuarioService.getToken();
  }

  /**
   * Método encargado de llamar al api para dar de alta una nueva publicación
   * @param post_to_create Publicación a crear
   * @returns Publicación creada
   */
  public altaPublicacion(post_to_create: any): Observable<any> {
    const params = JSON.stringify(post_to_create);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.post(this.url + 'alta-publicacion', params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para obtener la lista de publicaciones
   * @returns Listado de publicaciones
   */
  public listarPublicaciones(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'publicaciones', { headers: headers });
  }

  /**
   * Método encargado de llamar al api para consultar una publicación
   * @param id_publicacion Identificador de la publicación a consultar
   * @returns Datos de la publicación consultada
   */
  public consultarPublicacion(id_publicacion: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'publicaciones/' + id_publicacion, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para modificar los datos de una publicación
   * @param post_to_update Publicación a modificar
   * @returns Publicación actualizada
   */
  public modificarPublicacion(post_to_update: any): Observable<any> {
    const params = JSON.stringify(post_to_update);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.put(this.url + 'modificar-publicacion', params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para dar de baja una publicación
   * @param id_publicacion Identificador de la publicación
   * @returns Publicación eliminada
   */
  public eliminarPublicacion(id_publicacion: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    const options = {
      headers: headers
    }

    return this.httpClient.delete(this.url + 'baja-publicacion/' + id_publicacion, options);
  }

}
