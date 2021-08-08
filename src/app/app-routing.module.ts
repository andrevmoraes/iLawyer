import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: '',
    redirectTo: 'ilawyer',
    pathMatch: 'full'
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'feed',
    loadChildren: () => import('./feed/feed.module').then( m => m.FeedPageModule)
  },
  {
    path: 'ilawyer',
    loadChildren: () => import('./ilawyer/ilawyer.module').then( m => m.IlawyerPageModule)
  },  {
    path: 'agenda',
    loadChildren: () => import('./agenda/agenda.module').then( m => m.AgendaPageModule)
  },
  {
    path: 'marcar-horario',
    loadChildren: () => import('./marcar-horario/marcar-horario.module').then( m => m.MarcarHorarioPageModule)
  },
  {
    path: 'userinfo',
    loadChildren: () => import('./userinfo/userinfo.module').then( m => m.UserinfoPageModule)
  },
  {
    path: 'nosso-time',
    loadChildren: () => import('./nosso-time/nosso-time.module').then( m => m.NossoTimePageModule)
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
