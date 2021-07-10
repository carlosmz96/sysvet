import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MascotaService } from 'src/app/services/mascota.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-baja-mascota',
  templateUrl: './baja-mascota.component.html',
  styleUrls: ['./baja-mascota.component.css']
})
export class BajaMascotaComponent implements OnInit {
  public identificador: string = "";
  public identity: any;

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
   * Obtiene el identificador de la mascota (si no hay ninguno, redirecciona a la página principal)
   */
  ngOnInit(): void {
    this.identificador = this.route.snapshot.paramMap.get('idMascota')!;
    if (this.identificador == "") {
      this.router.navigate(['index']);
    }
    if (this.identity.rol != "veterinario" && this.identity.rol != "administrador") {
      this.router.navigate(['acceso-denegado']);
    }
  }

  /**
   * Método encargado de dar de baja una mascota
   * Tras eliminar a la mascota, redirecciona al listado de mascotas
   */
  public darDeBaja(): void {
    this.mascotaService.bajaMascota(this.identificador).subscribe(
      response => {
        this.router.navigate(['listado-mascotas']);
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    )
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
   public addErrorMessage(msg: string): void {
    this.messageService.add({severity: 'error', summary: 'Error', detail: msg});
  }

}
