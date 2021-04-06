import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Usuario } from '../models/Usuario';
import { UsuarioService } from '../usuario.service';

import { GLOBAL } from '../global';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  public usuario: Usuario;
  public dniUsuario: string = "";
  public mensajeError: string = "";
  public url: string = "";

  constructor(
    private usuarioService: UsuarioService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usuario = new Usuario('','','','','','','','','');
    this.url = GLOBAL.url;
  }

  /**
   * Método que se ejecuta al visualizar el componente
   * 1) Obtiene el dni del usuario (si no hay ninguno, redirecciona a la página principal)
   * 2) Consulta el usuario
   * 3) Si la imagen del usuario es nula, se sustituye por la foto por defecto
   */
  ngOnInit(): void {
    this.dniUsuario = this.route.snapshot.paramMap.get('dni')!;
    if(this.dniUsuario == ""){
      this.router.navigate(['index']);
    }else{
      this.usuarioService.consultarUsuario(this.dniUsuario).subscribe(
        response => {
          this.usuario = response.user;
          if(this.usuario.foto == null) {
            this.usuario.foto = 'default-image.png';
          }
        },
        error => {
          this.mensajeError = "Error al obtener todos los datos del usuario";
        }
      )
    }
  }

}
