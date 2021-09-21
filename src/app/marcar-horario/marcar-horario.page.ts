import { Component, OnInit, ViewChild, ɵLocaleDataIndex } from '@angular/core';
import firebase from 'firebase';
import {
  MenuController,
  NavController,
  ToastController,
  AlertController,
  ActionSheetController,
  ModalController
} from '@ionic/angular';
import { CalendarComponent } from 'ionic2-calendar';
import * as moment from 'moment';
import { formatDate } from '@angular/common';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx'

@Component({
  selector: 'app-marcar-horario',
  templateUrl: './marcar-horario.page.html',
  styleUrls: ['./marcar-horario.page.scss'],
})

export class MarcarHorarioPage implements OnInit {
  @ViewChild(CalendarComponent) myCal: CalendarComponent;

  title: string;
  desc: string;
  adv: string;
  startTime: string;
  endTime: string;
  currentDate = new Date();
  permitirAgendamento = true;

  agendas = [];

  imageUrl = "";
  image: string;


  //firebase auth
  name: string;
  email: string;
  tel: string;
  photoUrl: string;
  uid: string;
  emailVerified: boolean;

  constructor(
    private menu: MenuController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private modalCtrl: ModalController,
    public alertController: AlertController,
    public actionSheetController: ActionSheetController,
    private camera: Camera) {

  }

  ngOnInit(): void {
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
          this.navCtrl.navigateRoot('/calendario');
        }

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

  //salvar agendamento no banco de dados
  agendar() {

    let queryx = firebase.firestore().collection("users").where("owner", "==", this.uid);
    queryx.get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.tel = doc.data().tel;
        });
      }).then(() => {
        this.agendas = []
        let query = firebase.firestore().collection("agenda").where("adv", "==", this.adv);
        query.get()
          .then((docs) => {
            docs.forEach((doc) => {
              this.agendas.push(doc);
              doc.data().startTime;

              var dia = false;
              var hora = false;

              var startDia = moment(doc.data().startTime.toDate()).format("DD/MM/YYYY");
              var endDia = moment(doc.data().startTime.toDate()).add(1, 'hour').format("DD/MM/YYYY");
              var nowDia = moment(this.startTime).format("DD/MM/YYYY");

              var startHora = moment(doc.data().startTime.toDate()).format("HH:mm");
              var endHora = moment(doc.data().startTime.toDate()).add(1, 'hour').format("HH:mm");
              var nowHora = moment(this.startTime).format("HH:mm");

              if (startDia <= nowDia && nowDia <= endDia) {
                dia = true;
              } else {
                dia = false;
              }

              if (startHora <= nowHora && nowHora <= endHora) {
                hora = true;
              } else {
                dia = false;
              }

              if (dia && hora) {
                this.permitirAgendamento = false;
                console.log("Data não disponível");
              } else {
                this.permitirAgendamento = true;
                console.log("Data disponível");
              }

            })
            console.log(this.agendas);
          }).catch((err) => {
            console.log(err);
          }).then(async () => {

            console.log("PERMISSAO DE AGENDAMENTO: " + this.permitirAgendamento);

            if (this.permitirAgendamento) {

              firebase.firestore().collection("agenda").add({
                title: this.title,
                desc: this.desc,
                adv: this.adv,
                imagem: this.imageUrl,
                tel: this.tel,
                email: this.email,
                startTime: new Date(this.startTime),
                created: firebase.firestore.FieldValue.serverTimestamp(),
                owner: firebase.auth().currentUser.uid,
                owner_name: firebase.auth().currentUser.displayName
              }).then((doc) => {
                console.log(doc)
                this.navCtrl.navigateRoot('/agenda');
                //this.getPosts();
              }).catch((err) => {
                console.log(err)
              })

            } else {
              const toast = await this.toastCtrl.create({
                message: 'Data ou horario não disponível.',
                duration: 3000
              });
              toast.present();
            }
          })

      })

  }

  //excluir uma postagem
  async menuAdvs() {
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Excluir',
          role: 'destructive',
          //icon: 'trash',
          handler: async () => {
            console.log("lidando...");
          }
        }, {
          text: 'Cancelar',
          //icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }


  //abrir camera
  tirarFoto() {
    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      allowEdit: false
    }

    this.camera.getPicture(options).then(async (base64Image) => {

      const toast = await this.toastCtrl.create({
        message: 'Aguarde! Fazendo upload da imagem.',
        duration: 3000
      });
      toast.present();
      console.log(base64Image);
      this.image = "data:image/png;base64," + base64Image;
      this.uploadImage(this.currentDate[Symbol.toPrimitive]('number'));
    }).catch(async (err) => {
      console.log(err);
      const toast = await this.toastCtrl.create({
        message: err,
        duration: 3000
      });
      toast.present();
    })
  }

  //salvar imagem no banco de dados
  uploadImage(name: string | number) {
    let ref = firebase.storage().ref("anexoAgenda/" + name);
    let uploadTask = ref.putString(this.image.split(',')[1], "base64");
    uploadTask.on("state_changed", (taskSnapshot) => {
      console.log(taskSnapshot);
    }, (error) => {
      console.log(error);
    }, () => {
      console.log("Upload de imagem concluído");
      uploadTask.snapshot.ref.getDownloadURL().then(async (url) => {
        console.log(url);
        this.imageUrl = url;
        const toast = await this.toastCtrl.create({
          message: "Upload de imagem concluído",
          duration: 3000
        });
        toast.present();
      })
    })
  }


  //not working yet
  min() {
    var data = new Date;
    var datax = moment(data).format("DD-MM-YYYY");
    console.log(datax);
    return data;
  }

}
