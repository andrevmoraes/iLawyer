import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MarcarHorarioPage } from './marcar-horario.page';

const routes: Routes = [
  {
    path: '',
    component: MarcarHorarioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MarcarHorarioPageRoutingModule {}
