import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase';
import * as moment from 'moment';
import { IonInfiniteScroll,
  MenuController,
  NavController,
  AlertController,
  ToastController,
  LoadingController,
  ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'


@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.page.html',
  styleUrls: ['./userinfo.page.scss'],
})
export class UserinfoPage implements OnInit {

  //firebase auth
  name: string;
  email: string;
  photoUrl: string;
  uid: string;
  emailVerified: boolean;

  constructor(
    private menu: MenuController,
    public navCtrl: NavController,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public actionSheetController: ActionSheetController,
    private camera: Camera) { }

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
    this.uid = user.uid;
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
  
  logout(){
    firebase.auth().signOut().then(() => {
    console.log("Sign-out successful");
    this.navCtrl.navigateRoot('/login');
  }).catch((error) => {
    console.log("An error happened");
  });
}

}
