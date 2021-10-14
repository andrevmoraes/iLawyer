import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AreaAdvogadoPageRoutingModule } from './area-advogado-routing.module';

import { AreaAdvogadoPage } from './area-advogado.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AreaAdvogadoPageRoutingModule
  ],
  declarations: [AreaAdvogadoPage]
})
export class AreaAdvogadoPageModule {}
