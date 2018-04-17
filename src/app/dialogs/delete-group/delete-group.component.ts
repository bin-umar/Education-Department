import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { IGroup } from '../../models/common';

@Component({
  selector: 'app-delete-group',
  templateUrl: './delete-group.component.html',
  styleUrls: ['./delete-group.component.css']
})
export class DeleteGroupComponent {

  constructor(public dialogRef: MatDialogRef<DeleteGroupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: IGroup) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
