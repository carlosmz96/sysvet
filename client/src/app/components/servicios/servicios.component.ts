import { ServicioDocumental } from './../../models/ServicioDocumental';
import { Servicio } from './../../models/Servicio';
import { Component, OnInit } from '@angular/core';
import { MessageService, TreeNode } from 'primeng/api';
import { ServicioService } from './../../services/servicio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  public servicios: Servicio[] = [];
  public servicioDocumental: ServicioDocumental;
  public services: any[] = [];

  constructor(
    private servicioService: ServicioService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.servicioDocumental = new ServicioDocumental(0, '');
  }

  ngOnInit(): void {
    this.obtenerServicios();
    console.log(this.services.sort((a: Servicio, b: Servicio) => a.nombre.localeCompare(b.nombre)));
  }

  /**
   * Método encargado de obtener todos los servicios del sistema
   */
  public obtenerServicios(): void {
    this.servicioService.listarServicios().subscribe(
      response => {
        this.servicios = response.servicios;
        this.servicios.forEach(servicio => {
          this.servicioService.obtenerDescripcionServicio(servicio.id_servicio!).subscribe(
            response => {
              const data = {
                "codigo" : servicio.codigo,
                "nombre" : servicio.nombre,
                "descripcion" : response.doc.descripcion
              };
              this.services.push(data);
              this.services.sort((a: Servicio, b: Servicio) => a.nombre.localeCompare(b.nombre));
            }
          );
        });
      },
      error => {
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['login']).then(() => {
            window.location.reload();
          });
        }
        this.addErrorMessage(error.error.message);
      }
    )
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
  public addErrorMessage(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

}
