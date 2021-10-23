import { Component, OnInit } from '@angular/core';
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
  selector: 'app-area-advogado',
  templateUrl: './area-advogado.page.html',
  styleUrls: ['./area-advogado.page.scss'],
})
export class AreaAdvogadoPage implements OnInit {


  //firebase auth
  name: string;
  email: string;
  photoUrl: string;
  uid: string;
  emailVerified: boolean;

  vazio = "CARREGANDO...";

  clientes: any;
  pessoas: any;

  constructor(
    private modalCtrl: ModalController,
    private menu: MenuController,
    public navCtrl: NavController,
    public alertController: AlertController,
    public toastCtrl: ToastController,
    public actionSheetController: ActionSheetController) { }

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

        var advogado = "@ilawyer.com";
        if (this.email.includes(advogado)) {
          console.log("Advogado autenticado")
          this.obterClientes();
        } else {
          this.navCtrl.navigateRoot('/feed');
        }

        //this.obterAgenda();
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

  obterClientes() {
    this.clientes = [];
    var novo = [];
    var processos = [];
    var telefone = [];
    var email = [];
    this.pessoas = [];
    let query = firebase.firestore().collection("agenda").where("adv", "==", this.name);
    query.get()
      .then((docs) => {

        docs.forEach((doc) => {
          this.clientes.push(doc.data());
          novo.push(doc.data().owner_name);
        })

        novo = [...new Map(novo.map(item => [JSON.stringify(item), item])).values()];

        for (var i = 0; i < novo.length; i++) {
          for (var y = 0; y < this.clientes.length; y++) {
            if (this.clientes[y].owner_name == novo[i]) {
              processos.push(this.clientes[y].proc);
              telefone.push(this.clientes[y].tel);
              email.push(this.clientes[y].email);
            }
          }
          processos = [...new Map(processos.map(item => [JSON.stringify(item), item])).values()];
          telefone = [...new Map(telefone.map(item => [JSON.stringify(item), item])).values()];
          email = [...new Map(email.map(item => [JSON.stringify(item), item])).values()];
          this.pessoas.push({ nome: novo[i], processos: processos, telefone: telefone, email: email});
          processos = [];
        }

        console.log(JSON.stringify(this.pessoas));



      }).then(() => {
        if (this.clientes.length == 0) {
          this.vazio = "NÃO HÁ CLIENTES";
          console.log(this.vazio + this.clientes.length);
        } else {
          this.vazio = "";
          console.log(this.vazio + this.clientes.length);
        }
      }).catch((err) => {
        console.log(err);
      })
  }
}
