import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase';
import * as moment from 'moment';
import { IonInfiniteScroll, MenuController, NavController, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx'

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})

export class FeedPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

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
    private camera: Camera) {  

    this.getUserInfoObs();
    this.getPosts();
  }

  ngOnInit() {
  }

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

  post() {
    firebase.firestore().collection("posts").add({
      text: this.text,
      created: firebase.firestore.FieldValue.serverTimestamp(),
      owner: firebase.auth().currentUser.uid,
      owner_name: firebase.auth().currentUser.displayName
    }).then((doc) => {
      console.log(doc)
      if(this.image){
        this.upload(doc.id);
      }
      this.getPosts()
    }).catch((err) => {
      console.log(err)
    })
  }

  ago(time) {
    let difference = moment(time.toDate()).diff(moment());
    return moment.duration(difference).locale("pt").humanize();
  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  getUserInfoObs() {
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        console.log("Usuário logado");
      } else {
        console.log("Nenhum usuário logado. Redirecionando à tela de login");
        this.navCtrl.navigateRoot('/login');
      }
    });
  }

  getUserInfo(){
    console.log("Recolhendo informações do usuário logado");
    var user = firebase.auth().currentUser;
        if (user != null) {
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
    }else{
      this.email = "Carregando..."
      console.log("Não foi possível recolher as informações")
    }
  }

  doRefresh(event: { target: { complete: () => void; }; }) {
    console.log('Início do carregamento assíncrono da pagina');
    this.getPosts();
    this.toggleInfiniteScroll();
    event.target.complete();
    setTimeout(() => {
      console.log('Fim do carregamento assíncrono da página TIMEOUT');
      event.target.complete();
    }, 2000);
  }

  logout(){
    firebase.auth().signOut().then(() => {
      console.log("Sign-out successful")
      this.navCtrl.navigateRoot('/feed');
    }).catch((error) => {
      // An error happened.
    });
  }

  addPhoto(){
    this.launchCamera();
  }

  launchCamera(){
    let options: CameraOptions ={
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

    this.camera.getPicture(options).then((base64Image) =>{
      console.log("imagem: " + base64Image);
      this.image = "data:image/png;base64," + base64Image;
    }).catch((err) =>{
      console.log("erro: " + err)
    })
  }

  upload(name: string){
    let ref = firebase.storage().ref("postImages/" + name);
    let uploadTask = ref.putString(this.image.split(',')[1], "base64");
    uploadTask.on("state_changed", (taskSnapshot) => {
      console.log(taskSnapshot)
    }, (error) => {
      console.log(error)
    }, () =>{
      console.log("upload completo");
      uploadTask.snapshot.ref.getDownloadURL().then((url)=>{
        console.log(url)
      })
    })
  }

}