import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import {ISubject, ResAddStandard, UpdateResponse} from '../models/interfaces';
import { AuthService } from './auth.service';

@Injectable()
export class StSubjectsService {

  constructor(private auth: AuthService) { }

  addSubject(subject: ISubject) {
    const body = new HttpParams()
      .set('id', '')
      .set('idStandard', subject.idStandard.toString())
      .set('idSubject', subject.name)
      .set('idType',    subject.idType.toString())
      .set('credits',   subject.credits.toString())
      .set('tExam',     subject.typeOfMonitoring.exam)
      .set('goUpIWS',   subject.typeOfMonitoring.goUpIWS)
      .set('tTotal',    subject.toTeacher.total.toString())
      .set('tAudit',    subject.toTeacher.including.audit.toString())
      .set('tKmro',     subject.toTeacher.including.kmro.toString())
      .set('IWS',       subject.IWS.toString())
      .set('cTerms',    subject.creditDividing.terms.toString())
      .set('cCredits',  subject.creditDividing.credits.toString())
      .set('route',     'stsubjects')
      .set('operation', 'insert')
      .set('token',     this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: ResAddStandard) => {
      return response;
    });
  }

  deleteSubject (id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'stsubjects')
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
}
