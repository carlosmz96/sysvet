import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
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
  public microchipMascota: string = "";
  public url: string; // url raíz de la api
  public usuarios: Usuario[] = [];
  public propietarios: Usuario[] = [];
  public veterinarios: Usuario[] = [];
  public propietario: any;
  public veterinario: any;
  public foto: any; // variable para almacenar el archivo a subir
  public nuevaFoto: boolean = false;
  public fotoCambiada: boolean = false;
  public sinErrores: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private messageService: MessageService
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.token = this.usuarioService.getToken();
    // mascota
    this.mascota = new Mascota('', '', '', '', '', '', '', 0, 0, '', 'default-image.png', '', '');
    // mascota documental
    this.mascotaDocumental = new MascotaDocumental('', '');
    // obtiene todos los usuarios del sistema
    this.obtenerUsuarios();
    // url global
    this.url = GLOBAL.url;
  }

  /**
   * Método que se ejecuta al visualizar el componente
   * 1) Obtiene el microchip de la mascota (si no hay ninguno, redirecciona a la página principal)
   * 2) Consulta la mascota
   * 3) Si tiene propietario y veterinario, los consulta
   */
  ngOnInit(): void {
    this.microchipMascota = this.route.snapshot.paramMap.get("microchip")!;
    if (this.microchipMascota == "") {
      this.router.navigate(['index']);
    } else {
      // consulta datos mascota
      this.mascotaService.consultarMascota(this.microchipMascota).subscribe(
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
      this.mascotaService.obtenerObservacionesMascota(this.microchipMascota).subscribe(
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
    // si se ha elegido una foto, se guarda
    if (this.nuevaFoto) {
      this.subirFotoPerfil(this.url + 'subir-foto-mascota/' + this.mascota.microchip, [], this.foto).then(
        (result: any) => {
          this.mascota.imagen = result.image;
          this.fotoCambiada = true;
        }
      ).catch(error => {
        console.error(error);
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

    // se actualiza el resto de datos
    this.mascotaService.modificarMascota(this.mascota).subscribe(
      response => {
        if (!response.pet) {
          this.addErrorMessage(response.message);
          this.sinErrores = false;
        } else {
          this.mascota = response.pet;
          this.sinErrores = true;
        }
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );

    this.mascotaDocumental.microchip = this.mascota.microchip;

    // se actualizan los datos documentales de la mascota
    this.mascotaService.modificarObservacionesMascota(this.mascotaDocumental).subscribe(
      response => {
        if (response.pet) {
          this.mascotaDocumental = response.pet;
          this.sinErrores = true;
        } else {
          this.sinErrores = false;
        }

        if (this.sinErrores) {
          this.addSuccessMessage('Se han actualizado los datos con éxito.');
        }
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
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
    this.mascotaService.eliminarFotoMascota(this.microchipMascota).subscribe(
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

  /**
   * Método encargado de obtener todos los usuarios del sistema
   */
  private obtenerUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe(
      users => {
        this.usuarios = users.users as Usuario[];
        this.propietarios = this.usuarios.filter(usuario => usuario.rol == 'cliente' || usuario.rol == 'administrador');
        this.veterinarios = this.usuarios.filter(usuario => usuario.rol == 'veterinario');
      }
    );
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
    this.messageService.add({severity: 'error', summary: 'Error', detail: msg});
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de éxito
   * @param msg Mensaje pasado por parámetro
   */
   public addSuccessMessage(msg: string): void {
    this.messageService.add({severity: 'success', summary: 'Éxito', detail: msg});
  }

}
