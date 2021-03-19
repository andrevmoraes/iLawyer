import { Component, OnInit } from '@angular/core';
import firebase from 'firebase'
import { NavController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector   : 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls  : ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  name     : string = "";
  email    : string = "";
  password: string  = "";


  constructor(public toastCtrl: ToastController, public alertCtrl: AlertController, public navCtrl: NavController) {
  }


  async contaCriadaSucesso() {
    const alert = await this.alertCtrl.create({
      header: 'Conta criada',
      message: 'Sua conta foi criada com sucesso',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            console.log('Confirm Okay');
          }
        }
      ]
    });
    await alert.present();
  }



  
  ngOnInit() {
  }

  signup() {
    console.log(this.name, this.email, this.password);
    firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
    .then((data) => {
      console.log(data)

      let newUser: firebase.User = data.user;
      newUser.updateProfile({
        displayName: this.name,
        photoURL   : ""
      }).then(() => {
        console.log("Profile Updated")
        this.contaCriadaSucesso();
        this.navCtrl.navigateRoot('/feed');
        })
      }).catch(async (err) => {
        console.log(err)
        const toast = await this.toastCtrl.create({
          message : err.message,
          duration: 3000
        });
        toast.present();
      })
    }
}