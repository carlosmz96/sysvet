import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionService } from './../../services/publicacion.service';
import { Publicacion } from './../../models/Publicacion';
import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-consultar-publicacion',
  templateUrl: './consultar-publicacion.component.html',
  styleUrls: ['./consultar-publicacion.component.css']
})
export class ConsultarPublicacionComponent implements OnInit {
  public identity: any;
  public publicacion: Publicacion;
  public idPub: any;
  public editarPost: boolean = false;
  public sharePost: boolean = false;
  public descripcion: string = '';
  public url: string = window.location.href.toString();

  constructor(
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.publicacion = new Publicacion(0, new Date(), '', new Date(), '', null, '', null, '', '', '');
  }

  ngOnInit(): void {
    this.idPub = this.route.snapshot.paramMap.get('id')!;
    this.obtenerPublicacion();
  }

  /**
   * Método encargado de obtener la publicación
   */
  public obtenerPublicacion(): void {
    this.publicacionService.consultarPublicacion(this.idPub).subscribe(
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
   * Método encargado de eliminar una publicacion
   */
  public eliminarPublicacion(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro?',
      accept: () => {
        this.publicacionService.eliminarPublicacion(id).subscribe(
          response => {
            this.router.navigate(['index']);
          },
          error => {
            this.addErrorMessage(error.error.message);
          }
        );
      }
    });
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
          this.obtenerPublicacion();
          this.editarPost = false;
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    }
  }

  /**
   * Método encargado de mostrar el diálogo para compartir una publicación
   */
   public compartirPublicacion(): void {
    this.sharePost = true;
  }

  /**
   * Método encargado de validar los campos a la hora de crear una nueva publicación
   * @returns TRUE/FALSE
   */
  public validarCampos(): boolean {
    let valido = true;

    if (this.publicacion.titulo == '') {
      valido = false;
      this.addErrorMessage("El campo 'Título' está vacío");
    }
    if (this.publicacion.descripcion == '' || this.publicacion.descripcion == null) {
      valido = false;
      this.addErrorMessage("El campo 'Descripción' está vacío");
    }

    return valido;
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
