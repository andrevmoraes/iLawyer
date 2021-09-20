import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EspecialidadePage } from './especialidade.page';

const routes: Routes = [
  {
    path: '',
    component: EspecialidadePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EspecialidadePageRoutingModule {}
