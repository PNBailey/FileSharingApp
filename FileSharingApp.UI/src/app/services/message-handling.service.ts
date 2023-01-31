import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, tap } from 'rxjs';
import { SnackBarItem } from '../models/snackbar-item';

@Injectable({
  providedIn: 'root'
})

export class MessageHandlingService {

  constructor(private snackbar: MatSnackBar) { }

  private displayNewMessage = new Subject<SnackBarItem>();

  newMessageReceived$ = this.displayNewMessage.pipe(
    tap(snackBarItem => this.displayMessage(snackBarItem))
  ).subscribe();

  onDisplayNewMessage(snackBarItem: SnackBarItem) {
    this.displayNewMessage.next(snackBarItem);
  }

  displayMessage(snackBarItem: SnackBarItem) {    
    this.snackbar.open(snackBarItem.message, snackBarItem.action, {
      panelClass: [snackBarItem.classType],
      duration: snackBarItem.duration,
      horizontalPosition: 'end'
    });
  }
}
