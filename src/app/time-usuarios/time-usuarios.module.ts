import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeUsuariosPageRoutingModule } from './time-usuarios-routing.module';

import { TimeUsuariosPage } from './time-usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeUsuariosPageRoutingModule
  ],
  declarations: [TimeUsuariosPage]
})
export class TimeUsuariosPageModule {}
