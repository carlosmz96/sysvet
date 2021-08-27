import { VeterinarioServicio } from './../../models/VeterinarioServicio';
import { VeterinarioServicioService } from './../../services/veterinario-servicio.service';
import { ServicioService } from './../../services/servicio.service';
import { Servicio } from './../../models/Servicio';
import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Cita } from 'src/app/models/Cita';
import { Mascota } from 'src/app/models/Mascota';
import { Usuario } from 'src/app/models/Usuario';
import { CitaService } from 'src/app/services/cita.service';
import { DataService } from 'src/app/services/data.service';
import { MascotaService } from 'src/app/services/mascota.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-nueva-cita',
  templateUrl: './nueva-cita.component.html',
  styleUrls: ['./nueva-cita.component.css']
})
export class NuevaCitaComponent implements OnInit, OnDestroy {
  public identity: any;
  public cita: Cita;
  public usuarios: Usuario[] = [];
  public usuario: any;
  public veterinarios: Usuario[] = [];
  public veterinario: any;
  public mascotas: Mascota[] = [];
  public mascota: any;
  public servicios: Servicio[] = [];
  public servicio: any;
  public dniUsuario: string = '';
  public fecha: any;
  public fechaCompleta: any;
  public citas: Cita[] = [];
  public dias: string[] = [];
  public invalidDates: Array<Date> = [];
  public horas: SelectItem[] = [];
  public horaSeleccionada: string = '';
  public dropActivo: boolean = false;
  public vetActivo: boolean = false;

  public message: string = '';
  public subscription: Subscription = new Subscription();

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private servicioService: ServicioService,
    private vetServService: VeterinarioServicioService,
    private citaService: CitaService,
    private dataService: DataService,
    private messageService: MessageService,
    private location: Location,
    private primeNGConfig: PrimeNGConfig,
    private router: Router
  ) {
    this.identity = this.usuarioService.getIdentity();

    this.cita = new Cita('', '', '', '', new Date(), '', 0, '', '', 'S');

    if (this.identity.rol != 'veterinario') {
      this.obtenerUsuario();
    } else {
      this.obtenerPropietarios();
    }
    this.obtenerCitas();
    this.obtenerServicios();
  }

  /**
   * 1) Configuración del idioma del calendario
   * 2) Genera las horas
   */
  ngOnInit(): void {
    this.subscription = this.dataService.currentMessage.subscribe(msg => this.message = msg);

    this.configurarIdiomaCalendario();
    this.generarHoras();
  }

  /**
   * Método on destroy que permite desuscribirse del servicio de mensajería
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Método encargado de solicitar la cita
   */
  public onSubmit(): void {
    if (this.validarCampos() == 0) {
      const fechaStr = new Date(this.fecha).toString().substring(0, 16) + this.horaSeleccionada + ':00 GMT+0200';
      this.fechaCompleta = new Date(fechaStr);

      // asignación de datos a la cita
      this.cita.mascota = this.mascota.identificador;
      this.cita.propietario = this.dniUsuario;
      this.cita.fecha = this.fechaCompleta;
      this.cita.servicio = this.servicio.id_servicio;
      this.cita.veterinario = this.veterinario.dni;

      this.citaService.nuevaCita(this.cita).subscribe(
        response => {
          const datos: any = {
            dni: this.dniUsuario,
            idMascota: this.mascota.identificador,
            fecha: this.cita.fecha,
            servicio: this.cita.servicio,
            veterinario: this.cita.veterinario,
            motivo: this.cita.motivo
          }
          this.dataService.changeMessage(JSON.stringify(datos));
          this.router.navigate(['cita-solicitada']);
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    }
  }

  /**
   * Método encargado de obtener el usuario
   */
  public obtenerUsuario(): void {
    if (this.identity && this.identity.rol != 'veterinario') {
      this.usuarioService.consultarUsuario(this.identity.dni).subscribe(
        response => {
          if (!response) {
            this.addErrorMessage('Usuario no encontrado.');
          } else {
            this.usuario = response.user;
            this.dniUsuario = this.usuario.dni;
            this.obtenerMascotasDelUsuario();
          }
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    }
  }

  /**
   * Método encargado de obtener todos los usuarios propietarios del sistema
   */
  public obtenerPropietarios(): void {
    this.usuarioService.listarUsuarios().subscribe(
      response => {
        this.usuarios = response.users as Usuario[];
        this.usuarios = this.usuarios.filter(u => u.rol == 'cliente');
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de asignar el dni de usuario
   */
  public obtenerMascotas(): void {
    this.dniUsuario = this.usuario.dni;
    this.obtenerMascotasDelUsuario();
  }

  /**
   * Método encargado de obtener las mascotas del usuario
   */
  public obtenerMascotasDelUsuario(): void {
    if (this.dniUsuario != null) {
      this.mascotaService.listarMascotas().subscribe(
        response => {
          if (!response) {
            this.addErrorMessage('No se pudo obtener la lista de mascotas.');
          } else {
            const mascotasSinFiltrar = response.pets as Mascota[];
            if (this.usuario.rol == "administrador" || this.usuario.rol == "cliente") {
              this.mascotas = mascotasSinFiltrar.filter(mascota => mascota.propietario == this.usuario.dni);
            } else {
              this.mascotas = mascotasSinFiltrar.filter(mascota => mascota.veterinario == this.usuario.dni);
            }
          }
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      )
    }
  }

  /**
   * Método encargado de obtener todos los servicios del sistema
   */
  public obtenerServicios(): void {
    this.servicioService.listarServicios().subscribe(
      response => {
        this.servicios = response.servicios as Servicio[];
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    )
  }

  /**
   * Método encargado de obtener todas las citas del sistema
   */
  public obtenerCitas(): void {
    this.citaService.listarCitas().subscribe(
      response => {
        this.citas = response.citas as Cita[];
        this.invalidarFechas();
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
   * Método encargado de filtrar las horas que estén disponibles
   * 1) si la fecha elegida es del mismo día o anterior, pinta un error
   * 2) si la mascota ya tiene cita en la fecha elegida, pinta un error
   * 3) si no, filtra el número de horas disponibles
   */
  public filtrarHoras(): void {
    if (new Date(this.fecha) < new Date()) {
      this.addErrorMessage('Debe elegir una fecha futura');
      this.dropActivo = false;
    } else {
      if (this.mascota) {
        if (!this.tieneCitaEnFecha()) {
          this.citas.forEach(cita => {
            if (this.fecha.toString().substring(0, 15) == new Date(cita.fecha).toString().substring(0, 15) && cita.activa == 'S') {
              const fecha = new Date(cita.fecha);
              const hora = fecha.getHours().toString().length < 2 ? '0' + fecha.getHours().toString() : fecha.getHours();
              const minutos = fecha.getMinutes().toString().length < 2 ? '0' + fecha.getMinutes().toString() : fecha.getMinutes();
              const horaTotal = hora + ':' + minutos;
              this.horas = this.horas.filter(hora => hora.value != horaTotal);
            }
          });
          this.dropActivo = true;
        } else {
          this.addErrorMessage('La mascota ya tiene una cita para la fecha seleccionada.');
        }
      }
    }
  }

  /**
   * Método encargado de comprobar si la mascota ya tiene cita en la fecha seleccionada
   * @returns TRUE/FALSE
   */
  public tieneCitaEnFecha(): boolean {
    let tiene = false;

    this.citas.forEach(cita => {
      const fecha = new Date(cita.fecha);
      const fecha1 = fecha.getDate() + '/' + fecha.getMonth() + '/' + fecha.getFullYear();
      const fecha2 = this.fecha.getDate() + '/' + this.fecha.getMonth() + '/' + this.fecha.getFullYear();
      if (fecha1 == fecha2 && cita.mascota == this.mascota.identificador && cita.activa == 'S') {
        tiene = true;
      }
    });

    return tiene;
  }

  /**
   * Método encargado de invalidar las fechas en el calendario
   * si todas las horas de ese día están ocupadas
   */
  public invalidarFechas(): void {
    this.obtenerDias();
    this.dias.forEach(dia => {
      const horarios: string[] = [];
      this.citas.forEach(cita => {
        if (dia == cita.fecha.toString().substring(0, 10)) {
          const fecha = new Date(cita.fecha);
          const hora = fecha.getHours().toString().length < 2 ? '0' + fecha.getHours().toString() : fecha.getHours();
          const minutos = fecha.getMinutes().toString().length < 2 ? '0' + fecha.getMinutes().toString() : fecha.getMinutes();
          const horaTotal = hora + ':' + minutos;
          horarios.push(horaTotal);
        }
      });
      if (horarios.length == this.horas.length) {
        this.invalidDates.push(new Date(dia));
      }
    });
  }

  /**
   * Método encargado de obtener los dias de todas las fechas
   */
  public obtenerDias(): void {
    this.citas.forEach(cita => {
      const dia = cita.fecha.toString().substring(0, 10);
      this.dias.push(dia);
    });
  }

  /**
   * Método encargado de redireccionar al listado de mascotas
   */
  public goBack(): void {
    this.location.back();
  }

  /**
   * Método encargado de configurar el idioma del calendario
   */
  public configurarIdiomaCalendario(): void {
    this.primeNGConfig.setTranslation(
      {
        dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
        dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
        dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
        today: 'Hoy',
        clear: 'Limpiar',
      }
    );
  }

  /**
   * Método encargado de generar la lista de horas
   */
  public generarHoras(): void {
    let ele = '';
    for (let i = 9; i <= 21; i++) {
      for (let j = 0; j <= 1; j++) {
        if (j == 0) {
          if (i < 10) {
            ele = '0' + i + ':00';
          } else {
            ele = i + ':00';
          }
        } else {
          if (i < 10) {
            ele = '0' + i + ':30';
          } else {
            ele = i + ':30';
          }
        }

        this.horas.push({ label: ele, value: ele });
      }
    }
  }

  /**
   * Método encargado de validar los campos
   */
  public validarCampos(): number {
    let cont = 0;

    if (!this.mascota) {
      this.addErrorMessage("El campo 'Mascota' es obligatorio.");
      cont++;
    }

    if (!this.fecha) {
      this.addErrorMessage("El campo 'Fecha' es obligatorio.");
      cont++;
    }

    if (!this.horaSeleccionada) {
      this.addErrorMessage("El campo 'Hora' es obligatorio.");
      cont++;
    }

    if (!this.cita.motivo) {
      this.addErrorMessage("El campo 'Motivo' es obligatorio.");
      cont++;
    }

    return cont;
  }

  /**
   * Método encargado de habilitar el dropdown de veterinarios
   */
  public habilitarDropVet(): void {
    this.vetActivo = true;
    this.obtenerVeterinariosPorEspecialidad();
  }

  public obtenerVeterinariosPorEspecialidad(): void {
    if (this.servicio) {
      this.vetServService.listarVeterinariosPorEspecialidad(this.servicio.id_servicio).subscribe(
        response => {
          const relaciones = response.relaciones as VeterinarioServicio[];

          let dnis = '';
          relaciones.forEach(rel => {
            if (dnis.length == 0) {
              dnis += rel.dni;
            } else {
              dnis += ',' + rel.dni;
            }
          });

          if (dnis.length > 0) {
            this.usuarioService.listarUsuariosByDnis(dnis).subscribe(
              response => {
                this.veterinarios = response.users as Usuario[];
              },
              error => {
                this.addErrorMessage(error.error.message);
              }
            );
          } else if (relaciones.length == 0) {
            this.veterinarios = [];
          }
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    }
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
  public addErrorMessage(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

}
