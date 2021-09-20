import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-ilawyer',
  templateUrl: './ilawyer.page.html',
  styleUrls: ['./ilawyer.page.scss'],
})
export class IlawyerPage implements OnInit {


  //firebase auth
  name: string;
  email: string;
  photoUrl: string;
  uid: string;
  emailVerified: boolean;

  constructor(public navCtrl: NavController) { }

  //ao iniciar
  ngOnInit() {
    this.getUserInfo();
  }

  //obter informações do usuário
  getUserInfo() {
    console.log("Verificando se o usuário está logado");
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.navCtrl.navigateRoot('/feed');
      } else {
        console.log("O usuário não está logado");
      }
    });
  }

}
