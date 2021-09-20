import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeUsuariosPage } from './time-usuarios.page';

const routes: Routes = [
  {
    path: '',
    component: TimeUsuariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeUsuariosPageRoutingModule {}
