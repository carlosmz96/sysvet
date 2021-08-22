import { Usuario } from './../../models/Usuario';
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Entrada } from 'src/app/models/Entrada';
import { Mascota } from 'src/app/models/Mascota';
import { EntradaService } from 'src/app/services/entrada.service';
import { MascotaService } from 'src/app/services/mascota.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-consultar-entrada',
  templateUrl: './consultar-entrada.component.html',
  styleUrls: ['./consultar-entrada.component.css']
})
export class ConsultarEntradaComponent implements OnInit {
  public identity: any;
  public idMascota: string = '';
  public mascota: Mascota;
  public entrada: Entrada;
  public idEntrada: string = '';
  public autor: Usuario;
  public editor: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private entradaService: EntradaService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.mascota = new Mascota('', '', '', '', '', '', '', 0, 0, '', 'default-image.png', '', '', '', null);
    this.entrada = new Entrada(0, 0, new Date(), '', new Date(), '', null, null, '');
    this.autor = new Usuario('', '', '', '', '', '', '', '', '', '', '', '');
    this.editor = new Usuario('', '', '', '', '', '', '', '', '', '', '', '');
  }

  ngOnInit(): void {
    this.idMascota = this.route.snapshot.paramMap.get('idMascota')!;
    this.idEntrada = this.route.snapshot.paramMap.get('idEntrada')!;

    this.obtenerMascota();
    this.obtenerEntrada();
  }

  /**
   * Método encargado de obtener los datos de la mascota
   */
  public obtenerMascota(): void {
    this.mascotaService.consultarMascota(this.idMascota).subscribe(
      response => {
        this.mascota = response.pet;
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
   * Método encargado de obtener los datos de la entrada
   */
  public obtenerEntrada(): void {
    this.entradaService.consultarEntrada(parseInt(this.idEntrada)).subscribe(
      response => {
        this.entrada = response.entrada;
        this.entrada.descripcion = response.doc.descripcion;

        this.entrada.creacionStr = this.formatearFecha(this.entrada.fecha_creacion);
        this.entrada.modificacionStr = this.formatearFecha(this.entrada.fecha_modificacion);

        if (this.entrada.dni_modificacion) {
          this.obtenerEditor();
        } else {
          this.obtenerAutor();
        }
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de obtener al autor de la entrada
   */
  public obtenerAutor(): void {
    this.usuarioService.consultarUsuario(this.entrada.dni_creacion!).subscribe(
      response => {
        this.autor = response.user;
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de obtener al editor de la entrada
   */
  public obtenerEditor(): void {
    this.usuarioService.consultarUsuario(this.entrada.dni_modificacion!).subscribe(
      response => {
        this.editor = response.user;
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
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
        return 'hoy a las ' + hora + ':' + minutos;
      } else if ((fecha2.getDate() + 1) == hoy.getDate()) {
        return 'ayer a las ' + hora + ':' + minutos;
      } else {
        return 'el ' + dia + '/' + mes + '/' + anyo + ' a las ' + hora + ':' + minutos;
      }
    } else {
      return 'el ' + dia + '/' + mes + '/' + anyo + ' a las ' + hora + ':' + minutos;
    }
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
