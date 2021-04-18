import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  templateUrl: './acceso-denegado.component.html',
  styleUrls: ['./acceso-denegado.component.css']
})
export class AccesoDenegadoComponent implements OnInit {
  public title: string = 'SYSVET';

  constructor(
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(153, 224, 153)';
  }

  /**
   * Método encargado de redireccionar a login
   */
   public goLogin(): void {
    this.elementRef.nativeElement.ownerDocument.body.style.background = 'rgb(243, 243, 243)';
    this.router.navigate(['login']);
  }

}
