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
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  //calendario
  locale = "";
  eventSource = []; // API com BD
  viewTitle: string;
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'pt-BR',
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
    console.log("DATA SELECIONADA: " + this.selectedDate);
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
        this.obterAgenda();
      } else {
        console.log("Não foi possível recolher as informações");
        this.navCtrl.navigateRoot('/');
      }
    });
  }

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

  obterAgenda() {
    this.agendas = []
    let query = firebase.firestore().collection("agenda").where("adv", "==", this.name);
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

  //transforma tempo de inicio
  ago(time: { toDate: () => moment.MomentInput; }) {
    var hrs = moment(time.toDate()).format("DD/MM/YYYY HH:mm");
    return hrs;
  }

  //adiciona uma hora e exibe como tempo de até
  ateHorarioCalculo(timex: { toDate: () => moment.MomentInput; }) {
    var hrs = moment(timex.toDate()).add(1, 'hour').format("HH:mm");
    return hrs;
  }

  //excluir uma postagem
  async menuAgendamentos(dataid: string, userpost: string) {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Excluir',
          role: 'destructive',
          //icon: 'trash',
          handler: async () => {
            console.log("lidando...");
            var user = firebase.auth().currentUser;
            console.log("usuario: " + user + " - " + user.uid);
            console.log('Delete clicked: ' + dataid);
            firebase.firestore().collection("agenda").doc(dataid).delete().then(() => {
              this.obterAgenda();
            });
          }
        }, {
          text: 'Cancelar',
          //icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

}
