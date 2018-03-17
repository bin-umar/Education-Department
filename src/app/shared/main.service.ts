import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ISpec } from './interfaces';

@Injectable()
export class MainService {

  constructor(private auth: AuthService) {}

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
    ).map((response: ISpec) => {
      return response;
    });
  }
}
