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
        photoURL   : "https://firebasestorage.googleapis.com/v0/b/ilawyer-db.appspot.com/o/Papel%20de%20Parede.jpg?alt=media&token=27a2bdf7-5e2b-4b70-b10b-9dbb449df2e4"
      }).then(() => {
        console.log("Profile Updated")
        this.contaCriadaSucesso();
        
        var advogado = "@ilawyer.com";
        if (this.email.includes(advogado)) {
          this.navCtrl.navigateRoot('/calendario');
        } else {
          this.navCtrl.navigateRoot('/feed');
        }
        
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