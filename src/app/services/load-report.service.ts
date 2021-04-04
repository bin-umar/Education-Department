import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { SettingsService } from './settings.service';

import { Department, DepartmentInfo } from '../models/faculty';
import { TypesOfStudying } from '../models/common';
import { ILoadKaf, ILoadKafSubject, LoadKaf, LoadKafReport } from '../models/load-kaf';

@Injectable({
  providedIn: 'root'
})

export class LoadReportService {

  subjects: ILoadKafSubject[] = [];
  durations = [{
      id: 1,
      name: 'Нимсолаи 1'
    },
    {
      id: 2,
      name: 'Нимсолаи 2'
    },
    {
      id: 0,
      name: 'Солона'
    }];

  constructor(private auth: AuthService,
              public stService: SettingsService) {
  }

  static getFacultyInfo(depInfo: DepartmentInfo) {
    return {
      id: +depInfo.fcId,
      fullName: depInfo.fcFullName,
      shortName: depInfo.fcShortName,
      chief: depInfo.fcChief
    };
  }

  static getKafedraInfo(depInfo: DepartmentInfo) {
    return {
      id: +depInfo.kfId,
      fullName: depInfo.kfFullName,
      shortName: depInfo.kfShortName,
      chief: depInfo.kfChief,
      chiefPosition: depInfo.kfChiefPosition
    };
  }

  public getLoadReport() {
    const body = new HttpParams()
      .set('whole_university', '')
      .set('route', 'ldReports')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ILoadKaf) => {

          this.subjects = [];
          if (!response.error) {
            const subjects: LoadKaf[] = response.data.slice();

            subjects.forEach(subject => {
              subject.newId = subject.idExSubject + subject.group;
              subject.degree = this.auth.DEGREES[+subject.degree];
            });

            const loadKafReport = new LoadKafReport(subjects, this.stService.coefs);
            this.subjects = loadKafReport.getSubjects();
          }

          return this.subjects;
    }));
  }

  public Sum(subjects: ILoadKafSubject[], prop: string, term?: number, typeS?: number) {
    let sum = 0;
    let _subjects: ILoadKafSubject[];

    if (term) {
      if (typeS) {
        _subjects = subjects.filter(o => +o.type === typeS && +o.term === term);
      } else {
        _subjects = subjects.filter(o => +o.term === term);
      }
    } else {
      _subjects = subjects;
    }

    _subjects.forEach(item => {
      switch (prop) {
        case 'lkTotal': sum += +item.lecture.total; break;
        case 'lbTotal': sum += +item.laboratory.total; break;
        case 'prTotal': sum += +item.practical.total; break;
        case 'smTotal': sum += +item.seminar.total; break;
        case 'kmroTotal': sum += +item.kmro.total; break;
        case 'advice': sum += +item.advice; break;
        case 'prac': sum += +item.practices; break;
        case 'diploma': sum += +item.diploma; break;
        case 'gosExam': sum += +item.gosExam; break;
        case 'total': sum += +item.total; break;
        case 'cw': sum += +item.courseWork; break;
        case 'cp': sum += +item.courseProject; break;
        case 'wk': sum += +item.workKont; break;
        case 'exam': sum += +item.exam; break;
        case 'tAH': sum += +item.totalAuditHour; break;
        case 'checkout': sum += +item.checkout; break;
        case 'checkout_b': sum += +item.checkout_b; break;
        case 'checkout_diff': sum += +item.checkout_diff; break;
      }
    });

    return +sum.toFixed(2);
  }

  public GetSubjects(subjects: ILoadKafSubject[],
                     term: number,
                     typeS: number,
                     fcId: number): ILoadKafSubject[] {
    return subjects.filter(o => (
      o.term === term && +o.type === typeS && +o.fcId === fcId
    ));
  }

  public GetFacultiesByType(subjects: ILoadKafSubject[], typeS: number, term: number): Department[] {
    const faculties: Department[] = [];

    subjects.filter(o => (+o.type === typeS) && (+o.term === term))
      .forEach(o => {
        const i = faculties.findIndex(fc => fc.id === +o.fcId);
        if (i === -1) {
          faculties.push({
            id: +o.fcId,
            shortName: o.fcName,
            fullName: o.fcName,
            chief: ''
          });
        }
      });

    return faculties;
  }

  public GetTypesByTerm(subjects: ILoadKafSubject[], term: number): TypesOfStudying[] {
    const types: TypesOfStudying[] = [];

    subjects.filter(o => o.term === term)
      .forEach(o => {
        const i = types.findIndex(t => t.id === +o.type);
        if (i === -1) {
          types.push(this.auth.TYPES.find(t => t.id === +o.type));
        }
      });

    return types;
  }
}
