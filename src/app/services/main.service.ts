import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  ISpec,
  IStandard, ResAddStandard, StandardList
} from '../models/interfaces';

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
}
