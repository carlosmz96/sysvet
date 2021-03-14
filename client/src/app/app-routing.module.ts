import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CambiarClaveComponent } from './cambiar-clave/cambiar-clave.component';
import { RecordarClaveComponent } from './recordar-clave/recordar-clave.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent
  },
  {
    path: 'recordar-clave',
    component: RecordarClaveComponent
  },
  {
    path: 'cambiar-clave/:token',
    component: CambiarClaveComponent
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
