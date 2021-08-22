import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Entrada } from 'src/app/models/Entrada';
import { Mascota } from 'src/app/models/Mascota';
import { EntradaService } from 'src/app/services/entrada.service';
import { MascotaService } from 'src/app/services/mascota.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-modificar-entrada',
  templateUrl: './modificar-entrada.component.html',
  styleUrls: ['./modificar-entrada.component.css']
})
export class ModificarEntradaComponent implements OnInit {
  public identity: any;
  public idMascota: string = '';
  public mascota: Mascota;
  public entrada: Entrada;
  public idEntrada: string = '';

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
    this.entrada = new Entrada(0, 0, new Date(), '', new Date(), '', null, null, '');
  }

  ngOnInit(): void {
    this.idMascota = this.route.snapshot.paramMap.get('idMascota')!;
    this.idEntrada = this.route.snapshot.paramMap.get('idEntrada')!;

    this.obtenerMascota();
    this.obtenerEntrada();
  }

  /**
   * Método encargado de modificar una nueva entrada
   */
   public onSubmit(): void {
    this.entrada.dni_modificacion = this.identity.dni;

    this.entradaService.modificarEntrada(this.entrada).subscribe(
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
   * Método encargado de obtener los datos de la entrada
   */
  public obtenerEntrada(): void {
    this.entradaService.consultarEntrada(parseInt(this.idEntrada)).subscribe(
      response => {
        this.entrada = response.entrada;
        this.entrada.descripcion = response.doc.descripcion;
      },
      error => {
        this.addErrorMessage(error.error.message);
      }
    );
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
