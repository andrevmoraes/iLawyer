import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { MarcarHorarioPage } from '../marcar-horario/marcar-horario.page';
import firebase from 'firebase';
import * as moment from 'moment';
import { IonInfiniteScroll, MenuController, NavController, ToastController, LoadingController } from '@ionic/angular';

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

   //firebase auth
   name: string;
   email: string;
   photoUrl: string;
   uid: string;
   emailVerified: boolean;
  
  constructor(private modalCtrl: ModalController, private menu: MenuController,) {

    this.getUserInfoObs();
  }

  
  ngOnInit() {
    
  }
  

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  getUserInfoObs() {

    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("Usuário logado");
      } else {
        console.log("Nenhum usuário logado. Redirecionando à tela de login");
        this.navCtrl.navigateRoot('/login');
      }
    });
  }

  getUserInfo(){
    console.log("Recolhendo informações do usuário logado");
    var user = firebase.auth().currentUser;
    
    if (user != null) {
    this.name = user.displayName;
    this.email = user.email;
    this.photoUrl = user.photoURL;
    this.emailVerified = user.emailVerified;
    this.uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                    // this value to authenticate with your backend server, if
                    // you have one. Use User.getToken() instead.
    
    console.log("name: " + this.name);
    console.log("email: " + this.email);
    console.log("photoUrl: " + this.photoUrl);
    console.log("emailVerified: " + this.emailVerified);
    console.log("uid: " + this.uid);

    }else{
      this.email = "Carregando..."
      console.log("Não foi possível recolher as informações")
    }
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
