import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { MountConfig } from "cypress/angular";
import { AccountDialogComponent } from "src/app/account/account-dialog.component";
import { AppComponent } from "src/app/app.component";
import { HomeComponent } from "src/app/home/home.component";
import { ToolbarComponent } from "src/app/toolbar/toolbar.component";
import { AngularMaterialModule } from "../../angular-material.module";

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
            AngularMaterialModule,
            BrowserAnimationsModule,
            RouterTestingModule,
            MatSidenavModule
        ],
        declarations: [AppComponent, ToolbarComponent, AccountDialogComponent, HomeComponent],
        ...overrideConfigOptions
    }
    return config;
}