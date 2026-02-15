import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './components/home/home';
import { MovieList } from './components/movie-list/movie-list';
import { MovieDetail } from './components/movie-detail/movie-detail';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Contact } from './components/contact/contact';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'movies', component: MovieList },
  { path: 'movie/:id', component: MovieDetail },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'contact', component: Contact },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }