import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ExtractionSubject, Kafedra } from '../../models/curriculum';
import { ExtractionService } from '../../services/extraction.service';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-add-extraction-subject',
  templateUrl: './add-extraction-subject.component.html',
  styleUrls: ['../add-standard/add-standard.component.css'],
  providers: [ ExtractionService ]
})

export class AddExtractionSubjectComponent implements OnInit {

  panelOpenState = false;
  add = true;
  type;
  types = [];
  error = false;
  errorText = '';

  data: ExtractionSubject;
  kafedras: Kafedra[] = [];
  recommendKaf: Kafedra[] = [];

  constructor(public dialogRef: MatDialogRef<AddExtractionSubjectComponent>,
              @Inject(MAT_DIALOG_DATA) public input: any,
              private extractionService: ExtractionService,
              private authService: AuthService) {
    this.types = this.authService.TYPES;
  }

  ngOnInit() {
    this.data = this.input.data;
    this.add = this.input.add;
    this.type = this.input.data.type;

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

  setHourOfCredit(credit: number, destination: string) {
    if (destination === 'lH') {
      this.data.lessonHours = Math.round(credit * 24);
    } else if (destination === 'kH') {
      this.data.kmroHour = Math.round(credit * 24);
    }
  }

  total(subject: ExtractionSubject) {
    subject.total = +subject.lkTotal + +subject.lkPlan + +subject.smTotal +
      +subject.smPlan + +subject.lbPlan + +subject.lbTotal +
      +subject.prPlan + +subject.prTotal + +subject.trainingPrac +
      +subject.manuPrac + +subject.diplomPrac + +subject.bachelorWork +
      +subject.gosExam + +subject.advice;
  }

  showError(text: string) {
    this.error = true;
    this.errorText = text;
    setTimeout(() => {
      this.error = false;
    }, 3000);
  }

  confirmSavingSubject() {
    this.total(this.data);

    if ((+this.data.lessonHours + +this.data.kmroHour) === +this.data.total) {

      const kafedra = this.kafedras.find(x => x.shortName === this.data.kfName);

      if (!kafedra) {
        this.showError('Интихоби кафедра ҳатмист!');
      } else {
        this.data.kfName = kafedra.id.toString();

        this.extractionService.updateSubject(this.data).subscribe( resp => {
          if (!resp.error) {
            this.data.kfName = kafedra.shortName;
            this.dialogRef.close(this.data);
          } else {
            console.error('Error happened while updating subject');
          }
        });
      }

    } else {
      this.showError('Соатҳои дарсӣ ба суммаи ҳамагӣ баробар нест!');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
