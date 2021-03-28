import { Component, OnInit } from '@angular/core';

import { Usuario } from '../models/Usuario';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css']
})
export class ListadoUsuariosComponent implements OnInit {
  public usuarios: Usuario[] = [];

  constructor(
    private usuarioService: UsuarioService
  ) {

  }

  ngOnInit(): void {
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
