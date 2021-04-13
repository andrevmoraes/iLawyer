import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IlawyerPage } from './ilawyer.page';

const routes: Routes = [
  {
    path: '',
    component: IlawyerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IlawyerPageRoutingModule {}
