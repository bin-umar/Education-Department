import { Component, Input, OnInit } from '@angular/core';
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

  subjects: ExtractionSubject[] = [];

  constructor(private extractionService: ExtractionService) { }

  ngOnInit() {
    this.extractionService.getSubjectsByExtractionId(this.Curriculum.id).subscribe(resp => {
      if (!resp.error) {
        resp.data.forEach(item => {
          this.subjects.push({
            id: +item.id,
            name: item.name,
            idStSubject: +item.idStSubject,
            credits: +item.credits,
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
            total: +item.total,
            idKafedra: +item.idKafedra,
            selective: +item.selective
          });
        });
      }
    });
  }

  getSubjectsByTerm(semester: number) {
    return this.subjects.filter(item => +item.exam - (item.course - 1) * 2 === semester);
  }

}
