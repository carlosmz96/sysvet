import { EntradaDocumental } from './../../models/EntradaDocumental';
import { Entrada } from './../../models/Entrada';
import { EntradaService } from './../../services/entrada.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Historial } from './../../models/Historial';
import { ActivatedRoute } from '@angular/router';
import { MascotaService } from './../../services/mascota.service';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Mascota } from 'src/app/models/Mascota';

@Component({
  selector: 'app-historial-mascota',
  templateUrl: './historial-mascota.component.html',
  styleUrls: ['./historial-mascota.component.css']
})
export class HistorialMascotaComponent implements OnInit {
  public identity: any;
  public idMascota: string = '';
  public mascota: Mascota;
  public idHistorial: number = 0;
  public historial: Historial;
  public entradas: Entrada[] = [];
  public descripciones: EntradaDocumental[] = [];
  public entradasFiltradas: Entrada[] = [];
  public totalEntradas: number = 0;
  public rows: number = 5;

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private entradaService: EntradaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.mascota = new Mascota('', '', '', '', '', '', '', 0, 0, '', 'default-image.png', '', '', '', null);
    this.historial = new Historial(0, '');
  }

  ngOnInit(): void {
    this.idMascota = this.route.snapshot.paramMap.get("idMascota")!;
    this.obtenerMascota();
    this.obtenerHistorial();
  }

  /**
   * Método encargado de obtener los datos de la mascota
   */
  public obtenerMascota(): void {
    if (this.idMascota != "") {
      this.mascotaService.consultarMascota(this.idMascota).subscribe(
        response => {
          this.mascota = response.pet;
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      )
    }
  }

  /**
   * Método encargado de obtener el historial de la mascota
   */
  public obtenerHistorial(): void {
    if (this.idMascota != "") {
      this.mascotaService.obtenerHistorial(this.idMascota).subscribe(
        response => {
          this.historial = response.historial;
          this.idHistorial = this.historial.id_historial;

          this.obtenerEntradas();
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      )
    }
  }

  /**
   * Método encargado de obtener el listado completo de entradas del historial de la mascota
   */
  public obtenerEntradas(): void {
    if (this.idHistorial != 0) {
      this.entradaService.obtenerEntradasHistorial(this.idHistorial).subscribe(
        response => {
          this.entradas = response.entradas as Entrada[];
          this.totalEntradas = this.entradas.length;

          let idsEntradas = '';
          this.entradas.forEach(entrada => {
            if (idsEntradas.length == 0) {
              idsEntradas += entrada.id_entrada;
            } else {
              idsEntradas += ',' + entrada.id_entrada;
            }

            entrada.creacionStr = this.formatearFecha(entrada.fecha_creacion);
            entrada.modificacionStr = this.formatearFecha(entrada.fecha_modificacion);
          });

          this.entradaService.obtenerDescripciones(idsEntradas).subscribe(
            response => {
              this.descripciones = response.docs as EntradaDocumental[];

              this.organizarEntradas();
              // ordenación de mayor a menor
              this.entradas.sort((a: Entrada, b: Entrada) => b.id_entrada - a.id_entrada);
              // se añaden a entradas filtradas
              this.primeraPagina();
            },
            error => {
              this.addErrorMessage(error.error.message);
            }
          )
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      )
    }
  }

  /**
   * Método encargado de organizar las entradas
   */
  public organizarEntradas(): void {
    this.entradas.forEach(entrada => {
      entrada.descripcion = this.obtenerDescripcion(entrada.id_entrada);
      if (entrada.descripcion.length > 500) {
        entrada.descripcion = entrada.descripcion.substring(0, 500) + '...';
      }
    });
  }

  /**
   * Método encargado de obtener la descripción mediante el id de la entrada
   * @param id_entrada Identificador de la entrada
   */
  public obtenerDescripcion(id_entrada: number): string {
    const des = this.descripciones.find(des => des._id == id_entrada);
    return des?.descripcion!;
  }

  /**
   * Método encargado de formatear la fecha
   * @param fecha Fecha de la entrada
   * @returns Fecha formateada a cadena de texto
   */
  public formatearFecha(fecha: Date): string {
    const fecha2 = new Date(fecha);
    const dia = fecha2.getDate().toString().length < 2 ? '0' + fecha2.getDate() : fecha2.getDate();
    const mes = (fecha2.getMonth() + 1).toString().length < 2 ? '0' + (fecha2.getMonth() + 1) : (fecha2.getMonth() + 1);
    const anyo = fecha2.getFullYear();
    const hora = fecha2.getHours().toString().length < 2 ? '0' + fecha2.getHours() : fecha2.getHours();
    const minutos = fecha2.getMinutes().toString().length < 2 ? '0' + fecha2.getMinutes() : fecha2.getMinutes();

    const hoy = new Date();
    if (fecha2.getMonth() == hoy.getMonth() && fecha2.getFullYear() == hoy.getFullYear()) {
      if (fecha2.getDate() == hoy.getDate()) {
        return 'Hoy a las ' + hora + ':' + minutos;
      } else if ((fecha2.getDate() + 1) == hoy.getDate()) {
        return 'Ayer a las ' + hora + ':' + minutos;
      } else {
        return dia + '/' + mes + '/' + anyo + ' a las ' + hora + ':' + minutos;
      }
    } else {
      return dia + '/' + mes + '/' + anyo + ' a las ' + hora + ':' + minutos;
    }
  }

  /**
   * Método encargado de paginar las entradas
   * @param event Evento al cambiar de página
   */
  public paginate(event: any): void {
    //event.first = Index of the first record
    //event.rows = Number of rows to display in new page
    //event.page = Index of the new page
    //event.pageCount = Total number of pages
    if (event.page == 0) {
      this.primeraPagina();
    } else {
      this.entradasPorPagina(event.page);
    }
  }

  /**
   * Método encargado de obtener la primera página de las entradas
   */
  public primeraPagina(): void {
    this.entradasFiltradas = [];

    // se añaden las entradas filtradas
    for (let i = 0; i < this.rows; i++) {
      if (this.entradas[i] != undefined) {
        this.entradasFiltradas.push(this.entradas[i]);
      }
    }
  }

  /**
   * Método encargado de obtener las entradas por página
   * @param pag Número de página
   */
  public entradasPorPagina(pag: number): void {
    this.entradasFiltradas = [];

    const inicio = pag * this.rows;
    console.log(inicio)

    for (let i = inicio; i < inicio + this.rows; i++) {
      if (this.entradas[i] != undefined) {
        this.entradasFiltradas.push(this.entradas[i]);
      }
    }
  }

  /**
   * Método encargado de eliminar una entrada
   */
   public eliminarEntrada(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro?',
      accept: () => {
        this.entradaService.eliminarEntrada(id).subscribe(
          response => {
            this.obtenerEntradas();
          },
          error => {
            this.addErrorMessage(error.error.message);
          }
        );
      }
    });
  }

  /**
   * Método encargado de volver a la página anteriormente visitada
   */
  public goBack(): void {
    this.location.back();
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
  public addErrorMessage(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

}
