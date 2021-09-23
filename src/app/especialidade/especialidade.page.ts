import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import firebase from 'firebase';

import { NavController } from '@ionic/angular';


interface User {
  especialidade: string;
}


@Component({
  selector: 'app-especialidade',
  templateUrl: './especialidade.page.html',
  styleUrls: ['./especialidade.page.scss'],
})
export class EspecialidadePage implements OnInit {

  descr: string = "";
  especialidades = [];
  idDocUsers: string;

  //firebase auth
  name: string;
  email: string;
  photoUrl: string;
  uid: string;
  emailVerified: boolean;

  constructor( public navCtrl: NavController) { }

  ngOnInit() {
    this.getUserInfo();
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
        this.obterMaisInfo()
      } else {
        console.log("Não foi possível recolher as informações");
        this.navCtrl.navigateRoot('/');
      }
    });
  }

  users: User[] = [
    {
      especialidade: 'Trabalhista',
    },
    {
      especialidade: 'Imobiliário',
    },
    {
      especialidade: 'Civil',
    },
    {
      especialidade: 'Bancário',
    },
    {
      especialidade: 'Empresarial',
    },
    {
      especialidade: 'Contratos',
    },
    {
      especialidade: 'Consumidor',
    }
  ];

  signup() {

    this.especialidades.push("Todos");

    const data = {
      especialidade: this.especialidades,
      descr: this.descr
    };
    console.log("especialidades: " + this.especialidades + " - descr: " + this.descr);
    let query = firebase.firestore().collection("users").doc(this.idDocUsers).update(data).then(() => {
      this.navCtrl.navigateRoot('/feed');

    });
  }

  obterMaisInfo() {
    let query = firebase.firestore().collection("users").where("owner", "==", this.uid);
    query.get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.idDocUsers = doc.id;
          this.descr = doc.data().descr;
          this.especialidades = doc.data().especialidade;
          console.log("id do documento: " + this.idDocUsers);
        })
      }).catch((err) => {
        console.log(err);
      })

  }

}
