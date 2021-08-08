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
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})

export class FeedPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  //postagens
  text: string = "";
  posts: any[] = [];
  pageSize: number = 10;
  cursor: any;
  nomeUsuario: string;
  image: string;

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

    this.getPosts();
  }
  
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

  //criar postagem
  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Postar',
      inputs: [
        {
          name: 'text',
          id: 'text',
          type: 'textarea',
          placeholder: 'O que está acontecendo?'
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
          text: 'Postar',
          handler: (alertData) => {
            console.log('Confirm Ok: ' + this.text);
            this.post(alertData.text);
          }
        }
      ]
    });

    await alert.present();
  }

  //excluir uma postagem
  async presentActionSheet(dataid: string, userpost: string) { 
    const actionSheet = await this.actionSheetController.create({
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Excluir',
          role: 'destructive',
          //icon: 'trash',
          handler: async () => {
            console.log("lidando...");
            var user = firebase.auth().currentUser;
            console.log("usuario: " + user + " - " + user.uid);
            if (userpost == user.uid) {
              console.log('Delete clicked: ' + dataid);
              firebase.firestore().collection("posts").doc(dataid).delete().then(() => {
                this.getPosts();
              })
            } else {
              console.log("Você só pode excluir as suas postagens");
              const toast = this.toastCtrl.create({
                message: "Você só pode excluir as suas postagens",
                duration: 3000
              });
              (await toast).present();
            };
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

  //obter postagens - baseado no limite (pageSize)
  getPosts() {
    this.posts = []
    let query = firebase.firestore().collection("posts").orderBy("created", "desc").limit(this.pageSize);
    query.get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.posts.push(doc);
        })
        console.log(this.posts);
        this.cursor = this.posts[this.posts.length - 1];
      }).catch((err) => {
        console.log(err);
      })
  }

  //obter mais postagens - baseado no limite (pageSize)
  loadMorePosts(event: { target: { complete: () => void; }; }) {
    firebase.firestore().collection("posts").orderBy("created", "desc").startAfter(this.cursor).limit(this.pageSize).get()
      .then((docs) => {
        docs.forEach((doc) => {
          this.posts.push(doc);
        })
        console.log(this.posts)
        if (docs.size < this.pageSize) {
          // all documents have been loaded, then cancel scroll
          this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
        } else {
          event.target.complete();
          this.cursor = this.posts[this.posts.length - 1];
        }
      }).catch((err) => {
        console.log(err)
      })
  }

  //salvar postagem no banco de dados
  post(text: string) {
    firebase.firestore().collection("posts").add({
      text: text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    }).then((doc) => {
      console.log(doc)
      if (this.image) {
        this.upload(doc.id);
      }
      this.getPosts()
    }).catch((err) => {
      console.log(err)
    })
  }

  //obter tempo da postagem
  ago(time) {
    let difference = moment(time.toDate()).diff(moment());
    return moment.duration(difference).locale("pt").humanize();
  }

  //desativar mais postagens
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled =! this.infiniteScroll.disabled;
  }

  //recarregar pagina
  doRefresh(event: { target: { complete: () => void; }; }) {
    console.log('Início do carregamento assíncrono da pagina');
    this.getPosts();
    //this.toggleInfiniteScroll();
    event.target.complete();
    setTimeout(() => {
      console.log('Fim do carregamento assíncrono da página TIMEOUT');
      event.target.complete();
    }, 2000);
  }

  //adicionar foto - lançar a camera
  addPhoto() {
    this.launchCamera();
  }

  //lançar a camera
  launchCamera() {
    let options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 512,
      targetWidth: 512
      //allowEdit: true
    }

    this.camera.getPicture(options).then((base64Image) => {
      console.log("imagem: " + base64Image);
      this.image = "data:image/png;base64," + base64Image;
    }).catch((err) => {
      console.log("erro: " + err)
    })
  }

  //salva a foto no banco de dados
  upload(name: string) {
    let ref = firebase.storage().ref("postImages/" + name);
    let uploadTask = ref.putString(this.image.split(',')[1], "base64");
    uploadTask.on("state_changed", (taskSnapshot) => {
      console.log(taskSnapshot)
    }, (error) => {
      console.log(error)
    }, () => {
      console.log("upload completo");
      uploadTask.snapshot.ref.getDownloadURL().then((url) => {
        console.log(url)
      })
    })
  }

}