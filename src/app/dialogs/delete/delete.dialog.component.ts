import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-delete.dialog',
  templateUrl: '../../dialogs/delete/delete.dialog.html',
  styleUrls: ['../../dialogs/delete/delete.dialog.css']
})
export class DeleteDialogComponent implements OnInit {

  data: any;
  type: any;

  constructor(public dialogRef: MatDialogRef<DeleteDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public input: any) {
  }

  ngOnInit() {
    this.data = this.input.data;
    this.type = this.input.type;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
