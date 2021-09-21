import { Component, OnInit } from '@angular/core';
import { MenuController, NavController, ToastController } from '@ionic/angular';
import firebase from 'firebase';

@Component({
  selector: 'app-time-usuarios',
  templateUrl: './time-usuarios.page.html',
  styleUrls: ['./time-usuarios.page.scss'],
})
export class TimeUsuariosPage implements OnInit {

  //firebase auth
  name: string;
  email: string;
  photoUrl: string;
  uid: string;
  emailVerified: boolean;
  cidade = "Mogi Mirim";
  especialidade = "Todos";
  descr: string;

  advs = [];

  constructor(
    public navCtrl: NavController,
    private menu: MenuController,
    public toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.getUserInfo();
    this.obterAgenda();
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


  obterAgenda() {
    this.advs = []
    const usuarios = firebase.firestore().collection("users").where("advogado", "==", "true").where('especialidade', 'array-contains', this.especialidade).where('cidade', '==', this.cidade);
    usuarios.get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.advs.push(doc);
        })
        console.log(this.advs);
      }).catch((err) => {
        console.log(err);
      })

  }

}
