import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  ISpec,
  IStandard, StandardList
} from './interfaces';

@Injectable()
export class MainService {

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
      this.auth.host + '/self.php?route=spec&operation=list&token=' + this.auth.token
    ).map((response: ISpec) => {
      return response;
    });
  }

  getStandardList() {
    return this.auth.http.get(
      this.auth.host + '/self.php?route=standards&operation=list&token=' + this.auth.token
    ).map((response: IStandard) => {
      return response;
    });
  }

  addStandard(standard: StandardList) {
    const body = new HttpParams()
      .set('ids', '')
      .set('idSpec', standard.specialty)
      .set('degreeOfStudying', standard.degreeOfStudying)
      .set('timeOfStudying', standard.timeOfStudying.toString())
      .set('typeOfStudying', standard.typeOfStudying.toString())
      .set('dateOfAcceptance', MainService.getDate(standard.dateOfAcceptance))
      .set('route', 'standards')
      .set('operation', 'insert')
      .set('token', this.auth.token);

      return this.auth.http.post(this.auth.host, body.toString(),
        {
          headers: new HttpHeaders()
            .set('Content-Type', 'application/x-www-form-urlencoded')
        }).map((response: Response) => {
        return response;
      });
  }
}
