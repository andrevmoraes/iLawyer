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
    private camera: Camera) {

    this.getUserInfoObs();
    this.getUserInfo();
  }

  ngOnInit() {
    this.getUserInfo();
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }


  async alterarEmailPopup() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alterar email',
      inputs: [
        {
          name: 'text',
          id: 'text',
          type: 'email',
          placeholder: 'user@example.com'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Alterar',
          handler: (alertData) => {
            console.log('Confirm Ok');
            this.alterarEmail(alertData.text);
          }
        }
      ]
    });

    await alert.present();
  }

  async alterarNomePopup() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alterar nome',
      inputs: [
        {
          name: 'text',
          id: 'text',
          type: 'email',
          placeholder: 'Digite seu nome'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Alterar',
          handler: (alertData) => {
            console.log('Confirm Ok');
            this.alterarNome(alertData.text);
          }
        }
      ]
    });

    await alert.present();
  }

  async alterarSenhaPopup() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alterar senha',
      inputs: [
        {
          name: 'text',
          id: 'text',
          type: 'password',
          placeholder: 'Digite sua nova senha'
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Alterar',
          handler: (alertData) => {
            console.log('Confirm Ok');
            this.alterarSenha(alertData.text);
          }
        }
      ]
    });

    await alert.present();
  }

  async deletarContaPopup() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Deletar conta',
      message: 'Você tem certeza que quer deletar sua conta? Essa ação não pode ser desfeita',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Deletar',
          handler: (alertData) => {
            console.log('Confirm Ok');
            this.deletarConta();
          }
        }
      ]
    });

    await alert.present();
  }


  alterarEmail(email: string) {
    firebase.auth().currentUser.verifyBeforeUpdateEmail(email)
      .then(function () {
        console.log("Email de verificação enviado");
      })
      .catch(function (error) {
        console.log("Ocorreu um erro: " + error);
      });
  }

  alterarNome(name: string) {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log("Usuário logado");
        user.updateProfile({
          displayName: name
        }).then(function (user) {
          console.log("Nome alterado");
        }, async function (error) {
          console.log("Ocorreu um erro: " + error);
          const toast = await this.toastCtrl.create({
            message: error.message,
            duration: 3000
          });
          toast.present();
        });
      } else {
        console.log("Nenhum usuário logado. Redirecionando à tela de login");
        this.navCtrl.navigateRoot('/login');
      }
    });
  }

  alterarSenha(senha: string) {
    firebase.auth().currentUser.updatePassword(senha)
      .then(function () {
        console.log("Senha alterada");
      })
      .catch(function (error) {
        console.log("Ocorreu um erro: " + error);
      });
  }

  deletarConta() {
    firebase.auth().currentUser.delete()
      .then(function () {
        console.log("Conta deletada");
      })
      .catch(function (error) {
        console.log("Ocorreu um erro: " + error);
      });
  }


  getUserInfoObs() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        console.log("Usuário logado");
      } else {
        console.log("Nenhum usuário logado. Redirecionando à tela de login");
        this.navCtrl.navigateRoot('/login');
      }
    });
  }

  getUserInfo() {
    console.log("Recolhendo informações do usuário logado");
    this.name = "Carregando...";
    this.email = "Carregando...";

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
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
      } else {
        this.email = "Carregando..."
        console.log("Não foi possível recolher as informações")
      }
    });
  }

  logout() {
    firebase.auth().signOut().then(() => {
      console.log("Sign-out successful");
      this.navCtrl.navigateRoot('/login');
    }).catch((error) => {
      console.log("An error happened");
    });
  }

}
