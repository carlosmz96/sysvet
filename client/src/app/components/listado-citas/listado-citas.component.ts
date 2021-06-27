import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Cita } from 'src/app/models/Cita';
import { CitaService } from 'src/app/services/cita.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-listado-citas',
  templateUrl: './listado-citas.component.html',
  styleUrls: ['./listado-citas.component.css']
})
export class ListadoCitasComponent implements OnInit {
  public citas: Cita[] = [];
  public identity: any;

  constructor(
    private usuarioService: UsuarioService,
    private citaService: CitaService,
    private router: Router
  ) {
    this.identity = usuarioService.getIdentity();
  }

  ngOnInit(): void {
    if (this.identity.rol != "administrador") {
      this.router.navigate(['acceso-denegado']);
    }

    this.citaService.listarCitas().subscribe(
      response => {
        this.citas = response.citas as Cita[];

        this.citas.forEach(cita => {
          cita.fechaStr = this.formatearFecha(cita.fecha);
          console.log(cita.fecha);
        });
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

  /**
   * Método encargado de formatear la fecha
   * @param fecha Fecha de la cita
   * @returns Fecha formateada a cadena de texto
   */
  public formatearFecha(fecha: Date): string {
    const fecha2 = new Date(fecha);
    const dia = fecha2.getDate();
    const mes = fecha2.getMonth() + 1;
    const anyo = fecha2.getFullYear();
    const hora = fecha2.getUTCHours();
    const minutos = fecha2.getMinutes();

    return dia + '/' + mes + '/' + anyo + ' ' + hora + ':' + minutos;
  }

}
