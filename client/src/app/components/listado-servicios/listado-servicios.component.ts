import { ConfirmationService, MessageService } from 'primeng/api';
import { ServicioService } from './../../services/servicio.service';
import { Servicio } from './../../models/Servicio';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-servicios',
  templateUrl: './listado-servicios.component.html',
  styleUrls: ['./listado-servicios.component.css']
})
export class ListadoServiciosComponent implements OnInit {
  public servicios: Servicio[] = [];
  public identity: any;

  constructor(
    private usuarioService: UsuarioService,
    private servicioService: ServicioService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.identity = this.usuarioService.getIdentity();
  }

  ngOnInit(): void {
    if (this.identity.rol != "administrador") {
      this.router.navigate(['acceso-denegado']);
    } else {
      this.obtenerServicios();
    }
  }

  /**
   * Método encargado de obtener todos los servicios
   */
   public obtenerServicios(): void {
    this.servicioService.listarServicios().subscribe(
      response => {
        this.servicios = response.servicios as Servicio[];
      },
      error => {
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['login']).then(() => {
            window.location.reload();
          });
        }
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
   * Método encargado de eliminar un servicio del sistema
   * @param servicio Servicio a eliminar
   */
  public eliminarServicio(servicio: any): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de querer eliminar el servicio?',
      accept: () => {
        this.servicioService.bajaServicio(servicio.id_servicio).subscribe(
          response => {
            this.obtenerServicios();
            this.addSuccessMessage('Se ha eliminado el servicio correctamente.');
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
