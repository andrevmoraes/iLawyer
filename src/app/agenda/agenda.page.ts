import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { MarcarHorarioPage } from '../marcar-horario/marcar-horario.page';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})
export class AgendaPage implements OnInit {
  eventSource = []; // API com BD
  viewTitle: string;

  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale:'pt-BR',
  };
  selectedDate: Date;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;
  
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }
  
  next(){
    this.myCal.slideNext()
  }

  back(){
    this.myCal.slidePrev()
  }

  onViewTitleChanged(title){
    this.viewTitle = title;
  }

  
    // Tirar isso
  async openCalModal() {
    const modal = await this.modalCtrl.create({
      component: MarcarHorarioPage,
      cssClass: 'Marcar-Horario',
      backdropDismiss: false
    });
   

    await modal.present();
   
    modal.onDidDismiss().then((result) => {
      if (result.data && result.data.event) {
        let event = result.data.event;
        if (event.allDay) {
          let start = event.startTime;
          event.startTime = new Date(
            Date.UTC(
              start.getUTCFullYear(),
              start.getUTCMonth(),
              start.getUTCDate()
            )
          );
          event.endTime = new Date(
            Date.UTC(
              start.getUTCFullYear(),
              start.getUTCMonth(),
              start.getUTCDate() + 1
            )
          );
        }
        this.eventSource.push(result.data.event);
        this.myCal.loadEvents();
      }
    });
  }

}
