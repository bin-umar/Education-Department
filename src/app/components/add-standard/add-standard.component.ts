import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { ISubject } from "../../shared/interfaces";
import { AppService } from "../../shared/app.service";

@Component({
  selector: 'app-add-standard',
  templateUrl: './add-standard.component.html',
  styleUrls: ['./add-standard.component.css'],
  providers: [ AppService ]
})
export class AddStandardComponent implements OnInit {

  subjectTypes;

  constructor(public dialogRef: MatDialogRef<AddStandardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ISubject,
              private appService: AppService) {
    this.subjectTypes = this.appService.subjectTypes;
  }

  credits: number[] = [];
  terms: number[] = [];
  data2: ISubject = {
    name: '',
    idType: null,
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
  };

  onNoClick(): void {
    this.dialogRef.close();
  }

  addSubject() {
    this.data2 = this.data;
    this.data2.creditDividing.terms = this.terms;
    this.data2.creditDividing.credits = this.credits;
  }

  ngOnInit() {
    this.dialogRef.beforeClose().subscribe(() => {
      this.data2 = this.data;
      this.data2.creditDividing.terms = this.terms;
      this.data2.creditDividing.credits = this.credits;
      return this.data2;
    });
  }

}
