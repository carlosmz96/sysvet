import { EntradaService } from './../../services/entrada.service';
import { Entrada } from './../../models/Entrada';
import { Mascota } from './../../models/Mascota';
import { MessageService } from 'primeng/api';
import { ActivatedRoute, Router } from '@angular/router';
import { MascotaService } from './../../services/mascota.service';
import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Historial } from 'src/app/models/Historial';

@Component({
  selector: 'app-crear-entrada',
  templateUrl: './crear-entrada.component.html',
  styleUrls: ['./crear-entrada.component.css']
})
export class CrearEntradaComponent implements OnInit {
  public identity: any;
  public idMascota: string = '';
  public mascota: Mascota;
  public historial: Historial;
  public idHistorial: number = 0;
  public entrada: Entrada;

  constructor(
    private usuarioService: UsuarioService,
    private mascotaService: MascotaService,
    private entradaService: EntradaService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private location: Location,
    private router: Router
  ) {
    this.identity = this.usuarioService.getIdentity();
    this.mascota = new Mascota('', '', '', '', '', '', '', 0, 0, '', 'default-image.png', '', '', '', null);
    this.historial = new Historial(0, '');
    this.entrada = new Entrada(0, 0, new Date(), '', new Date(), '', null, null, '');
  }

  ngOnInit(): void {
    this.idMascota = this.route.snapshot.paramMap.get('idMascota')!;
    this.obtenerMascota();
    this.obtenerHistorial();
  }

  /**
   * Método encargado de crear una nueva entrada
   */
  public onSubmit(): void {
    this.entrada.id_historial = this.idHistorial;
    this.entrada.dni_creacion = this.identity.dni;

    this.entradaService.crearEntrada(this.entrada).subscribe(
      response => {
        this.router.navigate(['historial-mascota', this.idMascota]);
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    )
  }

  /**
   * Método encargado de obtener los datos de la mascota
   */
  public obtenerMascota(): void {
    this.mascotaService.consultarMascota(this.idMascota).subscribe(
      response => {
        this.mascota = response.pet;
      },
      error => {
        if (error.status == 401) {
          localStorage.clear();
          this.router.navigate(['login']).then(() => {
            window.location.reload();
          });
        }
        this.addErrorMessage(error.error.message);
      }
    );
  }

  /**
   * Método encargado de obtener el historial de la mascota
   */
   public obtenerHistorial(): void {
    if (this.idMascota != "") {
      this.mascotaService.obtenerHistorial(this.idMascota).subscribe(
        response => {
          this.historial = response.historial;
          this.idHistorial = this.historial.id_historial;
        },
        error => {
          this.addErrorMessage(error.error.message);
        }
      );
    }
  }

  /**
   * Método encargado de volver a la página anteriormente visitada
   */
   public goBack(): void {
    this.location.back();
  }

  /**
   * Método encargado de mostrar una notificación con un mensaje de error
   * @param msg Mensaje pasado por parámetro
   */
  public addErrorMessage(msg: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msg });
  }

}
