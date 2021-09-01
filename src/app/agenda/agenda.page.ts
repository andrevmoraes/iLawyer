import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase';
import {
  MenuController,
  NavController,
  AlertController,
  ToastController,
  ActionSheetController
} from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import { formatDate } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.page.html',
  styleUrls: ['./agenda.page.scss'],
})

export class AgendaPage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  //calendario
  locale = "";
  eventSource = []; // API com BD
  viewTitle: string;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale:'pt-BR',
  };
  selectedDate: Date;  

  title: string;
  desc: string;
  adv: string;
  startTime: string;
  currentDate = new Date();

  events: any;

  event = {
    title: '',
    desc: '',
    startTime: null,
    endTime: '',
    adv: '',
    allDay: false
  };
  modalReady = false;

   //firebase auth
   name: string;
   email: string;
   photoUrl: string;
   uid: string;
   emailVerified: boolean;
   
   text: string;
   agendas: any[] = [];
  
  constructor(
    private modalCtrl: ModalController,
    private menu: MenuController,
    public navCtrl: NavController,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public actionSheetController: ActionSheetController) {

  }

  ngOnInit() {
    this.getUserInfo();
    this.obterAgenda();
    console.log("DATA SELECIONADA: " + this.selectedDate);
  }

  //abrir menu
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  //obter informações do usuário
  getUserInfo() {
    console.log("Recolhendo as informações do usuário");
    this.name = "Carregando...";
    this.email = "Carregando...";

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.name = user.displayName;
        this.email = user.email;
        this.photoUrl = user.photoURL;
        this.emailVerified = user.emailVerified;
        this.uid = user.uid;
        console.log("Usuário " + this.name + " logado");
        console.log("email: " + this.email);
        console.log("photoUrl: " + this.photoUrl);
        console.log("emailVerified: " + this.emailVerified);
        console.log("uid: " + this.uid);
      } else {
        console.log("Não foi possível recolher as informações");
        this.navCtrl.navigateRoot('/');
      }
    });
  }

  //sair
  logout() {
    firebase.auth().signOut().then(() => {
      console.log("Sign-out successful");
      this.navCtrl.navigateRoot('/login');
    }).catch(async (error) => {
      console.log("An error happened: " + error);
      const toast = await this.toastCtrl.create({
        message: error,
        duration: 3000
      });
      toast.present();
    });
  }



  //calendario

  next(){
    this.myCal.slideNext()
  }

  back(){
    this.myCal.slidePrev()
  }

  //altera o titulo para o nome do mês
  onViewTitleChanged(title){
    this.viewTitle = title;
    console.log(this.viewTitle);
  }

 // onChange(event){
 //   console.log("onchange event called");
 //   console.log(moment(this.date._d).format("YYYY-MM-DD"));
 // }
  
  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);
 
    const alert = await this.alertController.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK'],
    });
    alert.present();
  }
 
   //obter postagens - baseado no limite (pageSize)
   obterAgenda() {
    this.agendas = []
    let query = firebase.firestore().collection("agenda").orderBy("startTime", "desc");
    query.get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.agendas.push(doc);
        })
        console.log(this.agendas);
      }).catch((err) => {
        console.log(err);
      })
  }

}
