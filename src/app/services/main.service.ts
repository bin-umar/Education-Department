import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';

import {
  ISubType,
  ResSubType,
  ISubjectList,
  StSubjectResp,
  ISubjectResponse
} from '../models/standards';
import { ISpec } from '../models/common';

@Injectable()
export class MainService {

  subjectTypes: ISubType[] = [];
  subjects: ISubjectList[] = [];

  constructor(private auth: AuthService) {}

  static getDate (date) {
    let day = date.getDate(),
      month = date.getMonth() + 1;

    const year = date.getFullYear();

    if (month < 10) { month = '0' + month; }
    if (day < 10) { day = '0' + day; }

    return year + '-' + month + '-' + day;
  }

  getSpecialityList() {
    const body = new HttpParams()
      .set('route', 'spec')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: ISpec) => {
      return response;
    });
  }

  getSubjectsList() {
    const body = new HttpParams()
      .set('route', 'subjects')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: ISubjectResponse) => {
      if (!response.error) {
        this.subjects = [];
        response.data.forEach(item => {
          this.subjects.push({
            id: +item.id,
            name: item.name
          });
        });
        return true;

      } else {
        return false;
      }
    });
  }

  getSubjectsByStandardId(id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'stsubjects')
      .set('operation', 'one')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: StSubjectResp) => {
      return response;
    });
  }

  getSubjectTypesList() {
    const body = new HttpParams()
      .set('route', 'subtype')
      .set('operation', 'list')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: ResSubType) => {
      if (!response.error) {
        this.subjectTypes = [];
        response.data.forEach(item => {
          this.subjectTypes.push({
            id: +item.id,
            name: item.name,
            showConfigIcons: false
          });
        });
        return true;

      } else {
        return false;
      }
    });
  }
}
