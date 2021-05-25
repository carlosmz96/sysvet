import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

import { Usuario } from '../../models/Usuario';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css']
})
export class ListadoUsuariosComponent implements OnInit {
  public usuarios: Usuario[] = [];
  public identity: any;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {
    this.identity = this.usuarioService.getIdentity();
  }

  ngOnInit(): void {
    if(this.identity.rol != "administrador"){
      this.router.navigate(['acceso-denegado']);
    }
    this.usuarioService.listarUsuarios().subscribe(
      users => {
        this.usuarios = users.users as Usuario[];
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
