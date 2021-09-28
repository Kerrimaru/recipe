import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DialogService } from '../dialog.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  data: any = this.dialog.dialogData;
  imagePath: string;
  title: string = this.data.title;
  lines: string[] = this.data.lines || [];
  actions: any[] = this.data.actions || [];
  class: string = this.data.class;
  hideClose = false; // true if user selection is required to proceed

  constructor(private dialog: DialogService, public mdDialogRef: MatDialogRef<AlertComponent>) {}

  ngOnInit(): void {
    this.imagePath = this.data.image ? '/assets/images/' + this.data.image : null;
    console.log('img: ', this.imagePath)
    if (typeof this.data.lines === 'string') {
      this.lines = [this.data.lines];
    }

    this.actions.forEach((a, i, arr) => {
      if (this.actions.length === 1 && typeof a === 'string') {
        arr[i] = {
          text: a,
          primary: true,
          go: true,
        };
      } else if (this.actions.length === 2 && typeof a === 'string') {
        arr[i] = {
          text: a,
          primary: i === 1,
          // go: i === 0 ? false : true
          go: i === 0 ? undefined : true,
        };
      }

      const aa = arr[i];
      // aa.go = aa.go || false;

      if (typeof aa.go !== 'function') {
        const result = aa.go;
        aa.go = () => {
          this.dialog.close(result);
        };
      }
    });
  }

  closeDialog() {
    this.dialog.close();
  }
}
