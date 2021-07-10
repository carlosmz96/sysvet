import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from '../global';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class CitaService {

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
   * Método encargado de llamar al api para crear una nueva cita
   * @param cita_to_create Cita a crear
   * @returns Cita creada
   */
  public nuevaCita(cita_to_create: any): Observable<any> {
    const params = JSON.stringify(cita_to_create);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.post(this.url + 'nueva-cita', params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para obtener la lista de citas del sistema
   * @returns Listado de citas general
   */
  public listarCitas(): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'citas', { headers: headers });
  }

  /**
   * Método encargado de llamar al api para consultar una cita en específico
   * @param id_cita Identificador de la cita a consultar
   * @returns Datos de la cita consultada
   */
  public consultarCita(id_cita: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'citas/' + id_cita, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para consultar las citas de una mascota
   * @param identificador Identificador de la mascota
   * @returns Listado de citas de la mascota
   */
  public consultarCitasMascota(identificador: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'citas-mascota/' + identificador, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para consultar las citas de un propietario
   * @param dni DNI del propietario
   * @returns Listado de citas del propietario
   */
  public consultarCitasPropietario(dni: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'citas-propietario/' + dni, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para anular una cita en específico
   * @param cita_to_update Cita a actualizar
   * @returns Cita anulada
   */
  public anularCita(cita_to_update: any): Observable<any> {
    const params = JSON.stringify(cita_to_update);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.put(this.url + 'anular-cita/' + cita_to_update.id_cita, params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para eliminar una cita
   * @param cita_to_delete Cita a eliminar
   * @returns Cita eliminada
   */
  public eliminarCita(cita_to_delete: any): Observable<any> {
    const params = JSON.stringify(cita_to_delete);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });
    const options = {
      headers: headers,
      body: params
    }

    return this.httpClient.delete(this.url + 'eliminar-cita/' + cita_to_delete.id_cita, options);
  }

  /**
   * Método encargado de llamar al api para obtener el motivo de la cita
   * @param idCita Id de la cita
   * @returns Motivo de la cita
   */
  public obtenerMotivoCita(idCita: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'obtener-motivo-cita/' + idCita, { headers: headers});
  }

}
