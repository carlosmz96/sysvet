import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from '../global';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class EntradaService {

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
   * Método encargado de llamar al api para crear una nueva entrada
   * @param entry_to_create Entrada a crear
   * @returns Entrada creada
   */
  public crearEntrada(entry_to_create: any): Observable<any> {
    const params = JSON.stringify(entry_to_create);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.post(this.url + 'crear-entrada', params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para obtener la lista de entradas del historial
   * @param id_historial Identificador del historial
   * @returns Listado de entradas del historial de una mascota
   */
  public obtenerEntradasHistorial(id_historial: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'historial/' + id_historial, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para consultar una entrada del historial
   * @param id_entrada Identificador de la entrada a consultar
   * @returns Datos de la entrada consultada
   */
  public consultarEntrada(id_entrada: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'entradas/' + id_entrada, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para modificar los datos de una entrada
   * @param entry_to_update Entrada a modificar
   * @returns Entrada actualizada
   */
  public modificarEntrada(entry_to_update: any): Observable<any> {
    const params = JSON.stringify(entry_to_update);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.put(this.url + 'modificar-entrada/' + entry_to_update.id_entrada, params, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para eliminar una entrada del historial
   * @param id_entrada Identificador de la entrada
   * @returns Entrada eliminada
   */
  public eliminarEntrada(id_entrada: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    const options = {
      headers: headers
    }

    return this.httpClient.delete(this.url + 'eliminar-entrada/' + id_entrada, options);
  }

  /**
   * Método encargado de llamar al api para obtener todas las descripciones de las entradas
   * @param ids Identificadores de las entradas
   * @returns Datos de la entrada consultada
   */
   public obtenerDescripciones(ids: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'entradasByIds/' + ids, { headers: headers });
  }

}
