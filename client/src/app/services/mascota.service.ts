import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { UsuarioService } from './usuario.service';
import { GLOBAL } from '../global';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {

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
   * Método encargado de llamar al api para dar de alta a una mascota
   * @param pet_to_create Mascota a crear
   * @returns Mascota creada
   */
  public altaMascota(pet_to_create: any): Observable<any> {
    const params = JSON.stringify(pet_to_create);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.post(this.url + 'alta-mascota', params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para obtener el listado de mascotas
   * @returns Listado de mascotas
   */
  public listarMascotas(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'mascotas', { headers: headers });
  }

  /**
   * Método encargado de llamar al api para consultar los datos de una mascota
   * @param identificador Identificador de la mascota a consultar
   * @returns Mascota consultada
   */
  public consultarMascota(identificador: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'mascotas/' + identificador, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para modificar los datos de una mascota
   * @param pet_to_update Mascota a modificar
   * @returns Mascota actualizada
   */
  public modificarMascota(pet_to_update: any): Observable<any> {
    const params = JSON.stringify(pet_to_update);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.put(this.url + 'modificar-mascota/' + pet_to_update.identificador, params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para eliminar la foto de perfil de la mascota
   * @param identificador Identificador de la mascota
   * @returns Respuesta tras la eliminación de la foto de perfil
   */
  public eliminarFotoMascota(identificador: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.post(this.url + 'eliminar-foto-mascota/' + identificador, {}, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para eliminar una mascota por completo
   * @param identificador Identificador de la mascota
   * @returns Mascota eliminada
   */
  public bajaMascota(identificador: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });
    const options = {
      headers: headers
    }

    return this.httpClient.delete(this.url + 'baja-mascota/' + identificador, options);
  }

  /**
   * Método encargado de llamar al api para obtener las observaciones de una mascota
   * @param identificador Identificador de la mascota
   * @returns Observaciones de la mascota
   */
  public obtenerObservacionesMascota(identificador: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'observaciones-mascota/' + identificador, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para modificar las observaciones de una mascota
   * @param identificador Identificador de la mascota
   * @param observaciones Observaciones de la mascota
   * @returns Observaciones actualizadas
   */
  public modificarObservacionesMascota(pet_to_update: any): Observable<any> {
    const params = JSON.stringify(pet_to_update);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.token
    });
    return this.httpClient.put(this.url + 'modificar-observaciones-mascota/' + pet_to_update.identificador, params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para obtener el historial de la mascota
   * @param identificador Identificador de la mascota
   * @returns Historial de la mascota
   */
  public obtenerHistorial(identificador: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'historial-mascota/' + identificador, { headers: headers });
  }

}
