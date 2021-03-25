import { Component, OnInit, ViewChild } from '@angular/core';
import firebase from 'firebase';
import * as moment from 'moment';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  text: string = ""
  posts: any[] = [];
  pageSize: number = 10;
  cursor: any;
;
  constructor() {
    this.getPosts();
  }

  ngOnInit() {
  }

  getPosts(){



    this.posts=[]
    firebase.firestore().collection("posts").orderBy("created", "desc").limit(this.pageSize).get()
    .then((docs) => {
      docs.forEach((doc) => {
        this.posts.push(doc);
      })
      console.log(this.posts)
      this.cursor = this.posts[this.posts.length - 1];

    }).catch((err) => {
      console.log(err)
    })
  }




  loadMorePosts(event: { enable: (arg0: boolean) => void; target: { complete: () => void; }; }){
    this.posts=[]
    firebase.firestore().collection("posts").orderBy("created", "desc").startAfter(this.cursor).limit(this.pageSize).get()
    .then((docs) => {

      docs.forEach((doc) => {
        this.posts.push(doc);
      })

      console.log(this.posts)

      if(docs.size < this.pageSize){
        // all documents have been loaded
        //event.target.enable = false;
      } else {
        event.target.complete();
        this.cursor = this.posts[this.posts.length - 1];
      }

    }).catch((err) => {
      console.log(err)
    })

  }


  

  post(){
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

  ago(time){
    let difference = moment(time.toDate()).diff(moment());
    return moment.duration(difference).locale("pt").humanize();
  }

}
