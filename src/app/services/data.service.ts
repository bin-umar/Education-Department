import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { MainService } from './main.service';

import { IStandard, StandardList } from '../models/standards';
import { ResponseAdd, UpdateResponse } from '../models/common';

@Injectable()
export class DataService {

  dataChange: BehaviorSubject<StandardList[]> = new BehaviorSubject<StandardList[]>([]);

  constructor (private httpClient: HttpClient,
               private auth: AuthService) {}

  get data(): StandardList[] {
    return this.dataChange.value;
  }

  /** CRUD METHODS */
  getAllStandards(): void {
    const body = new HttpParams()
      .set('route', 'standards')
      .set('operation', 'list')
      .set('token', this.auth.token);

    this.auth.http.post<IStandard>(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).subscribe(response => {
        const standards: StandardList[] = [];
        response.data.forEach( (item, i) => {
          const type = this.auth.TYPES.find(o => o.id === +item.typeOfStudying);
          standards.push({
            id: item.ids,
            number: i + 1,
            kfId: +item.kfId,
            fcId: +item.fcId,
            specialty: item.fSpec_Shifr,
            degreeOfStudying: this.auth.DEGREES[Number(item.degreeOfStudying)],
            profession: '',
            timeOfStudying: item.timeOfStudying,
            typeOfStudying: type && type.name,
            dateOfAcceptance: item.dateOfAcceptance,
            locked: +item.locked
          });
        });

        this.dataChange.next(standards);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
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
      }).pipe(map((response: ResponseAdd) => {
      return response;
    }));
  }

  updateSt(standard: StandardList) {
    const body = new HttpParams()
      .set('ids', standard.id.toString())
      .set('idSpec', standard.specialty)
      .set('degreeOfStudying', standard.degreeOfStudying)
      .set('timeOfStudying', standard.timeOfStudying.toString())
      .set('typeOfStudying', standard.typeOfStudying.toString())
      .set('dateOfAcceptance', MainService.getDate(standard.dateOfAcceptance))
      .set('route', 'standards')
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

  deleteSt(id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'standards')
      .set('operation', 'remove')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).pipe(map((response: UpdateResponse) => {
      return response;
    }));
  }

  lockStandard(id: number, status: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('status', status.toString())
      .set('route', 'standards')
      .set('operation', 'custom')
      .set('action', 'lock')
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
