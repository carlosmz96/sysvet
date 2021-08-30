import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MascotaService } from 'src/app/services/mascota.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Mascota } from '../../models/Mascota';
import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-alta-mascota',
  templateUrl: './alta-mascota.component.html',
  styleUrls: ['./alta-mascota.component.css']
})
export class AltaMascotaComponent implements OnInit {
  public identity: any;
  public mascota: Mascota;
  public usuarios: Usuario[] = [];
  public propietario: any;
  public propietarios: Usuario[] = [];
  public veterinario: any;
  public veterinarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private router: Router,
    private messageService: MessageService
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.mascota = new Mascota('', '', '', '', '', '', '', 0, 0, '', '', '', '', null, '');
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
   * 2) Setteo el dni de creador
   * 3) Creación entidad mascota
   */
  public onSubmit(): void {
    if (this.validarCampos()) {
      if (this.propietario != null) {
        this.mascota.propietario = this.propietario.dni;
      }
      if (this.veterinario != null) {
        this.mascota.veterinario = this.veterinario.dni;
      }
      if (this.identity != null) {
        this.mascota.dni_creacion = this.identity.dni;
      }

      this.mascotaService.altaMascota(this.mascota).subscribe(
        response => {
          this.router.navigate(['datos-mascota', response.pet.identificador]);
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      )
    }
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
   * Método encargado de comprobar que la tecla pulsada es un número
   * @param event Evento de pulsación
   * @returns TRUE/FALSE
   */
  public soloNumeros(event: any): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  /**
   * Método encargado de redireccionar al listado de mascotas
   */
  public goBack(): void {
    this.router.navigate(['listado-mascotas']);
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
  public addErrorMessage(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

}
