import {Component, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {AddStandardComponent} from '../../dialogs/add-standard/add-standard.component';
import {AppService} from '../../services/app.service';
import {ISubject, ISubType, StandardList} from '../../models/interfaces';

@Component({
  selector: 'app-standard',
  templateUrl: './standard.component.html',
  styleUrls: ['./standard.component.css']
})
export class StandardComponent implements OnInit {

  @Input() Standard: StandardList = {
    id: 0,
    number: 1,
    specialty: '',
    degreeOfStudying: '',
    profession: '',
    timeOfStudying: 0,
    typeOfStudying: '',
    dateOfAcceptance: new Date
  };
  @Output() cmpName = "Стандарт";

  subjects: ISubject[];
  subjectTypes: ISubType[];
  isDataAvailable = false;

  standard = {
    idStandard: 1,
    subjects: this.subjects,
    subjectTypes: this.subjectTypes
  };

  constructor(public dialog: MatDialog,
              private appService: AppService) { }

  ngOnInit() {
    this.appService.subjects.forEach(item => {
      this.subjects.push(item);
    });

    this.appService.subjectTypes.forEach(item => {
      this.subjectTypes.push(item);
    });

    // this.subjects = this.appService.subjects;
    // this.subjectTypes = this.appService.subjectTypes;
    // this.isDataAvailable = true;
  }

  sum(id, prop) {
    let sum = 0;
    const subjects = this.standard.subjects;

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
    const allSubjects = this.standard.subjects;
    allSubjects.forEach((item) => {
      if (item.idType === id) {
        subjects.push(item);
      }
    });

    return subjects;
  }

  addS() {
    this.subjects.push({
      name: '',
      idType: 1,
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
    });
  }

  sumTerms(id, term) {
    let sum = 0;
    const subjects = this.standard.subjects;

    subjects.forEach((item) => {
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
      if (result !== undefined) {
        console.log(result);
      }
    });
  }

  deleteSubject(id: number, type: number) {
    const obj = this.getSubjectsById(type)[id];
    const i = this.subjects.indexOf(obj);
    this.subjects.splice(i, 1);
  }
}
