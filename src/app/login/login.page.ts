import { Component } from '@angular/core';
import firebase from 'firebase'
import { NavController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
})
export class LoginPage {

  email: string = "";
  password: string = "";

  constructor(public toastCtrl: ToastController, public navCtrl: NavController) {
  }

  
  login() {
    firebase.auth().signInWithEmailAndPassword(this.email, this.password)
      .then(async (user) => {
        console.log(user)
        const toast = await this.toastCtrl.create({
          message: "Olá, " + user.user.displayName + "!",
          duration: 3000
        });
        toast.present();
        this.navCtrl.navigateRoot('/feed');

      }).catch(async (err) => {
        console.log(err)
        const toast = await this.toastCtrl.create({
          message: err.message,
          duration: 3000
        });
        toast.present();
      })
  }
}


