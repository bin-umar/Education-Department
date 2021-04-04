import { OnInit, Inject, ViewChild, Component, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs';
import { startWith ,  map } from 'rxjs/operators';

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

  error = false;
  errorText = '';

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

    this.selectedSubject = this.options.find(x => x.name.includes(this.data.name));

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

  showError(text: string) {
    this.error = true;
    this.errorText = text;
    setTimeout(() => {
      this.error = false;
    }, 3000);
  }

  checkValidation () {
    const subject = this.data;

    const credits = this.credits.split(',');
    const terms = this.terms.split(',');

    let creditSum = 0;

    if (this.credits === '') {
      this.showError('Кредитҳо холӣ ҳастанд!!!');
    } else if (this.terms === '') {
      this.showError('Семестрҳо холӣ ҳастанд!!!');
    } else {
      if (credits.length === terms.length) {
        const {
          typeOfMonitoring: {
            goUpIWS,
            exam,
            checkoutBntu,
            checkoutDiff
          }
        } = this.data;

        const controlFormTermsArray = [exam, goUpIWS, checkoutBntu, checkoutDiff]
            .filter(Boolean)
            .join(',')
            .split(',');

        // @ts-ignore
        const controlFormTerms = Array.from(new Set(controlFormTermsArray)).sort().join(',');

        if (controlFormTerms !== this.terms) {
          this.showError('Семестрҳо ба семестрҳои шакли назорат баробар нестанд!!!');
          return;
        }

        terms.forEach((el, i) => {
          creditSum += +credits[i];
        });

        if (creditSum !== subject.credits ) {
          this.showError('Суммаи кредитҳои семестрҳо ба кредитҳои умумӣ баробар нест!!!');
        } else {
          subject.creditDividing.credits = [];
          subject.creditDividing.terms = [];
          for (let i = 0; i < credits.length; i++) {
            subject.creditDividing.credits.push(+credits[i]);
            subject.creditDividing.terms.push(+terms[i]);
          }

          if (this.selectedSubject === undefined) {
            this.showError('Фаннро интихоб намоед!!!');
          } else {
            return true;
          }
        }
      } else {
        this.showError('Кредитҳо ба семестрҳо баробар нестанд!!!');
      }
    }
  }

  confirmAddSubject(): void {
    if (!this.checkValidation()) {
      return;
    }

    const subject = this.data;
    subject.name = this.selectedSubject.id.toString();
    subject.selective = +this.checked;

    this.stSubjectService.addSubject(subject).subscribe( resp => {
      subject.id = resp.data.id;
      subject.name = this.selectedSubject.name;
      this.dialogRef.close(subject);
    });
  }

  confirmSavingSubject() {
    if (this.checkValidation()) {
      const subject = this.data;

      this.data.name = this.selectedSubject.id.toString();
      if (this.checked) { this.data.selective = 1;
      } else { this.data.selective = 0; }

      this.stSubjectService.updateSubject(subject).subscribe( resp => {
        if (!resp.error) {
          subject.name = this.selectedSubject.name;
          this.dialogRef.close(subject);
        } else {
          console.error('Error happened while updating subject');
        }
      });
    }
  }
}
