import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase';
import {
  MenuController,
  NavController,
  ToastController,
  ModalController
} from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';

@Component({
  selector: 'app-marcar-horario',
  templateUrl: './marcar-horario.page.html',
  styleUrls: ['./marcar-horario.page.scss'],
})

export class MarcarHorarioPage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  title: string;
  desc: string;
  adv: string;
  startTime: string;
  currentDate = new Date();

  //firebase auth
  name: string;
  email: string;
  photoUrl: string;
  uid: string;
  emailVerified: boolean;

  constructor(
    private menu: MenuController,
    public navCtrl: NavController,
    public toastCtrl: ToastController) {

  }
  
  ngOnInit(): void {
    this.getUserInfo();
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
  
  //salvar agendamento no banco de dados
  agendar() {
    firebase.firestore().collection("agenda").add({
      title: this.title,
      desc: this.desc,
      adv: this.adv,
      startTime: new Date(this.startTime),
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    }).then((doc) => {
      console.log(doc)
      this.navCtrl.navigateRoot('/agenda');
      //this.getPosts();
    }).catch((err) => {
      console.log(err)
    })
  }

}
