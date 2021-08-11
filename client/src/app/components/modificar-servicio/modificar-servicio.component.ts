import { ServicioService } from './../../services/servicio.service';
import { ServicioDocumental } from './../../models/ServicioDocumental';
import { Component, OnInit } from '@angular/core';
import { Servicio } from 'src/app/models/Servicio';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modificar-servicio',
  templateUrl: './modificar-servicio.component.html',
  styleUrls: ['./modificar-servicio.component.css']
})
export class ModificarServicioComponent implements OnInit {
  public identity: any;
  public servicio: Servicio;
  public servicioDocumental: ServicioDocumental;
  public idServicio: string = '';

  constructor(
    private usuarioService: UsuarioService,
    private servicioService: ServicioService,
    private messageService: MessageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.servicio = new Servicio(null, '', '');
    this.servicioDocumental = new ServicioDocumental(0, '');
  }

  ngOnInit(): void {
    this.idServicio = this.route.snapshot.paramMap.get('id')!;
    if (this.idServicio == "") {
      this.router.navigate(['index']);
    } else {
      this.obtenerServicio();
    }
  }

  /**
   * Método encargado de modificar los datos del servicio
   */
  public onSubmit(): void {
    this.servicioService.modificarServicio(this.servicio).subscribe(
      response => {
        this.servicioService.modificarDescripcionServicio(this.servicioDocumental).subscribe(
          response => {
            this.addSuccessMessage('Servicio modificado con éxito.');
          },
          error => {
            this.addErrorMessage(error.error.message);
          }
        );
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de obtener los datos del servicio
   */
  public obtenerServicio(): void {
    this.servicioService.consultarServicio(parseInt(this.idServicio)).subscribe(
      response => {
        this.servicio = response.servicio;
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );

    this.servicioService.obtenerDescripcionServicio(parseInt(this.idServicio)).subscribe(
      response => {
        this.servicioDocumental = response.doc;
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de redirigir a la lista de servicios
   */
  public goBack(): void {
    this.router.navigate(['listado-servicios']);
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
