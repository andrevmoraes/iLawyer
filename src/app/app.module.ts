import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import firebase from 'firebase';

var firebaseConfig = {
  apiKey: "AIzaSyB1k3c241zVsprcMtS268isi9R4Shypduo",
  authDomain: "ilawyer-db.firebaseapp.com",
  databaseURL: "https://ilawyer-db-default-rtdb.firebaseio.com",
  projectId: "ilawyer-db",
  storageBucket: "ilawyer-db.appspot.com",
  messagingSenderId: "368700504226",
  appId: "1:368700504226:web:9ca3e93436df7579e3fffb",
  measurementId: "G-STG6BDLSE4"
};

firebase.initializeApp(firebaseConfig);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
