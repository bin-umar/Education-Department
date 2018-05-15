import { Component, ElementRef, Input, OnInit, ViewChild, HostListener} from '@angular/core';
import { MatDialog } from '@angular/material';

import { AddExtractionSubjectComponent } from '../../dialogs/add-extraction-subject/add-extraction-subject.component';
import { DeleteDialogComponent } from '../../dialogs/delete/delete.dialog.component';

import { ExtractionService } from '../../services/extraction.service';
import { CurriculumList, ExtractionSubject } from '../../models/curriculum';

@Component({
  selector: 'app-extraction',
  templateUrl: './extraction.component.html',
  styleUrls: ['../standard/standard.component.css'],
  providers: [ ExtractionService ]
})

export class ExtractionComponent implements OnInit {

  @Input() Curriculum: CurriculumList;
  @ViewChild('header') header: ElementRef;

  subjects: ExtractionSubject[] = [];
  fixed = false;

  // @HostListener('window:scroll', ['$event'])
  //   onWindowScroll($event) {
  //     const number = $event.target.documentElement.scrollTop;
  //
  //     if (number > 600) {
  //       this.fixed = true;
  //     } else {
  //       this.fixed = false;
  //     }
  //
  //   }

  constructor(private extractionService: ExtractionService,
              private dialog: MatDialog) { }

  ngOnInit() {
    this.extractionService.getSubjectsByExtractionId(this.Curriculum.id).subscribe(resp => {
      if (!resp.error) {
        resp.data.forEach(item => {

          // if (item.terms.length >= 2) {
          //   console.log(item);
          // }

          this.subjects.push({
            id: +item.id,
            name: item.name,
            idStSubject: +item.idStSubject,
            credits: +item.credits,
            terms: item.terms,
            auditCredits: +item.auditCredits,
            course: +item.course,
            lessonHours: +item.lessonHours,
            exam: item.exam,
            kmd: item.kmd,
            courseProject: +item.courseProject,
            courseWork: +item.courseWork,
            lkPlan: +item.lkPlan,
            lkTotal: +item.lkTotal,
            lbPlan: +item.lbPlan,
            lbTotal: +item.lbTotal,
            prPlan: +item.prPlan,
            prTotal: +item.prTotal,
            smPlan: +item.smPlan,
            smTotal: +item.smTotal,
            trainingPrac: +item.trainingPrac,
            manuPrac: +item.manuPrac,
            diplomPrac: +item.diplomPrac,
            bachelorWork: +item.bachelorWork,
            gosExam: +item.gosExam,
            total: this.total(item),
            kfName: item.kfName,
            selective: +item.selective
          });
        });
      }
    });
  }

  getSubjectsByTerm(semester: number) {
    return this.subjects.filter(item => +item.exam - (item.course - 1) * 2 === semester);
  }

  deleteSubject(subject: ExtractionSubject) {
    if (subject.selective === 1) {
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
        case 'lkPlan': sum += item.lkPlan; break;
        case 'lkTotal': sum += item.lkTotal; break;
        case 'lbPlan': sum += item.lbPlan; break;
        case 'lbTotal': sum += item.lbTotal; break;
        case 'prPlan': sum += item.prPlan; break;
        case 'prTotal': sum += item.prTotal; break;
        case 'smPlan': sum += item.smPlan; break;
        case 'smTotal': sum += item.smTotal; break;
        case 'total': sum += item.total; break;
      }
    });

    return sum;
  }

  total(subject: ExtractionSubject) {
    const result =  +subject.lkTotal + +subject.lkPlan + +subject.smTotal +
      +subject.smPlan + +subject.lbPlan + +subject.lbTotal +
      +subject.prTotal + +subject.prTotal + +subject.trainingPrac +
      +subject.manuPrac + +subject.diplomPrac + +subject.bachelorWork +
      +subject.gosExam;

    subject.total = result;
    return result;
  }

  editSubject(subject: ExtractionSubject) {
      const dialogRef = this.dialog.open(AddExtractionSubjectComponent, {
        width: '645px',
        data: {
          data: subject,
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
