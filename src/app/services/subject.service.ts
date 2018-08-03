import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ISubject, ResponseAdd, SubjectResponse, UpdateResponse } from '../models/common';

@Injectable()
export class SubjectService {

  dataChange: BehaviorSubject<ISubject[]> = new BehaviorSubject<ISubject[]>([]);

  constructor (private httpClient: HttpClient,
               private auth: AuthService) {}

  get data(): ISubject[] {
    return this.dataChange.value;
  }

  makeArchSubject(subject: ISubject) {
    const body = new HttpParams()
      .set('id', subject.id.toString())
      .set('isArch', subject.isArch.toString())
      .set('route', 'subjects')
      .set('operation', 'update')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: UpdateResponse) => {
      return response;
    }));
  }

  getAllSubjects(): void {
    const body = new HttpParams()
      .set('id', '1')
      .set('route', 'subjects')
      .set('operation', 'one')
      .set('token', this.auth.token);

    this.auth.http.post<SubjectResponse>(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).subscribe(response => {
        const subjects: ISubject[] = [];
        response.data.forEach( (item, i) => {
          subjects.push({
            id: +item.id,
            number: i + 1,
            name_tj: item.name_tj,
            name_ru: item.name_ru,
            shortname_tj: item.shortname_tj,
            shortname_ru: item.shortname_ru,
            isArch: +item.isArch,
            removable: +item.removable
          });
        });

        this.dataChange.next(subjects);
      },
      (error: HttpErrorResponse) => {
        console.log (error.name + ' ' + error.message);
      });
  }

  addSubject(subject: ISubject) {
    const body = new HttpParams()
      .set('id', '')
      .set('name_tj', subject.name_tj)
      .set('name_ru', subject.name_ru)
      .set('shortname_tj', subject.shortname_tj)
      .set('shortname_ru', subject.shortname_ru)
      .set('isArch', subject.isArch.toString())
      .set('route', 'subjects')
      .set('operation', 'insert')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ResponseAdd) => {
      return response;
    }));
  }

  updateSubject(subject: ISubject) {
    const body = new HttpParams()
      .set('id', subject.id.toString())
      .set('name_tj', subject.name_tj)
      .set('name_ru', subject.name_ru)
      .set('shortname_tj', subject.shortname_tj)
      .set('shortname_ru', subject.shortname_ru)
      .set('route', 'subjects')
      .set('operation', 'update')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: UpdateResponse) => {
      return response;
    }));
  }

  deleteSubject (id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'subjects')
      .set('operation', 'remove')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: UpdateResponse) => {
      return response;
    }));
  }

}
