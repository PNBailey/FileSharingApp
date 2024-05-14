import { NgModule } from '@angular/core';
import { RouterModule, Routes, mapToCanActivate } from '@angular/router';
import { UnAuthGuard } from './shared/guards/unauth-guard';
import { AuthGuard } from './shared/guards/auth-guard';

const routes: Routes = [
    { path: '', canActivate: mapToCanActivate([AuthGuard]), loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent) },
    { path: '*', canActivate: mapToCanActivate([AuthGuard]), loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent) },
    { path: 'home', canActivate: mapToCanActivate([AuthGuard]), loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent) },
    { path: 'edit-profile', canActivate: mapToCanActivate([UnAuthGuard]), loadComponent: () => import('./edit-profile/edit-profile.component').then(mod => mod.EditProfileComponent) },
    { path: 'files', canActivate: mapToCanActivate([UnAuthGuard]), loadComponent: () => import('./files/files.component').then(mod => mod.FilesComponent) },
    { path: 'folder/:folderId', canActivate: mapToCanActivate([UnAuthGuard]), loadComponent: () => import('./files/files.component').then(mod => mod.FilesComponent) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
