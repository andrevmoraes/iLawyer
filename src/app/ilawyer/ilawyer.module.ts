import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IlawyerPageRoutingModule } from './ilawyer-routing.module';

import { IlawyerPage } from './ilawyer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IlawyerPageRoutingModule
  ],
  declarations: [IlawyerPage]
})
export class IlawyerPageModule {}
