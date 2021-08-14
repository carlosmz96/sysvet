import { VeterinarioServicioService } from './../../services/veterinario-servicio.service';
import { VeterinarioServicio } from './../../models/VeterinarioServicio';
import { ServicioService } from './../../services/servicio.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Servicio } from 'src/app/models/Servicio';
import { UsuarioService } from 'src/app/services/usuario.service';
import { GLOBAL } from '../../global';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent implements OnInit {
  public usuario: Usuario;
  public dniUsuario: string = "";
  public token: any; // token del usuario
  public newPass: string = ""; // nueva contraseña
  public url: string; // url raíz de la api
  public foto: any; // variable para almacenar el archivo a subir
  public nuevaFoto: boolean = false;
  public fotoCambiada: boolean = false;
  public identity: any;
  public sinErrores: boolean = false;
  public servicios: Servicio[] = []; // todos los servicios
  public asociados: Servicio[] = []; // asociados al veterinario
  public asociadosAux: Servicio[] = []; // array auxiliar de asociados
  public serviciosAsociados: VeterinarioServicio[] = []; // lista de relaciones entre veterinarios y servicios

  constructor(
    private usuarioService: UsuarioService,
    private servicioService: ServicioService,
    private vetServService: VeterinarioServicioService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.usuario = new Usuario('', '', '', '', '', '', '', '', 'default-image.png', '', '', '');
    this.token = this.usuarioService.getToken();
    this.url = GLOBAL.url;
  }

  /**
   * Método que se ejecuta al visualizar el componente
   */
  ngOnInit(): void {
    // obtiene el dni del usuario a modificar
    this.dniUsuario = this.route.snapshot.paramMap.get('dni')!;
    // si no tiene permisos, se redirige al acceso denegado
    if (this.identity.dni != this.dniUsuario && this.identity.rol != "administrador") {
      this.router.navigate(['acceso-denegado']);
    }
    // si el dni el usuario no está, se redirige al index
    if (this.dniUsuario == "") {
      this.router.navigate(['index']);
    } else {
      // obtencion de los datos del usuario a modificar
      this.consultarUsuario();
      // obtención de todos los servicios del sistema
      this.listarServicios();
      // obtención de todos los servicios asociados al veterinario
      this.obtenerServiciosAsociados();
    }
  }

  /**
   * Método encargado de guardar los datos editados del usuario
   */
  public onSubmit(): void {
    // si se ha elegido una foto, se guarda
    if (this.nuevaFoto) {
      this.subirFotoPerfil(this.url + 'subir-foto-perfil/' + this.usuario.dni, [], this.foto).then(
        (result: any) => {
          this.usuario.foto = result.image;
          this.fotoCambiada = true;
          this.sinErrores = true;
          this.addSuccessMessage('Foto de perfil subida correctamente.');
        }
      ).catch(error => {
        this.addErrorMessage('Fichero demasiado pesado. El tamaño máximo es 1Mb.');
        this.sinErrores = false;
      });
    }

    // si se ha cambiado la contraseña, se comprueban los campos
    if (this.usuario.pass && this.newPass) {
      this.usuarioService.comprobarClaveUsuario(this.usuario.dni, this.usuario.pass).subscribe(
        response => {
          if (response.res == false) {
            this.addErrorMessage('Contraseña incorrecta.');
          } else { // si la contraseña es correcta
            this.usuario.pass = this.newPass;
            this.usuarioService.cambiarClaveUsuario(this.usuario).subscribe(
              response => {
                this.usuario = response.user;
                this.usuario.pass = "";
                this.newPass = "";

                this.addSuccessMessage('Contraseña modificada con éxito.');

                // se actualiza el resto de datos
                this.usuarioService.modificarUsuario(this.usuario).subscribe(
                  response => {
                    if (!response.user) {
                      this.addErrorMessage(response.message);
                    } else {
                      this.usuario = response.user;
                      this.usuario.pass = "";

                      if (this.sinErrores) {
                        this.addSuccessMessage('Se han actualizado los datos con éxito.');
                      }
                    }
                  },
                  error => {
                    this.addErrorMessage(error.error.message);
                  }
                );

                // actualización de los servicios asociados al veterinario
                this.modificarEspecialidades();
              },
              error => {
                this.addErrorMessage(error.error.message);
              }
            );
          }
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    } else if (this.usuario.pass && !this.newPass) {
      this.addErrorMessage('Debes rellenar el campo con tu nueva contraseña.');
    } else {
      // se actualiza el resto de datos
      this.usuarioService.modificarUsuario(this.usuario).subscribe(
        response => {
          if (!response.user) {
            this.addErrorMessage(response.message);
          } else {
            this.usuario = response.user;
            this.usuario.pass = "";
            this.sinErrores = true;

            if (this.sinErrores) {
              this.addSuccessMessage('Se han actualizado los datos con éxito.');
            }
          }
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );

      // actualización de los servicios asociados al veterinario
      this.modificarEspecialidades();
    }
  }

  /**
   * Método encargado de enviar el fichero a una url determinada
   * @param url dirección url de la api
   * @param params parámetros
   * @param file fichero de imagen
   * @returns promesa que realiza una petición ajax para subir la foto de perfil del usuario
   */
  public subirFotoPerfil(url: string, params: Array<string>, file: File): Promise<any> {
    const token = this.token;

    return new Promise(function (resolve, reject) {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append('imagen', file, file.name); //se agrega el archivo al formulario

      xhr.onreadystatechange = function () {
        // si la operación ha sido completada
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }

      xhr.open('POST', url, true); //realiza una peticion a la url de tipo post de forma asíncrona
      xhr.setRequestHeader('Authorization', token); //cabecera de autorización con el token
      xhr.send(formData); //se envía el formulario
    });
  }

  /**
   * Método encargado de asignar el valor del fichero a subir
   * @param fileInput Fichero (foto de perfil)
   */
  public fileChoosen(event: any): void {
    if (event.target.value) {
      this.foto = <File>event.target.files[0];
      this.nuevaFoto = true;
      this.fotoCambiada = false;
    }
  }

  /**
   * Método encargado de eliminar la foto de perfil del usuario
   * 1) Al querer eliminar la foto de perfil mostrará un dialogo pidiendo confirmación
   * 2) Si se acepta, procederá al borrado de dicha imagen
   */
  public eliminarFotoPerfil(): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de querer eliminar la foto de perfil?',
      accept: () => {
        this.usuarioService.eliminarFotoUsuario(this.dniUsuario).subscribe(
          response => {
            this.usuario = response.user;
            this.usuario.pass = "";
            this.usuario.foto = "default-image.png";
            this.addSuccessMessage('Se ha eliminado la foto de perfil correctamente.');
          },
          error => {
            this.addErrorMessage(error.error.message);
          }
        );
      }
    });
  }

  /**
   * Método encargado de consultar los datos del usuario
   */
  public consultarUsuario(): void {
    this.usuarioService.consultarUsuario(this.dniUsuario).subscribe(
      response => {
        this.usuario = response.user;
        this.usuario.pass = "";
        if (this.usuario.foto == null) {
          this.usuario.foto = 'default-image.png';
        }
      },
      error => {
        this.addErrorMessage('Error al obtener todos los datos del usuario.');
      }
    );
  }

  /**
   * Método encargado de listar todos los servicios del sistema
   */
  public listarServicios(): void {
    this.servicioService.listarServicios().subscribe(
      response => {
        this.servicios = response.servicios as Servicio[];
        // ordena los servicios por orden alfabético
        this.servicios.sort((a: Servicio, b: Servicio) => a.nombre.localeCompare(b.nombre));
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de obtener los servicios asociados al veterinario
   */
  public obtenerServiciosAsociados(): void {
    this.vetServService.listarEspecializacionesVeterinario(this.dniUsuario).subscribe(
      response => {
        this.serviciosAsociados = response.servicios as VeterinarioServicio[];

        // reparte los servicios entre las dos listas
        this.repartirServicios();
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de repartir los servicios entre 'todos' y 'asociados'
   */
  public repartirServicios(): void {
    // añade todos los servicios que tenga asociados a la lista de asociados
    this.servicios.forEach(servicio => {
      if (this.incluyeServicio(servicio.id_servicio!)) {
        this.asociados.push(servicio);
        this.asociadosAux.push(servicio);
      }
    });

    // elimina todos los servicios que esten asociados de la lista de servicios original
    this.servicios = this.servicios.filter(servicio => {
      return this.asociados.indexOf(servicio) < 0;
    });
  }

  /**
   * Método encargado de comprobar que el array contiene al servicio
   * @param id id del servicio
   * @returns TRUE/FALSE
   */
  public incluyeServicio(id: number): boolean {
    const res = this.serviciosAsociados.filter(servicio => servicio.id_servicio == id);
    if (res.length == 1) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Método encargado de modificar las especialidades del veterinario
   */
  public modificarEspecialidades(): void {
    if (this.usuario.rol == 'veterinario') {
      // nuevos servicios a asociar
      const nuevos = this.asociados.filter(servicio => {
        return !this.asociadosAux.includes(servicio);
      });

      // nuevos servicios a asociar
      const paraEliminar = this.asociadosAux.filter(servicio => {
        return !this.asociados.includes(servicio);
      });

      // si hay para agregar, se crean las relaciones
      if (nuevos.length > 0) {
        nuevos.forEach(nuevo => {
          this.vetServService.crearRelacion(this.dniUsuario, nuevo.id_servicio!).subscribe(
            response => {
              // no hay que poner nada
            },
            error => {
              this.addErrorMessage(error.error.message);
            }
          );

          this.asociadosAux.push(nuevo);
        });
      }

      // si hay para eliminar, se eliminan las relaciones
      if (paraEliminar.length > 0) {
        paraEliminar.forEach(del => {
          this.vetServService.eliminarRelacion(this.dniUsuario, del.id_servicio!).subscribe(
            response => {
              // no hay que poner nada
            },
            error => {
              this.addErrorMessage(error.error.message);
            }
          );

          const index = this.asociadosAux.indexOf(del);
          if (index > -1) {
            this.asociadosAux.splice(index, 1);
          }
        });
      }
    }
  }

  /**
   * Método encargado de redireccionar a perfil usuario
   */
  public goPerfil(): void {
    this.router.navigate(['usuario/', this.usuario.dni]);
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
