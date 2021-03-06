import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { ILoad } from '../models/load';
import { UpdateResponse } from '../models/common';

@Injectable()
export class LoadService {

  constructor(private auth: AuthService) { }

  getLoadSubjectsByKf (id: number) {
    const body = new HttpParams()
      .set('kf_id', id.toString())
      .set('section_id', '4')
      .set('route', 'ldSubjects')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ILoad) => {
      return response;
    }));
  }

  saveFlowedSubject (mainSubjectId: number, flowedId: number) {
    const body = new HttpParams()
      .set('mainSubjectId', mainSubjectId.toString())
      .set('flowedId', flowedId.toString())
      .set('route', 'ldSubjects')
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

  disConnectFlowedGroups(mainSubjectId: number, flowedId: number) {
    const body = new HttpParams()
      .set('mainSubjectId', mainSubjectId.toString())
      .set('flowedId', flowedId.toString())
      .set('disconnect', '')
      .set('route', 'ldSubjects')
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
}
