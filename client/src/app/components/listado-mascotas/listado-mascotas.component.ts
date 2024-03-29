import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MascotaService } from 'src/app/services/mascota.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Mascota } from '../../models/Mascota';

@Component({
  selector: 'app-listado-mascotas',
  templateUrl: './listado-mascotas.component.html',
  styleUrls: ['./listado-mascotas.component.css']
})
export class ListadoMascotasComponent implements OnInit {
  public mascotas: Mascota[] = [];
  public identity: any;

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private router: Router
  ) {
    this.identity = this.usuarioService.getIdentity();
  }

  ngOnInit(): void {
    if (this.identity.rol != "administrador" && this.identity.rol != "veterinario") {
      this.router.navigate(['acceso-denegado']);
    }
    this.mascotaService.listarMascotas().subscribe(
      pets => {
        this.mascotas = pets.pets as Mascota[];
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
   * Método encargado de obtener el valor del target como un HTMLInputElement,
   * ya que en TypeScript lo marca como error a la primera de cambio
   * @param target objetivo
   * @returns el valor de dicho objetivo
   */
  getValueInput(target: any): string {
    return (target as HTMLInputElement).value;
  }

}
