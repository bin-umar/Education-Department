import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-extraction-subject',
  templateUrl: './delete-extraction-subject.component.html',
  styleUrls: ['../delete-subject/delete-subject.component.css']
})
export class DeleteExtractionSubjectComponent {

  constructor(public dialogRef: MatDialogRef<DeleteExtractionSubjectComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
