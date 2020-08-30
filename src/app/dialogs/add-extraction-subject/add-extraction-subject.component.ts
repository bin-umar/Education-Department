import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { ExtractionSubject } from '../../models/curriculum';
import { Department } from '../../models/faculty';
import { ExtractionService } from '../../services/extraction.service';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-extraction-subject',
  templateUrl: './add-extraction-subject.component.html',
  styleUrls: ['../add-standard/add-standard.component.css'],
  providers: [ ExtractionService ]
})

export class AddExtractionSubjectComponent implements OnInit {

  panelOpenState = false;
  add = true;

  type; degree;
  types = []; degrees = [];
  standardsYear: number;

  error = false;
  errorText = '';

  data: ExtractionSubject;
  kafedras: Department[] = [];
  recommendKaf: Department[] = [];

  constructor(public dialogRef: MatDialogRef<AddExtractionSubjectComponent>,
              @Inject(MAT_DIALOG_DATA) public input: any,
              private extractionService: ExtractionService,
              private authService: AuthService) {

    this.types = this.authService.TYPES;
    this.degrees = this.authService.DEGREES;

    this.kafedras = this.extractionService.kafedras;

  }

  ngOnInit() {

    this.data = this.input.data;
    this.add = this.input.add;
    this.type = this.input.data.type;
    this.degree = this.input.data.degree;
    this.standardsYear = this.input.data.standardsYear;

    if (this.kafedras.length === 0) {
      this.extractionService.getKafedras().subscribe(response => {
        this.kafedras = response;
      });
    }

    this.extractionService.getKafedraBySubjectId(this.data.idStSubject)
      .subscribe(res => {
        if (!res.error) {
          this.recommendKaf = res.data.slice();
        }
      });
  }

  setHourOfCredit(credit: number, destination: string) {

    let creditsHour;
    if (this.standardsYear < 2016) { creditsHour = 16; } else {
      creditsHour = 24;
    }
    const hour = Math.round(credit * creditsHour);

    if (destination === 'lH') {
      this.data.lessonHours = hour;
    } else if (destination === 'kH') {
      this.data.kmroHour = hour;
    }
  }

  total(subject: ExtractionSubject) {
    subject.total = +subject.lkTotal + +subject.lkPlan + +subject.smTotal +
      +subject.smPlan + +subject.lbPlan + +subject.lbTotal +
      +subject.prPlan + +subject.prTotal + +subject.trainingPrac +
      +subject.manuPrac + +subject.kmroHour + +subject.checkout_b + +subject.checkout_diff;
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
