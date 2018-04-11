import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';
import {
  ISpec,
  ISubType,
  ResSubType,
  ISubjectList,
  StSubjectResp,
  ISubjectResponse
} from '../models/interfaces';

@Injectable()
export class MainService {

  subjectTypes: ISubType[] = [];
  subjects: ISubjectList[] = [];

  degrees = ['бакалавр', 'магистр', 'PhD'];
  types = ['рӯзона', 'ғоибона', 'фосилавӣ'];

  constructor(private auth: AuthService) {}

  static getDate (date) {
    let day = date.getDate(),
      month = date.getMonth() + 1;

    const year = date.getFullYear();

    if (month < 10) { month = '0' + month; }
    if (day < 10) { day = '0' + day; }

    return year + "-" + month + "-" + day;
  }

  getSpecialityList() {
    return this.auth.http.get(
      this.auth.host + 'self.php?route=spec&operation=list&token=' + this.auth.token
    ).map((response: ISpec) => {
      return response;
    });
  }

  getSubjectsList() {
    return this.auth.http.get(
      this.auth.host + 'self.php?route=subjects&operation=list&token=' + this.auth.token
    ).map((response: ISubjectResponse) => {
      if (!response.error) {
        response.data.forEach(item => {
          this.subjects.push({
            id: item.id,
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
    return this.auth.http.get(
      this.auth.host + 'self.php?route=stsubjects&operation=one' +
      '&id=' + id + '&token=' + this.auth.token
    ).map((response: StSubjectResp) => {
      return response;
    });
  }

  getSubjectTypesList() {
    return this.auth.http.get(
      this.auth.host + 'self.php?route=subtype&operation=list&token=' + this.auth.token
    ).map((response: ResSubType) => {
      if (!response.error) {

        response.data.forEach(item => {
          this.subjectTypes.push({
            id: item.id,
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
