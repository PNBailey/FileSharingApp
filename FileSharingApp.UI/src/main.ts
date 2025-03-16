import { ErrorHandler, enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { JwtInterceptor } from './app/shared/interceptors/jwt.interceptor';
import { HTTP_INTERCEPTORS, withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { accountReducer } from './app/state/account/account.reducer';
import { AccountEffects } from './app/state/account/account.effects';
import { FileEffects } from './app/state/file/file.effects';
import { fileReducer } from './app/state/file/file.reducer';
import { FolderEffects } from './app/state/folder/folder.effects';
import { folderReducer } from './app/state/folder/folder.reducer';
import { DatePipe } from '@angular/common';
import { ErrorHandlingService } from './app/services/error-handling.service';
import { Routes, provideRouter } from '@angular/router';
import { HomeComponent } from './app/home/home.component';
import { FilesComponent } from './app/files/files.component';
import { loadingReducer } from './app/state/loading/loading.reducer';
import { EditProfileComponent } from './app/edit-profile/edit-profile.component';
import { ErrorComponent } from './app/error/error.component';
import { UnAuthGuard } from './app/shared/guards/unauth-guard';

if (environment.production) {
    enableProdMode();
}

const routes: Routes = [
    { path: '', component: FilesComponent, canActivate: [UnAuthGuard] },
    { path: 'home', component: HomeComponent },
    { path: 'error', component: ErrorComponent },
    { path: 'edit-profile', component: EditProfileComponent, canActivate: [UnAuthGuard] },
    { path: 'files', component: FilesComponent, canActivate: [UnAuthGuard] },
    { path: 'files/:folderId', component: FilesComponent, canActivate: [UnAuthGuard] },
    { path: '**', component: FilesComponent, canActivate: [UnAuthGuard] }
];

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            FormsModule,
            ReactiveFormsModule,
            MatDialogModule,
            MatSnackBarModule,
            BrowserAnimationsModule
        ),
        { provide: ErrorHandler, useClass: ErrorHandlingService },
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideStore({ account: accountReducer, files: fileReducer, folders: folderReducer, loading: loadingReducer }),
        provideEffects(AccountEffects, FileEffects, FolderEffects),
        DatePipe
    ]
})
    .catch(err => console.error(err));
