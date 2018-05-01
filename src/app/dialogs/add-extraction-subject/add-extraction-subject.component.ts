import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ExtractionSubject, Kafedra } from '../../models/curriculum';
import { ExtractionService } from '../../services/extraction.service';

@Component({
  selector: 'app-add-extraction-subject',
  templateUrl: './add-extraction-subject.component.html',
  styleUrls: ['../add-standard/add-standard.component.css'],
  providers: [ ExtractionService ]
})

export class AddExtractionSubjectComponent implements OnInit {

  panelOpenState = false;
  add = true;
  error = false;

  data: ExtractionSubject;
  kafedras: Kafedra[] = [];
  recommendKaf: Kafedra[] = [];

  constructor(public dialogRef: MatDialogRef<AddExtractionSubjectComponent>,
              @Inject(MAT_DIALOG_DATA) public input: any,
              private extractionService: ExtractionService) {
  }

  ngOnInit() {
    this.data = this.input.data;
    this.add = this.input.add;

    this.extractionService.getKafedras().subscribe(res => {
      if (!res.error) {
        this.kafedras = res.data.slice();
      }
    });

    this.extractionService.getKafedraBySubjectId(this.data.idStSubject).subscribe(res => {
      if (!res.error) {
        this.recommendKaf = res.data.slice();
      }
    });
  }

  total(subject: ExtractionSubject) {
    subject.total =  +subject.lkTotal + +subject.lkPlan + +subject.smTotal +
      +subject.smPlan + +subject.lbPlan + +subject.lbTotal +
      +subject.prTotal + +subject.prTotal + +subject.trainingPrac +
      +subject.manuPrac + +subject.diplomPrac + +subject.bachelorWork +
      +subject.gosExam;
  }

  confirmSavingSubject() {
    this.total(this.data);

    if (this.data.lessonHours === this.data.total) {

      const kafedra = this.kafedras.find(x => x.shortName === this.data.kfName);
      this.data.kfName = kafedra.id.toString();

      this.extractionService.updateSubject(this.data).subscribe( resp => {
        if (!resp.error) {
          this.data.kfName = kafedra.shortName;
          this.dialogRef.close(this.data);
        } else {
          console.error("Error happened while updating subject");
        }
      });

    } else {
      this.error = true;
      setTimeout(() => {
        this.error = false;
      }, 3000);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
