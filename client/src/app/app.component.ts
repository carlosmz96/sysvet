import { Component } from '@angular/core';
import { Usuario } from './models/Usuario';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'SYSVET';
  public usuario: Usuario;
  public identity = false;
  public token = null;

  constructor() {
    this.usuario = new Usuario('','','','','','','','','');
  }

}
