import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-subject',
  templateUrl: './delete-subject.component.html',
  styleUrls: ['./delete-subject.component.css']
})
export class DeleteSubjectComponent {

  constructor(public dialogRef: MatDialogRef<DeleteSubjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
