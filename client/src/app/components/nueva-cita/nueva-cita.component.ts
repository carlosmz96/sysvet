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
  public token: any;
  public cita: Cita;
  public usuario: Usuario;
  public mascotas: Mascota[] = [];
  public mascota: any;
  public dniUsuario: string = '';
  public fecha: any;
  public fechaCompleta: any;
  public citas: Cita[] = [];
  public dias: string[] = [];
  public invalidDates: Array<Date> = [];
  public horas: SelectItem[] = [];
  public horaSeleccionada: string = '';

  public message: string = '';
  public subscription: Subscription = new Subscription();

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private citaService: CitaService,
    private dataService: DataService,
    private messageService: MessageService,
    private location: Location,
    private primeNGConfig: PrimeNGConfig,
    private router: Router
  ) {
    this.identity = this.usuarioService.getIdentity();

    this.cita = new Cita('', '', '', new Date(), '', '', '');
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '');

    this.obtenerUsuario();
    this.obtenerCitas();
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Método submit
   */
  public onSubmit(): void {
    if (this.validarCampos() == 0) {
      const fechaStr = new Date(this.fecha).toString().substring(0, 16) + this.horaSeleccionada + ':00 GMT+0200';
      this.fechaCompleta = new Date(fechaStr);

      // asignación de datos a la cita
      this.cita.microchip = this.mascota.microchip;
      this.cita.propietario = this.dniUsuario;
      this.cita.fecha = this.fechaCompleta;

      this.citaService.nuevaCita(this.cita).subscribe(
        response => {
          const datos: any = {
            dni : this.dniUsuario,
            microchip : this.mascota.microchip,
            fecha : this.cita.fecha,
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
    if (this.identity) {
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
          this.addErrorMessage('Error al obtener el usuario.');
        }
      );
    }
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
          this.addErrorMessage('Error al intentar obtener el listado de mascotas.');
        }
      )
    }
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
        this.addErrorMessage('No se han podido obtener las citas.');
      }
    );
  }

  /**
   * Método encargado de filtrar las horas que estén disponibles
   */
  public filtrarHoras(): void {
    this.citas.forEach(cita => {
      if (this.fecha.toString().substring(0,15) == new Date(cita.fecha).toString().substring(0,15)) {
        const fecha = new Date(cita.fecha);
        const hora = fecha.getHours().toString().length < 2 ? '0' + fecha.getHours().toString() : fecha.getHours();
        const minutos = fecha.getMinutes().toString().length < 2 ? '0' + fecha.getMinutes().toString() : fecha.getMinutes();
        const horaTotal = hora + ':' + minutos;
        this.horas = this.horas.filter(hora => hora.value != horaTotal);
      }
    });
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
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
  public addErrorMessage(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

}
