import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { MountConfig } from "cypress/angular";
import { AccountDialogComponent } from "src/app/account/account-dialog.component";
import { AppComponent } from "src/app/app.component";
import { EditProfileCardComponent } from "src/app/edit-profile/edit-profile-card/edit-profile-card.component";
import { EditProfileInfoComponent } from "src/app/edit-profile/edit-profile-info/edit-profile-info.component";
import { EditProfileComponent } from "src/app/edit-profile/edit-profile.component";
import { HomeComponent } from "src/app/home/home.component";
import { ToolbarComponent } from "src/app/toolbar/toolbar.component";

export function setupCypressConfig<Type>(overrideConfigOptions: MountConfig<Type> = {}): MountConfig<Type> {
    const config = { 
        autoSpyOutputs: true,
        imports: [
            HttpClientTestingModule,
            MatDialogModule,
            MatMenuModule,
            MatToolbarModule,
            MatButtonModule,
            BrowserAnimationsModule,
            MatIconModule,
            ReactiveFormsModule,
            BrowserAnimationsModule,
            RouterTestingModule,
            MatSidenavModule,
            MatCardModule,
            MatSnackBarModule,
            AppComponent,
            ToolbarComponent,
            AccountDialogComponent,
            HomeComponent,
            EditProfileComponent,
            EditProfileCardComponent,
            EditProfileInfoComponent
        ],
        ...overrideConfigOptions
    }
    return config;
}