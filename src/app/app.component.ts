import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  public appPages = [
    { title: 'Home Page', url: '/folder/home', icon: 'home' },  
    { title: 'Horários Agendados', url: '/folder/Outbox', icon: 'calendar' },
    { title: 'Buscar advogado', url: '/areas', icon: 'people' },
    { title: 'Perfil', url: '/folder/home', icon: 'person-circle' },
    // { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];

  constructor() {}
}
