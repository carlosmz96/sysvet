import { Observable } from 'rxjs';
import { GLOBAL } from './../global';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  public url: string;
  public token: any;

  constructor(
    private httpClient: HttpClient,
    private usuarioService: UsuarioService
  ) {
    this.url = GLOBAL.url;
    this.token = this.usuarioService.getToken();
  }

  /**
   * Método encargado de llamar al api para dar de alta un nuevo servicio
   * @param service_to_create Servicio a crear
   * @returns Servicio creado
   */
  public altaServicio(service_to_create: any): Observable<any> {
    const params = JSON.stringify(service_to_create);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.post(this.url + 'alta-servicio', params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para obtener el listado de servicios
   * @returns Listado de servicios
   */
  public listarServicios(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'servicios', { headers: headers });
  }

  /**
   * Método encargado de llamar al api para consultar los datos de un servicio
   * @param identificador Identificador del servicio
   * @returns Servicio consultado
   */
  public consultarServicio(identificador: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'servicios/' + identificador, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para modificar los datos de un servicio
   * @param service_to_update Servicio a modificar
   * @returns Servicio actualizado
   */
  public modificarServicio(service_to_update: any): Observable<any> {
    const params = JSON.stringify(service_to_update);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.put(this.url + 'modificar-servicio/' + service_to_update.identificador, params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para eliminar un servicio del sistema
   * @param identificador Identificador del servicio
   * @returns Servicio eliminado
   */
  public bajaServicio(identificador: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    const options = {
      headers: headers
    }

    return this.httpClient.delete(this.url + 'baja-servicio/' + identificador, options);
  }

  /**
   * Método encargado de llamar al api para obtener la descripción de un servicio
   * @param identificador Identificador del servicio
   * @returns Descripción del servicio
   */
  public obtenerDescripcionServicio(identificador: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'obtener-descripcion-servicio/' + identificador, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para modificar la descripción de un servicio
   * @param service_to_update Servicio a modificar
   * @returns Descripción actualizada
   */
  public modificarDescripcionServicio(service_to_update: any): Observable<any> {
    const params = JSON.stringify(service_to_update);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });
    return this.httpClient.put(this.url + 'modificar-descripcion-servicio/' + service_to_update._id, params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para obtener el listado de servicios
   * @returns Listado de servicios
   */
  public listarServiciosByIds(servicios: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'serviciosByIds/' + servicios, { headers: headers });
  }

}
