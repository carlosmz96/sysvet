import { ConfirmationService, MessageService } from 'primeng/api';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cita } from 'src/app/models/Cita';
import { CitaService } from 'src/app/services/cita.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-listado-citas',
  templateUrl: './listado-citas.component.html',
  styleUrls: ['./listado-citas.component.css']
})
export class ListadoCitasComponent implements OnInit {
  public citas: Cita[] = [];
  public identity: any;

  constructor(
    private usuarioService: UsuarioService,
    private citaService: CitaService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.identity = usuarioService.getIdentity();
  }

  ngOnInit(): void {
    if (this.identity.rol != "administrador") {
      this.router.navigate(['acceso-denegado']);
    }

    this.obtenerCitas();
  }

  /**
   * Método encargado de obtener todas las citas
   */
  public obtenerCitas(): void {
    this.citaService.listarCitas().subscribe(
      response => {
        this.citas = response.citas as Cita[];

        this.citas.forEach(cita => {
          cita.fechaStr = this.formatearFecha(cita.fecha);
        });
      }
    );
  }

  /**
   * Método encargado de obtener el valor del target como un HTMLInputElement,
   * ya que en TypeScript lo marca como error a la primera de cambio
   * @param target objetivo
   * @returns el valor de dicho objetivo
   */
  getValueInput(target: any): string {
    return (target as HTMLInputElement).value;
  }

  /**
   * Método encargado de formatear la fecha
   * @param fecha Fecha de la cita
   * @returns Fecha formateada a cadena de texto
   */
  public formatearFecha(fecha: Date): string {
    const fecha2 = new Date(fecha);
    const dia = fecha2.getDate().toString().length < 2 ? '0' + fecha2.getDate() : fecha2.getDate();
    const mes = (fecha2.getMonth() + 1).toString().length < 2 ? '0' + (fecha2.getMonth() + 1) : (fecha2.getMonth() + 1);
    const anyo = fecha2.getFullYear();
    const hora = fecha2.getHours().toString().length < 2 ? '0' + fecha2.getHours() : fecha2.getHours();
    const minutos = fecha2.getMinutes().toString().length < 2 ? '0' + fecha2.getMinutes() : fecha2.getMinutes();

    return dia + '/' + mes + '/' + anyo + ' ' + hora + ':' + minutos;
  }

  /**
   * Método encargado de anular una cita específica
   * @param cita Cita a anular
   */
  public anularCita(cita: any): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de querer anular la cita?',
      accept: () => {
        this.citaService.anularCita(cita).subscribe(
          response => {
            this.obtenerCitas();
            this.addSuccessMessage('Se ha anulado la cita correctamente.');
          },
          error => {
            this.addErrorMessage(error.error.message);
          }
        );
      }
    });
  }

  /**
   * Método encargado de eliminar una cita específica
   * @param cita Cita a eliminar
   */
   public eliminarCita(cita: any): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de querer eliminar la cita?',
      accept: () => {
        this.citaService.eliminarCita(cita).subscribe(
          response => {
            this.obtenerCitas();
            this.addSuccessMessage('Se ha eliminado la cita correctamente.');
          },
          error => {
            this.addErrorMessage(error.error.message);
          }
        );
      }
    });
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
  public addErrorMessage(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de éxito
   * @param msg Mensaje pasado por parámetro
   */
  public addSuccessMessage(msg: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: msg });
  }

}
