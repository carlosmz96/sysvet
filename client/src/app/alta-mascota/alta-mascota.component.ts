import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MascotaService } from '../mascota.service';
import { Mascota } from '../models/Mascota';
import { Usuario } from '../models/Usuario';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-alta-mascota',
  templateUrl: './alta-mascota.component.html',
  styleUrls: ['./alta-mascota.component.css']
})
export class AltaMascotaComponent implements OnInit {
  public identity: any;
  public token: any;
  public mascota: Mascota;
  public mensajeError: string = "";
  public mensajeExito: string = "";
  public usuarios: Usuario[] = [];
  public propietario: any;
  public propietarios: Usuario[] = [];
  public veterinario: any;
  public veterinarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private router: Router
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.mascota = new Mascota('','','','','','','', 0, 0, '', '', '', '');
    // obtiene todos los usuarios del sistema
    this.obtenerUsuarios();
  }

  /**
   * Método al cargar el componente
   * 1) Si el usuario no es administrador o veterinario, será redirigido a acceso denegado
   */
  ngOnInit(): void {
    if (this.identity.rol != "administrador" && this.identity.rol != "veterinario") {
      this.router.navigate(['acceso-denegado']);
    }
  }

  /**
   * Método encargado de dar de alta una mascota en el sistema
   * 1) Setteo de propietario y veterinario si procede
   * 2) Creación entidad mascota
   */
  public onSubmit(): void {
    if (this.propietario != null) {
      this.mascota.propietario = this.propietario.dni;
    }
    if (this.veterinario != null) {
      this.mascota.veterinario = this.veterinario.dni;
    }

    this.mascotaService.altaMascota(this.mascota).subscribe(
      response => {
        this.router.navigate(['datos-mascota', response.pet.microchip]);
      },
      error => {
        this.mensajeError = error.error.message;
      }
    )
  }

  /**
   * Método encargado de obtener todos los usuarios del sistema
   */
  public obtenerUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe(
      users => {
        this.usuarios = users.users as Usuario[];
        this.propietarios = this.usuarios.filter(usuario => usuario.rol == 'cliente' || usuario.rol == 'administrador');
        this.veterinarios = this.usuarios.filter(usuario => usuario.rol == 'veterinario');
      }
    );
  }

  /**
   * Método encargado de redireccionar al listado de mascotas
   */
  public goBack(): void {
    this.router.navigate(['listado-mascotas']);
  }

}
