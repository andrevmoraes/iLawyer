import { Component, OnInit } from '@angular/core';
import firebase from 'firebase'
import { NavController, ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  name: string = "";
  email: string = "";
  password: string = "";
  person: any;
  uid: string = "";
  tel = "";
  sexo = "";
  nasc: any;
  advogado = "";
  photoUrl: string;
  emailVerified: boolean;
  cidade: string;


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

        this.emailVerified = data.user.emailVerified;
        this.uid = data.user.uid;

        var ilawyer = "@ilawyer.com";
        if (this.email.includes(ilawyer)) {
          this.advogado = "true";
        } else {
          this.advogado = "false";
        }
        console.log("advogado: " + this.advogado);

        console.log("Perfil criado");

        console.log(data)
        let newUser: firebase.User = data.user;

        newUser.updateProfile({
          displayName: this.name,
          photoURL: "https://firebasestorage.googleapis.com/v0/b/ilawyer-db.appspot.com/o/fotoPadrao.jpg?alt=media&token=ff285a4d-9ab6-4536-8e76-8921d53bf026"

        }).then(() => {

          console.log("ADVOGADO: " + this.advogado);
          firebase.firestore().collection("users").add({
            tel: this.tel,
            sexo: this.sexo,
            nasc: this.nasc,
            advogado: this.advogado,
            email: this.email,
            cidade: this.cidade,
            photoURL: "https://firebasestorage.googleapis.com/v0/b/ilawyer-db.appspot.com/o/fotoPadrao.jpg?alt=media&token=ff285a4d-9ab6-4536-8e76-8921d53bf026",
            emailVerified: this.emailVerified,
            created: firebase.firestore.FieldValue.serverTimestamp(),
            owner: firebase.auth().currentUser.uid,
            owner_name: this.name
          }).then((doc) => {
            console.log(doc)
            console.log("Pefil completo");
            this.contaCriadaSucesso();

            var ilawyer = "@ilawyer.com";
        if (this.email.includes(ilawyer)) {
          this.advogado = "true";
          this.navCtrl.navigateRoot('/especialidade');
        } else {
          this.advogado = "false";
          this.navCtrl.navigateRoot('/feed');
        }
          }).catch((err) => {
            console.log(err)
          });


        })

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