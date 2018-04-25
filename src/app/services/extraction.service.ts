import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';

import { UpdateResponse } from '../models/common';
import { ExtractionSubject, ResponseExtractionSubject } from '../models/curriculum';

@Injectable()
export class ExtractionService {

  constructor(private auth: AuthService) { }

  getSubjectsByExtractionId(id: number) {
    return this.auth.http.get(
      this.auth.host + 'self.php?route=exsubjects&operation=one' +
      '&id=' + id + '&token=' + this.auth.token
    ).map((response: ResponseExtractionSubject) => {
      return response;
    });
  }

  updateSubject(subject: ExtractionSubject) {
    const body = new HttpParams()
      .set('id',         subject.id.toString())
      .set('auditCredits', subject.auditCredits.toString())
      .set('lessonHours', subject.lessonHours.toString())
      .set('lkPlan',    subject.lkPlan.toString())
      .set('lkTotal', subject.lkTotal.toString())
      .set('lbPlan',   subject.lbPlan.toString())
      .set('lbTotal',   subject.lbTotal.toString())
      .set('prPlan',   subject.prPlan.toString())
      .set('prTotal',   subject.prTotal.toString())
      .set('smPlan',   subject.smPlan.toString())
      .set('smTotal',   subject.smTotal.toString())
      .set('trainingPrac',   subject.trainingPrac.toString())
      .set('manuPrac',   subject.manuPrac.toString())
      .set('diplomPrac',   subject.diplomPrac.toString())
      .set('bachelorWork',   subject.bachelorWork.toString())
      .set('gosExam',   subject.gosExam.toString())
      .set('total',   subject.total.toString())
      .set('route',     'exsubjects')
      .set('operation', 'update')
      .set('token',     this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: UpdateResponse) => {
      return response;
    });
  }

  deleteSubject (id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'exsubjects')
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
