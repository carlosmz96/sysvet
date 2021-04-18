import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GLOBAL } from '../global';
import { Usuario } from '../models/Usuario';
import { UsuarioService } from '../usuario.service';

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
  public mensajeExito: string = "";
  public mensajeExitoPass: string = "";
  public mensajeError: string = "";
  public mensajeErrorPass: string = "";
  public foto: any; // variable para almacenar el archivo a subir
  public nuevaFoto: boolean = false;
  public fotoCambiada: boolean = false;
  public identity: any;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.usuario = new Usuario('', '', '', '', '', '', '', '', 'default-image.png');
    this.token = this.usuarioService.getToken();
    this.url = GLOBAL.url;
  }

  /**
   * Método que se ejecuta al visualizar el componente
   * 1) Obtiene el dni del usuario (si no hay ninguno, redirecciona a la página principal)
   * 2) Consulta el usuario
   * 3) Si la imagen del usuario es nula, se sustituye por la foto por defecto
   * 4) Limpia el campo de contraseña
   */
  ngOnInit(): void {
    this.dniUsuario = this.route.snapshot.paramMap.get('dni')!;
    if(this.identity.dni != this.dniUsuario && this.identity.rol != "administrador"){
      this.router.navigate(['acceso-denegado']);
    }
    if (this.dniUsuario == "") {
      this.router.navigate(['index']);
    } else {
      this.usuarioService.consultarUsuario(this.dniUsuario).subscribe(
        response => {
          this.usuario = response.user;
          this.usuario.pass = "";
          if (this.usuario.foto == null) {
            this.usuario.foto = 'default-image.png';
          }
        },
        error => {
          this.mensajeError = "Error al obtener todos los datos del usuario";
        }
      );
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
        }
      ).catch(error => {
        console.error(error);
      });
    }

    // si se ha cambiado la contraseña, se comprueban los campos
    if (this.usuario.pass && this.newPass) {
      this.usuarioService.comprobarClaveUsuario(this.usuario.dni, this.usuario.pass).subscribe(
        response => {
          if (response.res == false) {
            this.mensajeError = "Error: contraseña incorrecta.";
          } else { // si la contraseña es correcta
            this.usuarioService.cambiarClaveUsuario(this.usuario).subscribe(
              response => {
                this.usuario = response.user;
                this.usuario.pass = "";
                this.newPass = "";

                this.mensajeErrorPass = "";
                this.mensajeExitoPass = "Contraseña modificada con éxito.";

                // se actualiza el resto de datos
                this.usuarioService.modificarUsuario(this.usuario).subscribe(
                  response => {
                    if (!response.user) {
                      this.mensajeError = response.message;
                    } else {
                      this.usuario = response.user;
                      this.usuario.pass = "";

                      this.mensajeError = "";
                      this.mensajeExito = "Se han actualizado los datos con éxito.";
                    }
                  },
                  error => {
                    this.mensajeError = error.error.message;
                    this.mensajeExito = "";
                  }
                );
              },
              error => {
                this.mensajeErrorPass = error.error.message;
                this.mensajeExitoPass = "";
              }
            );
          }
        },
        error => {
          this.mensajeErrorPass = error.error.message;
          this.mensajeExitoPass = "";
        }
      );
    } else if (this.usuario.pass && !this.newPass) {
      this.mensajeErrorPass = "Debes rellenar el campo con tu nueva contraseña.";
      this.mensajeExitoPass = "";
      this.mensajeExito = "";
    } else {
      // se actualiza el resto de datos
      this.usuarioService.modificarUsuario(this.usuario).subscribe(
        response => {
          if (!response.user) {
            this.mensajeError = response.message;
          } else {
            this.usuario = response.user;
            this.usuario.pass = "";

            this.mensajeErrorPass = "";
            this.mensajeError = "";
            this.mensajeExitoPass = "";
            this.mensajeExito = "Se han actualizado los datos con éxito.";
          }
        },
        error => {
          this.mensajeError = error.error.message;
          this.mensajeExito = "";
        }
      );
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
   */
  public eliminarFotoPerfil(): void {
    this.usuarioService.eliminarFotoUsuario(this.dniUsuario).subscribe(
      response => {
        this.usuario = response.user;
        this.usuario.pass = "";
        this.usuario.foto = "default-image.png";

        this.mensajeError = "";
        this.mensajeExito = "Se ha eliminado la foto de perfil correctamente.";
      },
      error => {
        this.mensajeError = error.error.message;
      }
    );
  }

  /**
   * Método encargado de redireccionar a perfil usuario
   */
  public goPerfil(): void {
    this.router.navigate(['usuario/', this.usuario.dni]);
  }

}
