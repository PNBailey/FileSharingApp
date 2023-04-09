import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '*', loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent)},
  {path: 'home', loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent)},
  {path: 'edit-profile', loadComponent: () => import('./edit-profile/edit-profile.component').then(mod => mod.EditProfileComponent)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
