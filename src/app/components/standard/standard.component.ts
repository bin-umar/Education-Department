import { Component, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';

import { ISubject, ISubType, StandardList } from '../../models/standards';

import { MainService } from '../../services/main.service';
import { StSubjectsService } from '../../services/st-subjects.service';

import { AddStandardComponent } from '../../dialogs/add-standard/add-standard.component';
import { DeleteDialogComponent } from '../../dialogs/delete/delete.dialog.component';

@Component({
  selector: 'app-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.css']
})
export class StandardComponent implements OnInit {

  @Input() Standard: StandardList;
  @Output() cmpName = 'Стандарт';

  subjects: ISubject[] = [];
  subjectTypes: ISubType[] = [];
  isSubjectsAvailable: boolean;
  credits: number[];
  terms: number[];

  courses: number[] = [];
  _terms: number[] = [];
  columns: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  constructor(public dialog: MatDialog,
              private mainService: MainService,
              private stSubjectService: StSubjectsService
              ) {
  }

  ngOnInit() {
    for (let i = 0; i < this.Standard.timeOfStudying; i++) {
      this.courses.push(i + 1);
    }

    for (let i = 0; i < this.courses.length * 2; i++) {
      this._terms.push(i + 1);
      this.columns.push(this.columns.length + 1);
    }

    this.subjectTypes = this.mainService.subjectTypes;
    this.mainService.getSubjectsByStandardId(this.Standard.id).subscribe(response => {

      response.data.forEach( item => {

        this.credits = [];
        this.terms = [];

        const credits = item.cCredits.split(',');
        const terms = item.cTerms.split(',');

        credits.forEach( (el, i) => {
          this.credits.push(+el);
          this.terms.push(+terms[i]);
        });

        this.subjects.push({
          id: +item.id,
          idStandard: +item.idStandard,
          name: item.name,
          idType: +item.idType,
          selective: +item.selective,
          credits: +item.credits,
          typeOfMonitoring: {
            exam: item.tExam,
            goUpIWS: item.goUpIWS,
            checkoutBntu: item.checkout_b,
            checkoutDiff: item.checkout_diff
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

    this.mainService.getSubjectsList().subscribe( result => {
      this.isSubjectsAvailable = result;
    });
  }

  sum(id, prop) {
    let sum = 0;
    const subjects = this.subjects;

    subjects.forEach((item) => {
      if (item.idType === id  || id === 0) {
        switch (prop) {
          case 'credits': sum += item.credits; break;
          case 'total': sum += item.toTeacher.total; break;
          case 'audit': sum += item.toTeacher.including.audit; break;
          case 'kmro': sum += item.toTeacher.including.kmro; break;
          case 'iws': sum += item.IWS; break;
        }
      }
    });

    return +sum.toFixed(2);
  }

  romanize (num) {
    if (!+num) { return false; }
    const digits = String(+num).split(''),
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
      if (item.idType === id || id === 0) {
        item.creditDividing.terms.forEach((el, j) => {
          if (el === term) {
            sum += item.creditDividing.credits[j];
          }
        });
      }
    });

    return sum;
  }

  editSubject(subject: ISubject, index: number) {
    if (this.isSubjectsAvailable) {
      const dialogRef = this.dialog.open(AddStandardComponent, {
        width: '600px',
        data: {
          data: this.getSubjectsById(subject.idType)[index],
          add: false
        }
      });

      const iSub = this.subjects.findIndex( x => x.id === subject.id);

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.subjects.splice(iSub, 1, result);
        }
      });
    } else {
      console.error('Subjects list haven\'t been loaded yet!');
    }
  }

  addSubject(typeId: number): void {
    if (this.isSubjectsAvailable) {
      const dialogRef = this.dialog.open(AddStandardComponent, {
        width: '610px',
        data: {
          data: {
            id: '0',
            idStandard: this.Standard.id,
            selective: 0,
            name: '',
            idType: typeId,
            credits: 0,
            typeOfMonitoring: {
              exam: '',
              goUpIWS: '',
              checkoutBntu: '',
              checkoutDiff: ''
            },
            toTeacher: {
              total: 0,
              including: {
                audit: 0,
                kmro: 0
              }
            },
            IWS: 0,
            creditDividing: {
              terms: [],
              credits: []
            },
            showConfigIcons: false
          },
          add: true
        }
      });

      dialogRef.afterClosed().subscribe((result: ISubject) => {
        if (result !== undefined) {
          this.subjects.push(result);
        }
      });
    } else {
      console.error("Subjects list haven't been loaded yet!");
    }
  }

  deleteSubject(subject: ISubject, index: number) {
    const obj = this.getSubjectsById(subject.idType)[index];
    const i = this.subjects.indexOf(obj);

    const dialogRef = this.dialog.open( DeleteDialogComponent, {
      width: '500px',
      data: {
        data: {
          name: this.subjects[i].name,
          standard: this.Standard.specialty
        },
        type: 'stSubjects'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.stSubjectService.deleteSubject(subject.id).subscribe((data) => {
          if (!data.error) {
            this.subjects.splice(i, 1);
          } else {
            console.error("Error has been happened while deleting Standard's subject");
          }
        });
      }
    });
  }
}
