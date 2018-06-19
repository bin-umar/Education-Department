import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';
import { UpdateResponse } from '../models/common';
import { ExtractionSubject, KafedraRes, ResponseExtractionSubject } from '../models/curriculum';

@Injectable()
export class ExtractionService {

  constructor(private auth: AuthService) { }

  getSubjectsByExtractionId(id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'exsubjects')
      .set('operation', 'one')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: ResponseExtractionSubject) => {
      return response;
    });
  }

  getKafedras() {
    const body = new HttpParams()
      .set('route', 'kafedra')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: KafedraRes) => {
      return response;
    });
  }

  getKafedraByFacultyId(fcId: number) {
    const body = new HttpParams()
      .set('id', fcId.toString())
      .set('route', 'kafedra')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: KafedraRes) => {
      return response;
    });
  }

  getKafedraBySubjectId(id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'kafedra')
      .set('operation', 'one')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: KafedraRes) => {
      return response;
    });
  }

  updateSubject(subject: ExtractionSubject) {
    const body = new HttpParams()
      .set('id', subject.id.toString())
      .set('idStSubject', subject.idStSubject.toString())
      .set('audit', subject.auditCredits.toString())
      .set('lessonHours', subject.lessonHours.toString())
      .set('courseProject', subject.courseProject.toString())
      .set('courseWork', subject.courseWork.toString())
      .set('lkPlan', subject.lkPlan.toString())
      .set('lkTotal', subject.lkTotal.toString())
      .set('lbPlan', subject.lbPlan.toString())
      .set('lbTotal', subject.lbTotal.toString())
      .set('prPlan', subject.prPlan.toString())
      .set('prTotal', subject.prTotal.toString())
      .set('smPlan', subject.smPlan.toString())
      .set('smTotal', subject.smTotal.toString())
      .set('trainingPrac', subject.trainingPrac.toString())
      .set('manuPrac',  subject.manuPrac.toString())
      .set('diplomPrac', subject.diplomPrac.toString())
      .set('bachelorWork', subject.bachelorWork.toString())
      .set('gosExam', subject.gosExam.toString())
      .set('idKafedra', subject.kfName)
      .set('route', 'exsubjects')
      .set('operation', 'update')
      .set('token', this.auth.token);

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
