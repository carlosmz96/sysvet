import { ServicioService } from './../../services/servicio.service';
import { Servicio } from './../../models/Servicio';
import { Mascota } from 'src/app/models/Mascota';
import { Usuario } from 'src/app/models/Usuario';
import { Cita } from 'src/app/models/Cita';
import { MascotaService } from 'src/app/services/mascota.service';
import { Component, OnInit } from '@angular/core';
import { CitaService } from 'src/app/services/cita.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Location } from '@angular/common';

@Component({
  selector: 'app-consultar-cita',
  templateUrl: './consultar-cita.component.html',
  styleUrls: ['./consultar-cita.component.css']
})
export class ConsultarCitaComponent implements OnInit {
  public idCita: string = '';
  public cita: Cita;
  public usuario: Usuario;
  public veterinario: Usuario;
  public mascota: Mascota;
  public servicio: Servicio;
  public identity: any;

  constructor(
    private citaService: CitaService,
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private servicioService: ServicioService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private location: Location
  ) {
    this.cita = new Cita('', '', '', '', new Date(), '', 0, '', '', '');
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '', '', '', '');
    this.veterinario = new Usuario('', '', '', '', '', '', '', '', '', '', '', '');
    this.mascota = new Mascota('', '', '', '', '', '', '', 0, 0, '', 'default-image.png', '', '', '', null);
    this.servicio = new Servicio(null, '', '');

    this.identity = this.usuarioService.getIdentity();

    this.idCita = this.route.snapshot.paramMap.get('id_cita')!;
    this.obtenerCita(this.idCita);
  }

  ngOnInit(): void { }

  /**
   * Método encargado de obtener la cita mediante su id
   * @param idCita Id de la cita
   */
  public obtenerCita(idCita: string): void {
    this.citaService.consultarCita(idCita).subscribe(
      response => {
        this.cita = response.cita;
        this.cita.fechaStr = this.formatearFecha(this.cita.fecha);
        this.citaService.obtenerMotivoCita(idCita).subscribe(
          response => {
            this.cita.motivo = response.doc.motivo;
            this.obtenerPropietario(this.cita.propietario);
            this.obtenerVeterinario(this.cita.veterinario);
            this.obtenerMascota(this.cita.mascota);
            this.obtenerServicio(this.cita.servicio);
            this.compruebaUsuario();
          },
          error => {
            this.addErrorMessage(error.error.message);
          }
        );
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

  /**
   * Método encargado de obtener los datos del propietario mediante el dni
   * @param dni Dni del propietario
   */
  public obtenerPropietario(dni: string): void {
    this.usuarioService.consultarUsuario(dni).subscribe(
      response => {
        this.usuario = response.user;
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de obtener los datos de un usuario veterinario
   * @param dni Dni del veterinario
   */
  public obtenerVeterinario(dni: string): void {
    this.usuarioService.consultarUsuario(dni).subscribe(
      response => {
        this.veterinario = response.user;
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de obtener los datos de la mascota mediante el identificador
   * @param identificador Identificador de la mascota
   */
  public obtenerMascota(identificador: string): void {
    this.mascotaService.consultarMascota(identificador).subscribe(
      response => {
        this.mascota = response.pet;
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de obtener un servicio
   * @param id Identificación del servicio
   */
  public obtenerServicio(id: number) {
    this.servicioService.consultarServicio(id).subscribe(
      response => {
        this.servicio = response.servicio;
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    )
  }

  /**
   * Método encargado de formatear la fecha
   * @param fecha Fecha y hora en formato Date
   * @returns Cadena con la fecha y hora
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
   * Método encargado de volver a la página anterior
   */
  public goBack(): void {
    this.location.back();
  }

  /**
   * Método encargado de comprobar el usuario
   * Si el usuario no es el adecuado, le mandará a acceso denegado
   */
  public compruebaUsuario(): void {
    if (this.identity.rol != 'administrador' && this.identity.rol != 'veterinario' && this.identity.dni != this.cita.propietario) {
      this.router.navigate(['acceso-denegado']);
    }
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de éxito
   * @param msg Mensaje pasado por parámetro
   */
  public addSuccessMessage(msg: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: msg });
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
  public addErrorMessage(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

}
