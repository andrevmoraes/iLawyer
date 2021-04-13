import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MarcarHorarioPageRoutingModule } from './marcar-horario-routing.module';

import { MarcarHorarioPage } from './marcar-horario.page';
import { NgCalendarModule } from 'ionic2-calendar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MarcarHorarioPageRoutingModule, 
    NgCalendarModule
  ],
  declarations: [MarcarHorarioPage]
})
export class MarcarHorarioPageModule {}
