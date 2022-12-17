import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarItem } from '../models/snackbar-item';

@Injectable({
  providedIn: 'root'
})

export class MessageHandlingService {

  constructor(private snackbar: MatSnackBar) { }

  displayMessage(snackBarItem: SnackBarItem) {    
    this.snackbar.open(snackBarItem.message, snackBarItem.action, {
      panelClass: [snackBarItem.classType],
      duration: snackBarItem.duration,
      horizontalPosition: 'end'
    });
  }
}
