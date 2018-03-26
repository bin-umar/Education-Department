import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ISubject, ISubType, StandardList } from '../../models/interfaces';
import { MainService } from '../../services/main.service';
import { AddStandardComponent } from '../../dialogs/add-standard/add-standard.component';
import { StSubjectsService } from '../../services/st-subjects.service';

@Component({
  selector: 'app-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.css']
})
export class StandardComponent implements OnInit {

  @Input() Standard: StandardList;
  @Output() cmpName = "Стандарт";

  subjects: ISubject[] = [];
  subjectTypes: ISubType[] = [];
  isDataAvailable = true;
  credits: number[];
  terms: number[];

  constructor(public dialog: MatDialog,
              private mainService: MainService,
              private stSubjectService: StSubjectsService
              ) { }

  ngOnInit() {
    this.subjectTypes = this.mainService.subjectTypes;
    this.mainService.getSubjectsByStandardId(this.Standard.id).subscribe(response => {

      response.data.forEach( item => {

        this.credits = [];
        this.terms = [];

        const credits = item.cCredits.split(",");
        const terms = item.cTerms.split(",");

        credits.forEach( (el, i) => {
          this.credits.push(+el);
          this.terms.push(+terms[i]);
        });

        this.subjects.push({
          id: item.id,
          idStandard: item.idStandard,
          name: item.name,
          idType: item.idType,
          credits: +item.credits,
          typeOfMonitoring: {
            exam: item.tExam,
            goUpIWS: item.goUpIWS
          },
          toTeacher: {
            total: +item.tTotal,
            including: {
              audit: +item.tAudit,
              kmro: +item.tKmro
            }
          },
          IWS: +item.IWS,
          creditDividing: {
            terms: this.terms,
            credits: this.credits
          },
          showConfigIcons: false
        });
      });
    });
  }

  sum(id, prop) {
    let sum = 0;
    const subjects = this.subjects;

    subjects.forEach((item) => {
      if (item.idType === id) {
        if (prop === 'credits') { sum += item.credits; }
        if (prop === 'total') { sum += item.toTeacher.total; }
        if (prop === 'audit') { sum += item.toTeacher.including.audit; }
        if (prop === 'kmro') { sum += item.toTeacher.including.kmro; }
        if (prop === 'iws') { sum += item.IWS; }
      }
    });

    return sum;
  }

  romanize (num) {
    if (!+num) { return false; }
    const	digits = String(+num).split(""),
      key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
        "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
        "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

    let roman = "", i = 3;

    while (i--) {
      roman = (key[+digits.pop() + (i * 10)] || "") + roman;
    }

    return Array(+digits.join("") + 1).join("M") + roman;
  }

  getSubjectsById(id: number) {
    const subjects = [];
    this.subjects.forEach((item) => {
      if (item.idType === id) {
        subjects.push(item);
      }
    });

    return subjects;
  }

  sumTerms(id, term) {
    let sum = 0;

   this.subjects.forEach((item) => {
      if (item.idType === id) {
        item.creditDividing.terms.forEach((el, j) => {
          if (el === term) {
            sum += item.creditDividing.credits[j];
          }
        });
      }
    });

    return sum;
  }

  editSubject(id: number, type: number) {
    const dialogRef = this.dialog.open(AddStandardComponent, {
      width: '600px',
      data: this.getSubjectsById(type)[id]
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  addSubject(typeId: number): void {
    const dialogRef = this.dialog.open(AddStandardComponent, {
      width: '600px',
      data: {
        id: null,
        idStandard: this.Standard.id,
        name: '',
        idType: typeId,
        credits: null,
        typeOfMonitoring: {
          exam: '',
          goUpIWS: ''
        },
        toTeacher: {
          total: null,
          including: {
            audit: null,
            kmro: null
          }
        },
        IWS: null,
        creditDividing: {
          terms: [],
          credits: []
        },
        showConfigIcons: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
         this.subjects.push(this.stSubjectService.getDialogData());
      }
    });
  }

  deleteSubject(id: number, type: number) {
    const obj = this.getSubjectsById(type)[id];
    const i = this.subjects.indexOf(obj);
    this.subjects.splice(i, 1);
  }
}
