import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Mascota } from 'src/app/models/Mascota';
import { Usuario } from 'src/app/models/Usuario';
import { MascotaService } from 'src/app/services/mascota.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-baja-usuario',
  templateUrl: './baja-usuario.component.html',
  styleUrls: ['./baja-usuario.component.css']
})
export class BajaUsuarioComponent implements OnInit {
  public dniUsuario: string = "";
  public identity: any;
  public usuario: any;
  public mascotas: Mascota[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.identity = this.usuarioService.getIdentity();
  }

  /**
   * Método que se ejecuta al visualizar el componente
   * Obtiene el dni del usuario (si no hay ninguno, redirecciona a la página principal)
   */
  ngOnInit(): void {
    this.dniUsuario = this.route.snapshot.paramMap.get('dni')!;
    if (this.dniUsuario == "") {
      this.router.navigate(['index']);
    }
    if (this.identity.dni != this.dniUsuario && this.identity.rol != "administrador") {
      this.router.navigate(['acceso-denegado']);
    }

    // obtención del usuario mediante el dni
    this.usuarioService.consultarUsuario(this.dniUsuario).subscribe(
      response => {
        this.usuario = response.user;
      },
      error => {
        this.addErrorMessage('Error al obtener el usuario mediante el dni.');
      }
    )

    // carga de mascotas asociadas al usuario
    this.mascotaService.listarMascotas().subscribe(
      response => {
        const mascotasSinFiltrar = response.pets as Mascota[];
        if (this.usuario.rol == "administrador" || this.usuario.rol == "cliente") {
          this.mascotas = mascotasSinFiltrar.filter(mascota => mascota.propietario == this.dniUsuario);
        } else {
          this.mascotas = mascotasSinFiltrar.filter(mascota => mascota.veterinario == this.dniUsuario);
        }
      },
      error => {
        this.addErrorMessage('Error al obtener la lista de mascotas asociadas al usuario.');
      }
    );
  }

  /**
   * Método encargado de dar de baja la cuenta del usuario
   * Si el rol del usuario identificado es administrador, tras la eliminación lo devuelve al index
   * Si no, entonces eso quiere decir que el usuario se ha dado de baja por si mismo, por lo
   * tanto, sale de la sesión y lo redirige al login
   */
  public darDeBaja(): void {
    // si no tiene mascotas, se elimina
    if (this.mascotas.length == 0) {
      this.usuarioService.bajaUsuario(this.dniUsuario).subscribe(
        response => {
          if (this.identity.rol == "administrador") {
            this.router.navigate(['index']);
          } else {
            this.router.navigate(['login']);
          }
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    } else {
      this.addErrorMessage('Error al querer eliminar el usuario, aun tiene mascotas asociadas.');
    }
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
   public addErrorMessage(msg: string): void {
    this.messageService.add({severity: 'error', summary: 'Error', detail: msg});
  }

}
