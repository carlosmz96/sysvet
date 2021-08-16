import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GLOBAL } from '../global';
import { UsuarioService } from './usuario.service';

@Injectable({
  providedIn: 'root'
})
export class VeterinarioServicioService {

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
   * Método encargado de llamar al api para crear una nueva asignación entre veterinario y servicio
   * @param dni Dni del veterinario
   * @param idServicio Id del servicio
   * @returns Relación creada
   */
  public crearRelacion(dni: string, idServicio: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    return this.httpClient.post(this.url + 'asignar-especializacion-veterinario/' + dni + '/' + idServicio, {}, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para obtener todas las especializaciones de un veterinario
   * @param dni Dni del veterinario
   * @returns Listado de especializaciones del veterinario
   */
  public listarEspecializacionesVeterinario(dni: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'especializaciones-veterinario/' + dni, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para obtener todas las relaciones según la especialidad
   * @param idServicio id del servicio o especialidad
   * @returns Listado de relaciones por especialidad
   */
   public listarVeterinariosPorEspecialidad(idServicio: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', this.token);
    return this.httpClient.get(this.url + 'veterinarios-por-especialidad/' + idServicio, { headers: headers });
  }

  /**
   * Método encargado de llamar al api para eliminar una relación
   * @param dni Dni del veterinario
   * @param idServicio Id del servicio
   * @returns Servicio eliminado
   */
   public eliminarRelacion(dni: string, idServicio: number): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': this.token });

    const options = {
      headers: headers
    }

    return this.httpClient.delete(this.url + 'desasignar-especializacion-veterinario/' + dni + '/' + idServicio, options);
  }

}
