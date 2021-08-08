import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase';
import * as moment from 'moment';
import {
  IonInfiniteScroll,
  MenuController,
  NavController,
  AlertController,
  ToastController,
  LoadingController,
  ActionSheetController
} from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'

@Component({
  selector: 'app-nosso-time',
  templateUrl: './nosso-time.page.html',
  styleUrls: ['./nosso-time.page.scss'],
})

export class NossoTimePage implements OnInit {

  //firebase auth
  name: string;
  email: string;
  photoUrl: string;
  uid: string;
  emailVerified: boolean;

  constructor(
    public navCtrl: NavController,
    private menu: MenuController,
    public toastCtrl: ToastController) {

    }

    ngOnInit() {
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

}
