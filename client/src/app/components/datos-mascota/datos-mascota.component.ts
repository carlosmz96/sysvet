import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MascotaDocumental } from 'src/app/models/MascotaDocumental';
import { MascotaService } from 'src/app/services/mascota.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { GLOBAL } from '../../global';
import { Mascota } from '../../models/Mascota';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-datos-mascota',
  templateUrl: './datos-mascota.component.html',
  styleUrls: ['./datos-mascota.component.css']
})
export class DatosMascotaComponent implements OnInit {
  public mascota: Mascota;
  public mascotaDocumental: any;
  public token: any; // token del usuario
  public identity: any; // identidad logueada
  public idMascota: string = "";
  public url: string; // url raíz de la api
  public usuarios: Usuario[] = [];
  public propietarios: Usuario[] = [];
  public veterinarios: Usuario[] = [];
  public propietario: any;
  public veterinario: any;
  public foto: any; // variable para almacenar el archivo a subir
  public nuevaFoto: boolean = false;
  public fotoCambiada: boolean = false;
  public sinErrores: boolean | null = null;
  public mensajeMostrado: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private messageService: MessageService
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.token = this.usuarioService.getToken();
    // mascota
    this.mascota = new Mascota('', '', '', '', '', '', '', 0, 0, '', 'default-image.png', '', '', '', null);
    // mascota documental
    this.mascotaDocumental = new MascotaDocumental('', '');
    // obtiene todos los usuarios del sistema
    this.obtenerUsuarios();
    // url global
    this.url = GLOBAL.url;
  }

  /**
   * Método que se ejecuta al visualizar el componente
   * 1) Obtiene el identificador de la mascota (si no hay ninguno, redirecciona a la página principal)
   * 2) Consulta la mascota
   * 3) Si tiene propietario y veterinario, los consulta
   */
  ngOnInit(): void {
    this.idMascota = this.route.snapshot.paramMap.get("idMascota")!;
    if (this.idMascota == "") {
      this.router.navigate(['index']);
    } else {
      // consulta datos mascota
      this.mascotaService.consultarMascota(this.idMascota).subscribe(
        response => {
          this.mascota = response.pet;
          // si tiene asignado un propietario, lo obtiene
          if (this.mascota.propietario != null) {
            this.usuarioService.consultarUsuario(this.mascota.propietario).subscribe(
              response => {
                this.propietario = response.user;
              },
              error => {
                this.addErrorMessage(error.error.message);
              }
            );
          }
          // si tiene asignado un veterinario, lo obtiene
          if (this.mascota.veterinario != null) {
            this.usuarioService.consultarUsuario(this.mascota.veterinario).subscribe(
              response => {
                this.veterinario = response.user;
              },
              error => {
                this.addErrorMessage(error.error.message);
              }
            );
          }
        },
        error => {
          this.addErrorMessage('Error al obtener los datos de la mascota');
        }
      );

      // consulta observaciones mascota
      this.mascotaService.obtenerObservacionesMascota(this.idMascota).subscribe(
        response => {
          if (response.pet != null) {
            this.mascotaDocumental = response.pet;
          }
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    }
  }

  /**
   * Método encargado de guardar los datos editados de la mascota
   */
  public onSubmit(): void {
    if (this.validarCampos()) {
      // si se ha elegido una foto, se guarda
      if (this.nuevaFoto) {
        this.subirFotoPerfil(this.url + 'subir-foto-mascota/' + this.mascota.identificador, [], this.foto).then(
          (result: any) => {
            this.mascota.imagen = result.image;
            this.fotoCambiada = true;
            this.sinErrores = true;
            this.addSuccessMessage('Imagen de la mascota subida correctamente.');
            this.nuevaFoto = false;
          }
        ).catch(error => {
          this.sinErrores = false;
          this.addErrorMessage('Fichero demasiado pesado. El tamaño máximo es 1Mb.');
        });
      }

      // actualizamos propietario y veterinario asignado a mascota
      if (this.propietario != null) {
        this.mascota.propietario = this.propietario.dni;
      } else {
        this.mascota.propietario = null;
      }
      if (this.veterinario != null) {
        this.mascota.veterinario = this.veterinario.dni;
      } else {
        this.mascota.veterinario = null;
      }

      // se actualiza el dni del usuario que modifica la mascota
      if (this.identity != null) {
        this.mascota.dni_modificacion = this.identity.dni;
      }

      // se actualiza el resto de datos
      this.mascotaService.modificarMascota(this.mascota).subscribe(
        response => {
          if (!response.pet) {
            this.addErrorMessage(response.message);
            this.sinErrores = false;
          } else {
            this.mascota = response.pet;
            // si la foto ha sido cambiada y no hay errores
            if (this.fotoCambiada && this.sinErrores) {
              this.fotoCambiada = false;
            } else {
              this.sinErrores = true;
            }

            if (this.sinErrores) {
              this.addSuccessMessage('Se han actualizado los datos con éxito.');
              this.sinErrores = false;
            }
          }
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );

      this.mascotaDocumental.identificador = this.mascota.identificador;

      // se actualizan los datos documentales de la mascota
      this.mascotaService.modificarObservacionesMascota(this.mascotaDocumental).subscribe(
        response => {
          if (response.pet) {
            this.mascotaDocumental = response.pet;
          } else {
            this.sinErrores = false;
          }
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    }
  }

  /**
   * Método encargado de enviar el fichero a una url determinada
   * @param url dirección url de la api
   * @param params parámetros
   * @param file fichero de imagen
   * @returns promesa que realiza una petición ajax para subir la foto de perfil de la mascota
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
   * Método encargado de eliminar la foto de perfil de la mascota
   */
  public eliminarFotoMascota(): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de querer eliminar la foto de perfil?',
      accept: () => {
        this.mascotaService.eliminarFotoMascota(this.idMascota).subscribe(
          response => {
            this.mascota = response.pet;
            this.mascota.imagen = "default-image.png";
            this.addSuccessMessage('Se ha eliminado la foto de perfil de la mascota correctamente.');
          },
          error => {
            this.addErrorMessage(error.error.message);
          }
        );
      }
    });
  }

  /**
   * Método encargado de dar de baja a la mascota
   */
  public bajaMascota(id: string): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro?',
      accept: () => {
        this.mascotaService.bajaMascota(id).subscribe(
          response => {
            this.router.navigate(['listado-mascotas']);
          },
          error => {
            this.addErrorMessage(error.error.message);
          }
        );
      }
    });
  }

  /**
   * Método encargado de obtener todos los usuarios del sistema
   */
  private obtenerUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe(
      users => {
        this.usuarios = users.users as Usuario[];
        this.propietarios = this.usuarios.filter(usuario => usuario.rol == 'cliente' || usuario.rol == 'administrador');
        this.veterinarios = this.usuarios.filter(usuario => usuario.rol == 'veterinario');
      },
      error => {
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['login']).then(() => {
            window.location.reload();
          });
        }
      }
    );
  }

  /**
   * Método encargado de comprobar la validez del formulario
   * @returns TRUE/FALSE
   */
  public validarCampos(): boolean {
    let esValido = true;

    if (this.mascota.nombre == '') {
      esValido = false;
      this.addErrorMessage("El campo 'Nombre' está vacío");
    }
    if (this.mascota.identificador == '') {
      esValido = false;
      this.addErrorMessage("El campo 'Identificador' está vacío");
    } else if (this.mascota.identificador.length < 10) {
      esValido = false;
      this.addErrorMessage("El identificador de la mascota debe estar formado por 10 números")
    }
    if (this.mascota.especie == '') {
      esValido = false;
      this.addErrorMessage("El campo 'Especie' está vacío");
    }
    if (this.mascota.raza == '') {
      esValido = false;
      this.addErrorMessage("El campo 'Raza' está vacío");
    }
    if (this.mascota.sexo == '') {
      esValido = false;
      this.addErrorMessage("El campo 'Sexo' está vacío");
    }
    if (this.mascota.color == '') {
      esValido = false;
      this.addErrorMessage("El campo 'Color' está vacío");
    }
    if (this.mascota.edad == '') {
      esValido = false;
      this.addErrorMessage("El campo 'Edad' está vacío");
    }
    if (this.mascota.altura == 0) {
      esValido = false;
      this.addErrorMessage("El campo 'Altura' no puede ser 0");
    } else if (this.mascota.altura == null) {
      esValido = false;
      this.addErrorMessage("El campo 'Altura' no puede estar vacío");
    }
    if (this.mascota.peso == 0) {
      esValido = false;
      this.addErrorMessage("El campo 'Peso' no puede ser 0");
    } else if (this.mascota.peso == null) {
      esValido = false;
      this.addErrorMessage("El campo 'Peso' no puede estar vacío");
    }
    if (this.mascota.esterilizado == '') {
      esValido = false;
      this.addErrorMessage("El campo 'Esterilizado' está vacío");
    }
    if (this.propietario == null) {
      esValido = false;
      this.addErrorMessage("El campo 'Propietario' está vacío");
    }
    if (this.veterinario == null) {
      esValido = false;
      this.addErrorMessage("El campo 'Veterinario' está vacío");
    }

    return esValido;
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

  /**
   * Método encargado de mostrar una notificación con un mensaje de éxito
   * @param msg Mensaje pasado por parámetro
   */
  public addSuccessMessage(msg: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: msg });
  }

}
