import { Injectable } from '@angular/core';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AlertComponent } from './alert/alert.component';
import { Observable, of } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  dialogData: any;
  current: MatDialogRef<any>;
  dialogStack: MatDialogRef<any>[] = [];

  constructor(private mdDialog: MatDialog) {}

  show<T>(component: ComponentType<T>, data?: any, config?: any): MatDialogRef<any> {
    this.dialogData = data;
    const dialogRef = this.mdDialog.open(component, config);

    this.current = dialogRef;
    this.dialogStack.push(dialogRef);

    const ob = dialogRef.afterClosed();

    // remove dialog from stack when closed
    ob.subscribe(() => {
      if (this.dialogStack.length === 1) {
        this.dialogStack = [];
        this.current = null;
        this.dialogData = null;
      } else {
        const index = this.dialogStack.indexOf(dialogRef);
        this.dialogStack.splice(index, 1);
        this.current = this.dialogStack[this.dialogStack.length - 1];
      }
    });

    return dialogRef;
  }

  /**
   * Close the current dialog.
   * @param result - need to be truthy to be considered an Observable next trigger
   */
  close(result?: any) {
    this.current.close(result);
    this.dialogData = null;
  }

  alert(data?: { title?: string; lines?: string[] | string; actions?: any[]; class?: string }): Observable<any> {
    const dialog = this.show(AlertComponent, data, {
      disableClose: true,
    });
    return this.observeDialog(dialog);
  }

  observeDialog(dialog: MatDialogRef<any>): Observable<any> {
    return dialog.afterClosed().pipe(
      takeWhile((result) => {
        return result !== undefined;
      })
    );
  }
}
