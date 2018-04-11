import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
  IStandard,
  ResAddStandard,
  StandardList,
  UpdateResponse
} from '../models/interfaces';
import { AuthService } from './auth.service';
import { MainService } from './main.service';

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
    this.httpClient.get<IStandard>(
      this.auth.host + 'self.php?route=standards&operation=list&token=' + this.auth.token
    ).subscribe(response => {
        const standards: StandardList[] = [];
        response.data.forEach( (item, i) => {
          standards.push({
            id: item.ids,
            number: i + 1,
            specialty: item.fSpec_Shifr,
            degreeOfStudying: DEGREES[Number(item.degreeOfStudying)],
            profession: '',
            timeOfStudying: item.timeOfStudying,
            typeOfStudying: TYPES[Number(item.typeOfStudying)],
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
      }).map((response: ResAddStandard) => {
      return response;
    });
  }

  updateSt (standard: StandardList) {
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
      }).map((response: UpdateResponse) => {
      return response;
    });
  }

  deleteSt (id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'standards')
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

const DEGREES = ['бакалавр', 'магистр', 'PhD'];
const TYPES = ['рӯзона', 'ғоибона', 'фосилавӣ'];
