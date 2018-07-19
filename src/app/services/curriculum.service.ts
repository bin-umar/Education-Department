import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';

import { ResponseAdd, UpdateResponse } from '../models/common';
import { IStandard } from '../models/standards';
import { CurriculumList, ICurriculumList } from '../models/curriculum';

@Injectable()
export class CurriculumService {

  dataChange: BehaviorSubject<CurriculumList[]> = new BehaviorSubject<CurriculumList[]>([]);

  get data(): CurriculumList[] {
    return this.dataChange.value;
  }

  constructor (private httpClient: HttpClient,
               private auth: AuthService) {
  }

  getStandardsBySpec(idSpec) {
    const body = new HttpParams()
      .set('id', idSpec)
      .set('route', 'extractions')
      .set('operation', 'one')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: IStandard) => {
      return response;
    });
  }

  getAllCurriculums(): void {
    const body = new HttpParams()
      .set('route', 'extractions')
      .set('operation', 'list')
      .set('token', this.auth.token);

    this.auth.http.post<ICurriculumList>(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).subscribe(response => {
        const curriculums: CurriculumList[] = [];
        response.data.forEach( (item, i) => {
          curriculums.push({
            id: item.id,
            number: i + 1,
            kfId: +item.kfId,
            fcId: +item.fcId,
            speciality: item.speciality,
            course: item.course,
            degree: this.auth.DEGREES[+item.degree],
            type: this.auth.TYPES[+item.type],
            educationYear: item.educationYear,
            idStandard: item.idStandard,
            dateOfStandard: item.dateOfStandard,
            locked: +item.locked
          });
        });

        this.dataChange.next(curriculums);
      },
      (error: HttpErrorResponse) => {
        console.log (error.name + ' ' + error.message);
      });
  }

  addCurriculum(curriculum: CurriculumList) {
    const body = new HttpParams()
      .set('id', '')
      .set('idSpec', curriculum.speciality)
      .set('course', curriculum.course.toString())
      .set('degree', curriculum.degree.toString())
      .set('type',   curriculum.type.toString())
      .set('educationYear', (+curriculum.educationYear - 2000).toString())
      .set('idStandard', curriculum.idStandard.toString())
      .set('route', 'extractions')
      .set('operation', 'insert')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: ResponseAdd) => {
      return response;
    });
  }

  updateCurriculum(curriculum: CurriculumList) {
    const body = new HttpParams()
      .set('id', curriculum.id.toString())
      .set('course', curriculum.course.toString())
      .set('idStandard', curriculum.idStandard.toString())
      .set('route', 'extractions')
      .set('operation', 'update')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: ResponseAdd) => {
      return response;
    });
  }

  deleteCurriculum(id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'extractions')
      .set('operation', 'remove')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: UpdateResponse) => {
      return response;
    });
  }

  lockCurriculum(id: number, status: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('status', status.toString())
      .set('route', 'extractions')
      .set('operation', 'custom')
      .set('action', 'lock')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: UpdateResponse) => {
      return response;
    });
  }
}
