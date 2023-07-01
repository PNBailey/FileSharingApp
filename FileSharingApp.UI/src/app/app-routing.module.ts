import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '*', loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent) },
  { path: 'home', loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent) },
  { path: 'edit-profile', loadComponent: () => import('./edit-profile/edit-profile.component').then(mod => mod.EditProfileComponent) },
  { path: 'my-files', loadComponent: () => import('./my-files/my-files.component').then(mod => mod.MyFilesComponent) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
