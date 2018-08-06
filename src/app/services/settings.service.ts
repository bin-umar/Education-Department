import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { AuthService } from './auth.service';
import { ICoefficient, Settings, SettingsResp } from '../models/settings';

import { map } from 'rxjs/operators';
import { ResponseAdd } from '../models/common';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {

  coefs;
  settings: Settings[];
  constructor(private auth: AuthService) { }

  getLoadCoefficients() {
    const body = new HttpParams()
      .set('source', 'loadCfs')
      .set('route', 'settings')
      .set('operation', 'list')
      .set('token', this.auth.token);

    this.auth.http.post<SettingsResp>(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).subscribe(resp => {

        if (!resp.error) {
          this.settings = resp.data.slice();
          this.coefs = new ICoefficient(resp.data);
        }

    }, (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
    });
  }

  saveValue(item: Settings) {
    const body = new HttpParams()
      .set('id', item.id.toString())
      .set('value', item.value.toString())
      .set('route', 'settings')
      .set('operation', 'update')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: ResponseAdd) => {
      return response;
    }));
  }
}
