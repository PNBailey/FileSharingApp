import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MountConfig } from "cypress/angular";
import { AccountDialogComponent } from "src/app/account/account-dialog.component";
import { ToolbarComponent } from "src/app/toolbar/toolbar.component";
import { AngularMaterialModule } from "../../angular-material.module";

export function setupCypressConfig<Type>(overrideConfigOptions: MountConfig<Type> = {}): MountConfig<Type> {
    const config = { 
        autoSpyOutputs: true,
        imports: [
            MatDialogModule,
            MatMenuModule,
            MatToolbarModule,
            MatButtonModule,
            BrowserAnimationsModule,
            MatIconModule,
            HttpClientTestingModule, 
            ReactiveFormsModule,
            AngularMaterialModule,
            BrowserAnimationsModule
        ],
        declarations: [ToolbarComponent, AccountDialogComponent],
        ...overrideConfigOptions
    }
    return config;
}