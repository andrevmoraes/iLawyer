import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase';
import * as moment from 'moment';
import { IonInfiniteScroll, MenuController, NavController, ToastController } from '@ionic/angular';

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

  //firebase auth
  name: string;
  email: string;
  photoUrl: string;
  uid: string;
  emailVerified: boolean;


  constructor(private menu: MenuController, public navCtrl: NavController, public toastCtrl: ToastController) {  
    this.getUserInfoObs();
    this.getPosts();
  }

  ngOnInit() {
  }

  getPosts() {

    this.posts = []
    firebase.firestore().collection("posts").orderBy("created", "desc").limit(this.pageSize).get()
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
          //event.target.enable = false;
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
    this.uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
                    // this value to authenticate with your backend server, if
                    // you have one. Use User.getToken() instead.
    
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
    console.log('nao ta fazenddo nada, tem que por pra recarregar e eu nao sei fazer isso')

    setTimeout(() => {
      console.log('Fim do carregamento assíncrono da página');
      event.target.complete();
    }, 2000);
  }




update(){
  
  //var user = firebase.auth().currentUser;
  //
  //user.updateProfile({
  //  displayName: "André Moraes",
  //  photoURL: "https://firebasestorage.googleapis.com/v0/b/ilawyer-db.appspot.com/o/foto%20de%20perfil.jpg?alt=media&token=9b115b61-7f9c-4bf7-b6c4-948d872c9450"
  //}).then(function() {
  //  console.log("Update successful");
  //}).catch(function(error) {
    console.log("An error happened");
  //});
}












}