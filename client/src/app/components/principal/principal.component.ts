import { PublicacionDocumental } from './../../models/PublicacionDocumental';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PublicacionService } from './../../services/publicacion.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Publicacion } from './../../models/Publicacion';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {
  public identity: any;
  public publicaciones: Publicacion[] = [];
  public publicacion: Publicacion;
  public descripcion: string = '';
  public descripciones: PublicacionDocumental[] = [];
  public publicacionesFiltradas: Publicacion[] = [];
  public totalPublicaciones: any = null;
  public rows: number = 5;
  public verPost: boolean = false;
  public crearPost: boolean = false;
  public editarPost: boolean = false;
  public sharePost: boolean = false;
  public url: string = window.location.href.toString();

  constructor(
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.publicacion = new Publicacion(0, new Date(), '', new Date(), '', null, '', null, '', '', '');
  }

  ngOnInit(): void {
    this.obtenerPublicaciones();
  }

  /**
   * Método encargado de obtener todas las publicaciones
   */
  public obtenerPublicaciones(): void {
    this.publicacionService.listarPublicaciones().subscribe(
      response => {
        this.publicaciones = response.publicaciones as Publicacion[];
        this.totalPublicaciones = this.publicaciones.length;
        this.descripciones = response.doc as PublicacionDocumental[];

        // formateo de fechas
        this.publicaciones.forEach(pub => {
          pub.creacionStr = this.formatearFecha(pub.fecha_creacion);
          pub.modificacionStr = this.formatearFecha(pub.fecha_modificacion);
          this.obtenerAutorPublicacion(pub);
        });

        // organización de publicaciones (colocar las descripciones en sus respectivas publicaciones)
        this.organizarPublicaciones();
        // ordenación de mayor a menor
        this.publicaciones.sort((a: Publicacion, b: Publicacion) => b.id_publicacion - a.id_publicacion);
        // se añaden a publicaciones filtradas
        this.primeraPagina();
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de organizar las publicaciones
   */
  public organizarPublicaciones(): void {
    this.publicaciones.forEach(pub => {
      pub.titulo = this.obtenerDocumentales(pub.id_publicacion).titulo;
      pub.descripcion = this.obtenerDocumentales(pub.id_publicacion).descripcion;
    });
  }

  /**
   * Método encargado de obtener la descripción mediante el id de la publicación
   * @param id_publicacion Identificador de la publicación
   */
  public obtenerDocumentales(id_publicacion: number): PublicacionDocumental {
    const des = this.descripciones.find(des => des._id == id_publicacion);
    return des!;
  }

  /**
   * Método encargado de paginar las publicaciones
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
      this.publicacionesPorPagina(event.page);
    }
  }

  /**
   * Método encargado de obtener la primera página de las publicaciones
   */
  public primeraPagina(): void {
    this.publicacionesFiltradas = [];

    // se añaden las publicaciones filtradas
    for (let i = 0; i < this.rows; i++) {
      if (this.publicaciones[i] != undefined) {
        this.publicacionesFiltradas.push(this.publicaciones[i]);
      }
    }
  }

  /**
   * Método encargado de obtener las publicaciones por página
   * @param pag Número de página
   */
  public publicacionesPorPagina(pag: number): void {
    this.publicacionesFiltradas = [];

    const inicio = pag * this.rows;

    for (let i = inicio; i < inicio + this.rows; i++) {
      if (this.publicaciones[i] != undefined) {
        this.publicacionesFiltradas.push(this.publicaciones[i]);
      }
    }
  }

  /**
   * Método encargado de formatear la fecha
   * @param fecha Fecha de la publicación
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
   * Método encargado de obtener el nombre del autor por dni
   * @param dni DNI del usuario a consultar
   * @returns Nombre del usuario
   */
  public obtenerAutorPublicacion(pub: Publicacion): void {
    this.usuarioService.consultarUsuario(pub.dni_creacion!).subscribe(
      response => {
        pub.autor = response.user.nombre;
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de hacer visible el dialogo de consulta
   */
  public consultarPublicacion(pub: Publicacion): void {
    this.verPost = true;

    this.publicacionService.consultarPublicacion(pub.id_publicacion).subscribe(
      response => {
        this.publicacion = response.publicacion;
        this.publicacion.titulo = response.doc.titulo;
        this.publicacion.descripcion = response.doc.descripcion;

        // formateo de fechas
        this.publicacion.creacionStr = this.formatearFecha(this.publicacion.fecha_creacion);
        this.publicacion.modificacionStr = this.formatearFecha(this.publicacion.fecha_modificacion);

        // obtención de autor y editor
        this.obtenerAutorPublicacion(this.publicacion);
        if (this.publicacion.dni_modificacion) {
          this.obtenerEditorPublicacion(this.publicacion);
        }
      },
      error => {
        this.addErrorMessage(error.error.message)
      }
    );
  }

  /**
   * Método encargado de obtener el nombre del editor por dni
   * @param dni DNI del usuario a consultar
   * @returns Nombre del usuario
   */
  public obtenerEditorPublicacion(pub: Publicacion): void {
    this.usuarioService.consultarUsuario(pub.dni_modificacion!).subscribe(
      response => {
        pub.editor = response.user.nombre;
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de mostrar el diálogo para crear una nueva publicación
   */
  public nuevaPublicacion(): void {
    this.crearPost = true;
    this.publicacion = new Publicacion(0, new Date(), '', new Date(), '', null, '', null, '', '', '');
  }

  /**
   * Método encargado de crear una nueva publicación
   */
  public crearPublicacion(): void {
    if (this.validarCampos()) {
      this.publicacion.dni_creacion = this.identity.dni;
      this.publicacionService.altaPublicacion(this.publicacion).subscribe(
        response => {
          this.addSuccessMessage('Publicación creada con éxito.');
          this.crearPost = false;
          this.obtenerPublicaciones();
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    }
  }

  /**
   * Método encargado de validar los campos a la hora de crear una nueva publicación
   * @returns TRUE/FALSE
   */
  public validarCampos(): boolean {
    let valido = true;

    if(this.publicacion.titulo == '') {
      valido = false;
      this.addErrorMessage('El título está vacío.');
    }
    if (this.publicacion.descripcion == '' || this.publicacion.descripcion == null) {
      valido = false;
      this.addErrorMessage('La descripción está vacía.');
    }

    return valido;
  }

  /**
   * Método encargado de mostrar el diálogo para modificar una publicación
   */
  public editarPublicacion(): void {
    this.editarPost = true;
    this.descripcion = this.publicacion.descripcion;
  }

  /**
   * Método encargado de modificar una publicación
   */
  public modificarPublicacion(): void {
    if (this.validarCampos()) {
      this.publicacion.dni_modificacion = this.identity.dni;
      this.publicacion.descripcion = this.descripcion;
      this.publicacionService.modificarPublicacion(this.publicacion).subscribe(
        response => {
          this.addSuccessMessage('Publicación modificada con éxito.');
          this.editarPost = false;
          this.verPost = false;
          this.obtenerPublicaciones();
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    }
  }

  /**
   * Método encargado de eliminar una publicacion
   */
  public eliminarPublicacion(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro?',
      accept: () => {
        this.publicacionService.eliminarPublicacion(id).subscribe(
          response => {
            this.obtenerPublicaciones();
            this.verPost = false;
          },
          error => {
            this.addErrorMessage(error.error.message);
          }
        );
      }
    });
  }

  /**
   * Método encargado de mostrar el diálogo para compartir una publicación
   */
  public compartirPublicacion(): void {
    this.sharePost = true;
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
