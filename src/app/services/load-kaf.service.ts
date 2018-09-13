import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams} from '@angular/common/http';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { SettingsService } from './settings.service';
import { ILoadKaf } from '../models/load-kaf';

@Injectable()
export class LoadKafService {

  constructor(private auth: AuthService) {}

  public getTeacherReport(teacher_id: number, kf_id?: number) {
    const body = new HttpParams()
      .set('teacher_id', teacher_id.toString())
      .set('kf_id', kf_id.toString())
      .set('route', 'ldReports')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ILoadKaf) => {
      return response;
    }));
  }

  public getTeacherCourseWorks(teacher_id: number, kf_id?: number) {
    const body = new HttpParams()
      .set('teacher_id', teacher_id.toString())
      .set('kf_id', kf_id.toString())
      .set('route', 'ldCworks')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ILoadKaf) => {
      return response;
    }));
  }

}
