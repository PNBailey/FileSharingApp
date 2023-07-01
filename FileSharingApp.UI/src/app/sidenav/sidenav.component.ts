import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    RouterOutlet
  ],
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent {
  
  @ViewChild('drawer') drawer: MatSidenav;

  toggleDrawer() {
    this.drawer.toggle();
  }
}
