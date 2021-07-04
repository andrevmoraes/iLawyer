import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AgendaPageRoutingModule } from './agenda-routing.module';
import { AgendaPage } from './agenda.page';
import { NgCalendarModule } from 'ionic2-calendar';
import { MarcarHorarioPageModule } from '../marcar-horario/marcar-horario.module';

// Registar linguagem brasileira
import localePtBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localePtBr); 

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgendaPageRoutingModule,    
    NgCalendarModule,
    MarcarHorarioPageModule
  ],
  declarations: [AgendaPage],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ] 
})
export class AgendaPageModule {}