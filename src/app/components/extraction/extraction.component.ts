import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AddExtractionSubjectComponent } from '../../dialogs/add-extraction-subject/add-extraction-subject.component';
import { DeleteDialogComponent } from '../../dialogs/delete/delete.dialog.component';

import { ExtractionService } from '../../services/extraction.service';
import { CurriculumList, ExtractionSubject } from '../../models/curriculum';
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-extraction',
  templateUrl: './extraction.component.html',
  styleUrls: ['../standard/standard.component.css'],
  providers: [ ExtractionService ]
})

export class ExtractionComponent implements OnInit {

  @Input() Curriculum: CurriculumList;
  @Input() idSpec: number;
  @ViewChild('header') header: ElementRef;

  subjects: ExtractionSubject[] = [];
  error = false;
  erSubjects: ExtractionSubject[] = [];
  fixed = false;
  isStupidSpec = false;
  types = [];
  degrees = [];

  constructor(private extractionService: ExtractionService,
              private authService: AuthService,
              private dialog: MatDialog) {
    this.types = this.authService.TYPES;
    this.degrees = this.authService.DEGREES;
  }

  ngOnInit() {
    this.isStupidSpec = ((this.idSpec === 299 && this.Curriculum.course === 4) ||
                          (this.idSpec === 298 && this.Curriculum.course === 4));

    this.extractionService.getSubjectsByExtractionId(this.Curriculum.id).subscribe(resp => {
      if (!resp.error) {
        resp.data.forEach(item => {

          const i = item.terms.split(',').indexOf(item.term.toString());

          if (i === -1) {
            this.error = true;
            this.erSubjects.push(item);
          } else {
            const credits = item.credits.toString().split(',')[i];
            const term = item.terms.toString().split(',')[i];
            let exams, kmds, exam, kmd;

            if (item.exam.length > 1) {
              exams = item.exam.toString().split(',');
            } else if (item.kmd.length > 1) {
              kmds = item.kmd.toString().split(',');
            }

            exam = (exams === undefined ? '' : exams[i] );
            kmd = (kmds === undefined ? '' : kmds[i]);

            this.subjects.push({
              id: +item.id,
              name: item.name,
              idStSubject: +item.idStSubject,
              credits: +credits,
              terms: item.terms,
              term: +term,
              auditCredits: +item.auditCredits,
              course: +item.course,
              lessonHours: +item.lessonHours,
              kmroCredits: +item.kmroCredits,
              kmroHour: +item.kmroHour,
              exam: exam,
              kmd: kmd,
              courseProject: +item.courseProject,
              courseWork: +item.courseWork,
              workKont: +item.workKont,
              lkPlan: +item.lkPlan,
              lkTotal: +item.lkTotal,
              lbPlan: +item.lbPlan,
              lbTotal: +item.lbTotal,
              prPlan: +item.prPlan,
              prTotal: +item.prTotal,
              smPlan: +item.smPlan,
              smTotal: +item.smTotal,
              advice: +item.advice,
              trainingPrac: +item.trainingPrac,
              manuPrac: +item.manuPrac,
              diplomPrac: +item.diplomPrac,
              bachelorWork: +item.bachelorWork,
              gosExam: +item.gosExam,
              total: this.total(item),
              kfName: item.kfName,
              selective: +item.selective
            });
          }
        });
      }
    });
  }

  getSubjectsByTerm(semester: number) {
    return this.subjects.filter(item => +item.term - (item.course - 1) * 2 === semester);
  }

  deleteSubject(subject: ExtractionSubject) {
    if (subject.selective === 1 || this.isStupidSpec) {
      const i = this.subjects.indexOf(subject);

      const dialogRef = this.dialog.open(DeleteDialogComponent, {
          width: '500px',
          data: {
            data: {
              name: this.subjects[i].name,
              curriculum: this.Curriculum.speciality
            },
            type: 'exSubjects'
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          this.extractionService.deleteSubject(subject.id).subscribe((data) => {
            if (!data.error) {
              this.subjects.splice(i, 1);
            } else {
              console.error('Error has been happened while deleting subject');
            }
          });
        }
      });
    }
  }

  sum(prop, term) {
    let sum = 0;
    let subjects;

    if (term !== 3) {
      subjects = this.getSubjectsByTerm(term);
    } else {
      subjects = this.subjects;
    }

    subjects.forEach(item => {
      switch (prop) {
        case 'credits': sum += item.credits; break;
        case 'auditCredits': sum += item.auditCredits; break;
        case 'lessonHours': sum += item.lessonHours; break;
        case 'kmroCredits': sum += item.kmroCredits; break;
        case 'kmroHour': sum += item.kmroHour; break;
        case 'lkPlan': sum += item.lkPlan; break;
        case 'lkTotal': sum += item.lkTotal; break;
        case 'lbPlan': sum += item.lbPlan; break;
        case 'lbTotal': sum += item.lbTotal; break;
        case 'prPlan': sum += item.prPlan; break;
        case 'prTotal': sum += item.prTotal; break;
        case 'smPlan': sum += item.smPlan; break;
        case 'smTotal': sum += item.smTotal; break;
        case 'advice': sum += item.advice; break;
        case 'trainingPrac': sum += item.trainingPrac; break;
        case 'manuPrac': sum += item.manuPrac; break;
        case 'diplomPrac': sum += item.diplomPrac; break;
        case 'bachelorWork': sum += item.bachelorWork; break;
        case 'gosExam': sum += item.gosExam; break;
        case 'total': sum += item.total; break;
      }
    });

    return +sum.toFixed(2);
  }

  total(subject: ExtractionSubject) {
    const result = +subject.lkTotal + +subject.lkPlan + +subject.smTotal +
      +subject.smPlan + +subject.lbPlan + +subject.lbTotal +
      +subject.prPlan + +subject.prTotal + +subject.trainingPrac +
      +subject.manuPrac + +subject.diplomPrac + +subject.bachelorWork +
      +subject.gosExam + +subject.advice;

    subject.total = result;
    return result;
  }

  editSubject(subject: ExtractionSubject) {
      const dialogRef = this.dialog.open(AddExtractionSubjectComponent, {
        width: '645px',
        data: {
          data: {
            id: subject.id,
            name: subject.name,
            idStSubject: subject.idStSubject,
            credits: subject.credits,
            terms: subject.terms,
            term: subject.term,
            auditCredits: subject.auditCredits,
            course: subject.course,
            lessonHours: subject.lessonHours,
            kmroCredits: subject.kmroCredits,
            kmroHour: subject.kmroHour,
            exam: subject.exam,
            kmd: subject.kmd,
            courseProject: subject.courseProject,
            courseWork: subject.courseWork,
            workKont: subject.workKont,
            lkPlan: subject.lkPlan,
            lkTotal: subject.lkTotal,
            lbPlan: subject.lbPlan,
            lbTotal: subject.lbTotal,
            prPlan: subject.prPlan,
            prTotal: subject.prTotal,
            smPlan: subject.smPlan,
            smTotal: subject.smTotal,
            advice: subject.advice,
            trainingPrac: subject.trainingPrac,
            manuPrac: subject.manuPrac,
            diplomPrac: subject.diplomPrac,
            bachelorWork: subject.bachelorWork,
            gosExam: subject.gosExam,
            total: subject.total,
            kfName: subject.kfName,
            selective: subject.selective,
            type: this.Curriculum.type
          },
          add: false
        }
      });

      const iSub = this.subjects.findIndex( x => x.id === subject.id);

      dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.subjects.splice(iSub, 1, result);
        }
      });
  }

}
