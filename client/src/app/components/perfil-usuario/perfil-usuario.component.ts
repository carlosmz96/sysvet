import { ServicioService } from './../../services/servicio.service';
import { VeterinarioServicioService } from './../../services/veterinario-servicio.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/Usuario';

import { GLOBAL } from '../../global';
import { Mascota } from '../../models/Mascota';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MascotaService } from 'src/app/services/mascota.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Cita } from 'src/app/models/Cita';
import { CitaService } from 'src/app/services/cita.service';
import { Servicio } from 'src/app/models/Servicio';
import { VeterinarioServicio } from 'src/app/models/VeterinarioServicio';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  public usuario: Usuario;
  public mascotas: Mascota[] = [];
  public citas: Cita[] = [];
  public dniUsuario: string = "";
  public url: string = "";
  public identity: any;
  public especializaciones: Servicio[] = [];
  public serviciosAsociados: VeterinarioServicio[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private citaService: CitaService,
    private servicioService: ServicioService,
    private vetServService: VeterinarioServicioService,
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '', '', '', '');
    this.url = GLOBAL.url;
    this.identity = this.usuarioService.getIdentity();
    // permite suscribirse al cambio de ruta para poder recargar el componente sin recargar la página
    this.subscribeRouteChange();
  }

  /**
   * Método que se ejecuta al visualizar el componente
   * 1) Obtiene el dni del usuario (si no hay ninguno, redirecciona a la página principal)
   * 2) Consulta el usuario
   * 3) Si la imagen del usuario es nula, se sustituye por la foto por defecto
   * 4) Obtención de las especializaciones del veterinario
   * 5) Obtiene las mascotas asociadas al usuario
   */
  ngOnInit(): void {
    this.dniUsuario = this.route.snapshot.paramMap.get('dni')!;
    if (this.dniUsuario == "") {
      this.router.navigate(['index']);
    } else {
      this.usuarioService.consultarUsuario(this.dniUsuario).subscribe(
        response => {
          this.usuario = response.user;
          if (this.usuario.foto == null) {
            this.usuario.foto = 'default-image.png';
          }

          // si el usuario es veterinario, obtiene sus especializaciones
          if (this.usuario.rol == 'veterinario') {
            this.obtenerEspecializaciones();
          }
        },
        error => {
          if (error.status == 401) {
            localStorage.clear();
            this.router.navigate(['login']).then(() => {
              window.location.reload();
            });
          }
          this.addErrorMessage('Error al obtener todos los datos del usuario.');
        }
      );

      // carga de mascotas asociadas al usuario
      this.mascotaService.listarMascotas().subscribe(
        response => {
          const mascotasSinFiltrar = response.pets as Mascota[];
          if (this.usuario.rol == "administrador" || this.usuario.rol == "cliente") {
            this.mascotas = mascotasSinFiltrar.filter(mascota => mascota.propietario == this.dniUsuario);
          } else {
            this.mascotas = mascotasSinFiltrar.filter(mascota => mascota.veterinario == this.dniUsuario);
          }
          this.mascotas.forEach(mascota => {
            if (mascota.imagen == null) {
              mascota.imagen = 'default-image.png';
            }
          });
        },
        error => {
          this.addErrorMessage('Error al obtener la lista de mascotas asociadas al usuario.');
        }
      );

      //carga de citas asociadas al propietario
      this.obtenerCitas();
    }
  }

  /**
   * Método encargado de obtener todas las citas activas del propietario
   */
  public obtenerCitas(): void {
    this.citaService.consultarCitasPropietario(this.dniUsuario).subscribe(
      response => {
        this.citas = response.citas as Cita[];
        this.citas.forEach(cita => {
          cita.fechaStr = this.formatearFecha(cita.fecha);
          this.mascotaService.consultarMascota(cita.mascota).subscribe(
            response => {
              cita.nombreMascota = response.pet.nombre;
            },
            error => {
              this.addErrorMessage(error.error.message);
            }
          )
        });
      },
      error => {
        this.addErrorMessage('Error al obtener la lista de citas del propietario.');
      }
    );
  }

  /**
   * Método encargado de suscribirse al cambio de ruta
   */
  subscribeRouteChange() {
    this.activatedRoute.params.subscribe((params = {}) => {
      this.ngOnInit();
    });
  }

  /**
   * Método encargado de dar de baja al usuario
   * @param dni Dni del usuario a dar de baja
   */
  public bajaUsuario(dni: string): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro?',
      accept: () => {
        this.usuarioService.bajaUsuario(dni).subscribe(
          response => {
            if (this.identity.dni == dni) {
              this.router.navigate(['index']);
            } else {
              this.router.navigate(['listado-usuarios']);
            }
          },
          error => {
            this.addErrorMessage(error.error.message);
          }
        )
      }
    });
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
   * Método encargado de obtener todas las especializaciones del veterinario
   */
  public obtenerEspecializaciones(): void {
    this.vetServService.listarEspecializacionesVeterinario(this.dniUsuario).subscribe(
      response => {
        this.serviciosAsociados = response.servicios as VeterinarioServicio[];

        let idsServicios = '';
        this.serviciosAsociados.forEach(servicio => {
          if (idsServicios.length == 0) {
            idsServicios += servicio.id_servicio;
          } else {
            idsServicios += ',' + servicio.id_servicio;
          }
        });

        // obtenemos todos los servicios que tenga asociados el veterinario
        this.servicioService.listarServiciosByIds(idsServicios).subscribe(
          response => {
            this.especializaciones = response.servicios as Servicio[];
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

}
