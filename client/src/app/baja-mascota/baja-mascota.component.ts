import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from '../mascota.service';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-baja-mascota',
  templateUrl: './baja-mascota.component.html',
  styleUrls: ['./baja-mascota.component.css']
})
export class BajaMascotaComponent implements OnInit {
  public microchip: string = "";
  public mensajeError: string = "";
  public identity: any;

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.identity = this.usuarioService.getIdentity();
  }

  /**
   * Método que se ejecuta al visualizar el componente
   * Obtiene el microchip de la mascota (si no hay ninguno, redirecciona a la página principal)
   */
  ngOnInit(): void {
    this.microchip = this.route.snapshot.paramMap.get('microchip')!;
    if (this.microchip == "") {
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
    this.mascotaService.bajaMascota(this.microchip).subscribe(
      response => {
        this.router.navigate(['listado-mascotas']);
      },
      error => {
        this.mensajeError = error.error.message;
      }
    )
  }

}
