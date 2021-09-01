import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {
  date: string;
  type: string;

  constructor() { }

  ngOnInit() {
  }

  onChange($event: any) {
    console.log($event);
  }

}
