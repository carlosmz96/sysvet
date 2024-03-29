import { ServicioDocumental } from './../../models/ServicioDocumental';
import { ServicioService } from './../../services/servicio.service';
import { Servicio } from './../../models/Servicio';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-alta-servicio',
  templateUrl: './alta-servicio.component.html',
  styleUrls: ['./alta-servicio.component.css']
})
export class AltaServicioComponent implements OnInit {
  public servicio: Servicio;
  public servicioDocumental: ServicioDocumental;
  public identity: any;

  constructor(
    private servicioService: ServicioService,
    private usuarioService: UsuarioService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.servicio = new Servicio(null, '', '');
    this.servicioDocumental = new ServicioDocumental(0, '');
  }

  ngOnInit(): void {
    if (this.identity.rol != "administrador") {
      this.router.navigate(['acceso-denegado']);
    }
  }

  /**
   * Método encargado de dar de alta un nuevo servicio
   */
  public onSubmit(): void {
    if (this.validarCampos()) {
      const data = {
        "codigo": this.servicio.codigo,
        "nombre": this.servicio.nombre,
        "descripcion": this.servicioDocumental.descripcion
      }

      this.servicioService.altaServicio(data).subscribe(
        response => {
          this.router.navigate(['listado-servicios']);
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
      );
    }
  }

  /**
   * Método encargado para validar los campos del formulario
   * @returns TRUE/FALSE
   */
  public validarCampos(): boolean {
    let esValido = true;

    if (this.servicio.codigo == '') {
      esValido = false;
      this.addErrorMessage("El campo 'Código' está vacío");
    }
    if (this.servicio.nombre == '') {
      esValido = false;
      this.addErrorMessage("El campo 'Nombre' está vacío");
    }
    if (this.servicioDocumental.descripcion == '' || this.servicioDocumental.descripcion == null) {
      esValido = false;
      this.addErrorMessage("El campo 'Descripción' está vacío");
    }

    return esValido;
  }

  /**
   * Método encargado de redireccionar al listado de servicios
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

}
