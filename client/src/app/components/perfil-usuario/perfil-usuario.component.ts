import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../../models/Usuario';

import { GLOBAL } from '../../global';
import { Mascota } from '../../models/Mascota';
import { UsuarioService } from 'src/app/services/usuario.service';
import { MascotaService } from 'src/app/services/mascota.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  public usuario: Usuario;
  public mascotas: Mascota[] = [];
  public dniUsuario: string = "";
  public mensajeError: string = "";
  public url: string = "";
  public identity: any;

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private router: Router,
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute
  ) {
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '');
    this.url = GLOBAL.url;
    this.identity = this.usuarioService.getIdentity();
    // permite suscribirse al cambio de ruta para poder recargar el componente sin recargar la página
    this.subscribeRouteChange();
  }

  /**
   * Método que se ejecuta al visualizar el componente
   * 1) Obtiene el dni del usuario (si no hay ninguno, redirecciona a la página principal)
   * 2) Consulta el usuario
   * 3) Si la imagen del usuario es nula, se sustituye por la foto por defecto
   * 4) Obtiene las mascotas asociadas al usuario
   */
  ngOnInit(): void {
    this.dniUsuario = this.route.snapshot.paramMap.get('dni')!;
    if (this.dniUsuario == "") {
      this.router.navigate(['index']);
    } else {
      this.usuarioService.consultarUsuario(this.dniUsuario).subscribe(
        response => {
          this.usuario = response.user;
          if (this.usuario.foto == null) {
            this.usuario.foto = 'default-image.png';
          }
        },
        error => {
          this.mensajeError = "Error al obtener todos los datos del usuario";
        }
      );

      // carga de mascotas asociadas al usuario
      this.mascotaService.listarMascotas().subscribe(
        response => {
          const mascotasSinFiltrar = response.pets as Mascota[];
          if (this.usuario.rol == "administrador" || this.usuario.rol == "cliente") {
            this.mascotas = mascotasSinFiltrar.filter(mascota => mascota.propietario == this.dniUsuario);
          } else {
            this.mascotas = mascotasSinFiltrar.filter(mascota => mascota.veterinario == this.dniUsuario);
          }
          this.mascotas.forEach(mascota => {
            if (mascota.imagen == null) {
              mascota.imagen = 'default-image.png';
            }
          });
        },
        error => {
          this.mensajeError = "Error al obtener la lista de mascotas asociadas al usuario";
        }
      );
    }
  }

  /**
   * Método encargado de suscribirse al cambio de ruta
   */
  subscribeRouteChange() {
    this.activatedRoute.params.subscribe((params = {}) => {
      this.ngOnInit();
    });
  }

}
