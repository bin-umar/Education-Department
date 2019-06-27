import { Component, Input, OnChanges } from '@angular/core';

import { LoadKafService } from '../../services/load-kaf.service';
import { AuthService} from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';
import { LoadReportService } from '../../services/load-report.service';

import { Teacher } from '../../models/load';
import { ILoadKafSubject, LoadKaf, LoadKafReport } from '../../models/load-kaf';
import { TypesOfStudying } from '../../models/common';
import { Department, DepartmentInfo } from '../../models/faculty';

@Component({
  selector: 'app-teacher-load',
  templateUrl: './teacher-load.component.html',
  styleUrls: ['../standard/standard.component.css'],
  providers: [ LoadKafService ]
})

export class TeacherLoadComponent implements OnChanges {

  @Input() depInfo: DepartmentInfo;

  allKafedra = false;

  kafedra: Department = {
    id: null,
    shortName: '',
    fullName: '',
    chief: ''
  };

  faculty = this.kafedra;
  teachers: Teacher[] = [];
  selectedTeacher: Teacher = {
    id: 0,
    fio: '',
    position: '',
    scienceDegree: '',
    v1: null,
    v2: null,
    v3: null
  };

  teacherLoad = {
    total: null,
    workRate: null,
    kmro: null
  };

  subjects: ILoadKafSubject[] = [];

  constructor(private lkService: LoadKafService,
              private ldReport: LoadReportService,
              private stService: SettingsService,
              private auth: AuthService) {
  }

  ngOnChanges() {
    this.kafedra = LoadReportService.getKafedraInfo(this.depInfo);
    this.faculty = LoadReportService.getFacultyInfo(this.depInfo);

    if (this.kafedra.id !== undefined && this.kafedra.id !== 0) {
      this.stService.getTeachersByKf(this.kafedra.id).subscribe(resp => {
        if (!resp.error) {
          this.teachers = resp.data.slice();
        }
      });
    }
  }

  selectTeacher() {

    if (this.selectedTeacher.id !== 0) {

      this.subjects = [];
      let kf_id = 0;
      if (!this.allKafedra) { kf_id = this.kafedra.id; }

      this.lkService.getTeacherReport(this.selectedTeacher.id, kf_id).subscribe(resp => {
        if (!resp.error) {

          this.lkService.getTeacherCourseWorks(this.selectedTeacher.id, kf_id).subscribe(response => {
            if (!response.error) {

              const subjects: LoadKaf[] = [...resp.data, ...response.data];

              subjects.forEach(subject => {
                subject.newId = subject.idExSubject + subject.group;
                subject.degree = this.auth.DEGREES[+subject.degree];
              });

              const teacherLoad = new LoadKafReport(subjects, this.stService.coefs);
              this.subjects = teacherLoad.getSubjects();
              this.countTeacherLoad();
            }
          });
        }
      });
    }
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

  countTeacherLoad() {
    const teacher = this.selectedTeacher;
    const total = this.sum('total');
    let v = 0;

    if (total !== 0) {

      const scienceDegree = teacher.scienceDegree
                                  .split( ' ')
                                  .filter(o => o !== '')
                                  .join('').toLowerCase();

      switch (scienceDegree) {
        case 'надорад': v = +teacher.v1; break;
        case 'номзадиилм': v = +teacher.v2; break;
        case 'докториилм': v = +teacher.v3; break;
        case 'узвивобастаиаиҷт': v = 432; break;
        case 'академикиаиҷт': v = 360; break;
      }

      this.teacherLoad.workRate = +(total / v).toFixed(2);
      this.teacherLoad.total = total;
      this.teacherLoad.kmro = +((total * 240) / v).toFixed(2);

    } else {
      this.teacherLoad.workRate = null;
      this.teacherLoad.total = null;
      this.teacherLoad.kmro = null;
    }
  }

  print(): void {
    window.print();
  }

}
