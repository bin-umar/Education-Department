import {
  Component,
  OnInit,
  Inject,
  ElementRef,
  ViewChild
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

import { MainService } from '../../services/main.service';
import { ISubject, ISubjectList } from '../../models/interfaces';

@Component({
  selector: 'app-add-standard',
  templateUrl: './add-standard.component.html',
  styleUrls: ['./add-standard.component.css']
})
export class AddStandardComponent implements OnInit {

  @ViewChild('filter') filterInput: ElementRef;

  subjectTypes;
  selectedSubject: ISubjectList = {
    id: null,
    name: ''
  };

  options: ISubjectList[] = [];
  filteredOptions: Observable<ISubjectList[]>;

  myControl: FormControl = new FormControl();
  add = true;

  credits: string;
  terms: string;

  constructor(public dialogRef: MatDialogRef<AddStandardComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ISubject,
              private mainService: MainService) {
    this.subjectTypes = this.mainService.subjectTypes;
  }

  ngOnInit() {
    this.mainService.getSubjectsList().subscribe( res => {
      res.data.forEach( item => {
        this.options.push({
          id: item.id,
          name: item.name
        });
      });
    });

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith<string | ISubjectList>(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(val => val ? this.filter(val) : this.options.slice())
      );
  }

  filter(val: string): ISubjectList[] {
    return this.options.filter(option =>
      option.name.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  displayFn(subject?: ISubjectList): string | undefined {
    return subject ? subject.name : undefined;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  addSubject() {
    const credits = this.credits.split(",");
    const terms = this.terms.split(",");

    if (credits.length === terms.length) {
      for (let i = 0; i < credits.length; i++) {
        this.data.creditDividing.credits.push(Number(credits[i]));
        this.data.creditDividing.terms.push(Number(terms[i]));
      }

      this.data.name = this.selectedSubject.name;
    } else {
      console.log("Terms isn't equal to credits. Make them equal");
    }
    // this.data.creditDividing.credits
    // this.data2 = this.data;
    // this.data2.creditDividing.terms = this.terms;
    // this.data2.creditDividing.credits = this.credits;
  }

}
