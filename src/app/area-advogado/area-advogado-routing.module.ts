import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AreaAdvogadoPage } from './area-advogado.page';

const routes: Routes = [
  {
    path: '',
    component: AreaAdvogadoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AreaAdvogadoPageRoutingModule {}
