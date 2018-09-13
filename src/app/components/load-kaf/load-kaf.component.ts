import { Component, Input, OnChanges } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { LoadKafService } from '../../services/load-kaf.service';

import { TypesOfStudying } from '../../models/common';
import { Department, DepartmentInfo } from '../../models/faculty';
import { ILoadKafSubject } from '../../models/load-kaf';
import { LoadReportService } from '../../services/load-report.service';

@Component({
  selector: 'app-load-kaf',
  templateUrl: './load-kaf.component.html',
  styleUrls: ['./load-kaf.component.css'],
  providers: [ LoadKafService ]
})

export class LoadKafComponent implements OnChanges {

  @Input() depInfo: DepartmentInfo;
  @Input() subjects: ILoadKafSubject[] = [];

  kafedra: Department = {
    id: null,
    shortName: '',
    fullName: '',
    chief: ''
  };

  faculty = this.kafedra;
  isError = false;

  constructor(private auth: AuthService,
              private lkService: LoadKafService,
              private ldReport: LoadReportService) {
  }

  ngOnChanges() {
    this.kafedra = LoadReportService.getKafedraInfo(this.depInfo);
    this.faculty = LoadReportService.getFacultyInfo(this.depInfo);

    // this.lkService.getLoadKafReport(this.kafedra.id).subscribe(resp => {
    //   if (!resp.error) {
    //
    //     const subjects: LoadKaf[] = resp.data.slice();
    //
    //     subjects.forEach(subject => {
    //       subject.newId = subject.idExSubject + subject.group;
    //       subject.degree = this.auth.DEGREES[+subject.degree];
    //     });
    //
    //     const loadKafReport = new LoadKafReport(subjects, this.lkService.stService.coefs);
    //     this.subjects = loadKafReport.getSubjects();
    //     this.isError = loadKafReport.isErrorSubject();
    //   }
    // });

  }

  rowAmount(amount: number): number[] {
    return Array.from(Array(amount).keys());
  }

  getSubjects(term: number, typeS: number, fcId: number): ILoadKafSubject[] {
    return this.ldReport.GetSubjects(this.subjects, term, typeS, fcId);
  }

  getTypesByTerm(term: number): TypesOfStudying[] {
    return this.ldReport.GetTypesByTerm(this.subjects, term);
  }

  getFacultiesByType(typeS: number, term: number): Department[] {
    return this.ldReport.GetFacultiesByType(this.subjects, typeS, term);
  }

  sum(prop: string, term?: number, typeS?: number) {
    return this.ldReport.Sum(this.subjects, prop, term, typeS);
  }

  print() { window.print(); }
}
