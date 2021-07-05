import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { Mascota } from 'src/app/models/Mascota';
import { Usuario } from 'src/app/models/Usuario';
import { DataService } from 'src/app/services/data.service';
import { MascotaService } from 'src/app/services/mascota.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-cita-solicitada',
  templateUrl: './cita-solicitada.component.html',
  styleUrls: ['./cita-solicitada.component.css']
})
export class CitaSolicitadaComponent implements OnInit, OnDestroy {
  public usuario: Usuario;
  public mascota: Mascota;
  public datos: any;

  public message: string = '';
  public subscription: Subscription = new Subscription();

  constructor(
    private dataService: DataService,
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.usuario = new Usuario('', '', '', '', '', '', '', '', '');
    this.mascota = new Mascota('', '', '', '', '', '', '', 0, 0, '', '', '', '', '', '');
  }

  ngOnInit(): void {
    this.subscription = this.dataService.currentMessage.subscribe(msg => this.message = msg);

    if (this.message != 'default message') {
      this.datos = JSON.parse(this.message);

      this.usuarioService.consultarUsuario(this.datos.dni).subscribe(
        response => {
          this.usuario = response.user;
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );

      this.mascotaService.consultarMascota(this.datos.microchip).subscribe(
        response => {
          this.mascota = response.pet;
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );

      const fecha = new Date(this.datos.fecha);
      const dia = fecha.getDate().toString().length < 2 ? '0' + fecha.getDate() : fecha.getDate();
      const mes = (fecha.getMonth() + 1).toString().length < 2 ? '0' + (fecha.getMonth() + 1) : (fecha.getMonth() + 1);
      const anyo = fecha.getFullYear();
      const hora = fecha.getHours().toString().length < 2 ? '0' + fecha.getHours() : fecha.getHours();
      const minutos = fecha.getMinutes().toString().length < 2 ? '0' + fecha.getMinutes() : fecha.getMinutes();

      this.datos.fecha = dia + '/' + mes + '/' + anyo + ' a las ' + hora + ':' + minutos;
    } else {
      this.router.navigate(['index']);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
  public addErrorMessage(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

}
