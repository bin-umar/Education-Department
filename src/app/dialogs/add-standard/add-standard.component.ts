import { OnInit, Inject, ViewChild, Component, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

import { MainService } from '../../services/main.service';
import { StSubjectsService } from '../../services/st-subjects.service';
import { ISubject, ISubjectList } from '../../models/standards';

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
  data: ISubject;
  checked = false;

  credits = '';
  terms = '';

  constructor(public dialogRef: MatDialogRef<AddStandardComponent>,
              @Inject(MAT_DIALOG_DATA) public input: any,
              private mainService: MainService,
              private stSubjectService: StSubjectsService) {
    this.subjectTypes = this.mainService.subjectTypes;
  }

  ngOnInit() {

    this.options = this.mainService.subjects;

    this.data = this.input.data;
    this.add = this.input.add;

    this.credits = this.data.creditDividing.credits.toString();
    this.terms = this.data.creditDividing.terms.toString();
    this.checked = (this.data.selective === 1);

    this.selectedSubject = this.options.find(x => x.name === this.data.name);

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

  creditInput() {
    console.log(this.data.credits);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmAddSubject(): void {
    const credits = this.credits.split(',');
    const terms = this.terms.split(',');

    if (credits.length === terms.length && credits.length > 0) {
      for (let i = 0; i < credits.length; i++) {
        this.data.creditDividing.credits.push(+credits[i]);
        this.data.creditDividing.terms.push(+terms[i]);
      }

      this.data.name = this.selectedSubject.id.toString();

      if (this.checked) { this.data.selective = 1;
      } else { this.data.selective = 0; }

      this.stSubjectService.addSubject(this.data).subscribe( resp => {

        this.data.id = resp.data.id;
        this.data.name = this.selectedSubject.name;
        this.dialogRef.close(this.data);
      });

    } else {
      console.error('Terms isn\'t equal to credits. Make them equal');
    }
  }

  confirmSavingSubject() {
    const credits = this.credits.split(',');
    const terms = this.terms.split(',');

    this.data.creditDividing.credits = [];
    this.data.creditDividing.terms = [];

    if (credits.length === terms.length && credits.length > 0) {
      for (let i = 0; i < credits.length; i++) {
        this.data.creditDividing.credits.push(+credits[i]);
        this.data.creditDividing.terms.push(+terms[i]);
      }

      this.data.name = this.selectedSubject.id.toString();

      if (this.checked) { this.data.selective = 1;
      } else { this.data.selective = 0; }

      this.stSubjectService.updateSubject(this.data).subscribe( resp => {
        if (!resp.error) {
          this.data.name = this.selectedSubject.name;
          this.dialogRef.close(this.data);
        } else {
          console.error('Error happened while updating subject');
        }
      });

    } else {
      console.error('Terms isn\'t equal to credits. Make them equal');
    }
  }

}
