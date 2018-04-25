import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ExtractionSubject } from '../../models/curriculum';
import { ExtractionService } from '../../services/extraction.service';

@Component({
  selector: 'app-add-extraction-subject',
  templateUrl: './add-extraction-subject.component.html',
  styleUrls: ['../add-standard/add-standard.component.css'],
  providers: [ ExtractionService ]
})

export class AddExtractionSubjectComponent implements OnInit {

  add = true;
  data: ExtractionSubject;

  constructor(public dialogRef: MatDialogRef<AddExtractionSubjectComponent>,
              @Inject(MAT_DIALOG_DATA) public input: any,
              private extractionService: ExtractionService) {
  }

  ngOnInit() {
    this.data = this.input.data;
    this.add = this.input.add;
  }

  confirmSavingSubject() {
    this.extractionService.updateSubject(this.data).subscribe( resp => {
      if (!resp.error) {
        this.dialogRef.close(this.data);
      } else {
        console.error("Error happened while updating subject");
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
