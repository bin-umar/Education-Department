import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { GroupResponse, IGroup, StandardList } from '../models/interfaces';

import { AuthService } from './auth.service';

@Injectable()
export class GroupsService {
  dataChange: BehaviorSubject<IGroup[]> = new BehaviorSubject<IGroup[]>([]);

  constructor (private httpClient: HttpClient,
               private auth: AuthService) {}

  get data(): IGroup[] {
    return this.dataChange.value;
  }

  getAllGroups(): void {
    this.httpClient.get<GroupResponse>(
      this.auth.host + 'self.php?route=groups&operation=list&token=' + this.auth.token
    ).subscribe(response => {
        const groups: IGroup[] = [];
        response.data.forEach( (item, i) => {
          groups.push({
            id: item.id,
            number: i + 1,
            name: item.name,
            degree: this.auth.DEGREES[Number(item.degree)],
            type: this.auth.TYPES[Number(item.type)],
            course: item.course,
            studentsAmount: item.studentsAmount,
            educationYear: 20 + item.educationYear
          });
        });

        this.dataChange.next(groups);
      },
      (error: HttpErrorResponse) => {
        console.log (error.name + ' ' + error.message);
      });
  }

  addStandard(standard: StandardList) {
    // const body = new HttpParams()
    //   .set('ids', '')
    //   .set('idSpec', standard.specialty)
    //   .set('degreeOfStudying', standard.degreeOfStudying)
    //   .set('timeOfStudying', standard.timeOfStudying.toString())
    //   .set('typeOfStudying', standard.typeOfStudying.toString())
    //   .set('dateOfAcceptance', MainService.getDate(standard.dateOfAcceptance))
    //   .set('route', 'standards')
    //   .set('operation', 'insert')
    //   .set('token', this.auth.token);
    //
    // return this.auth.http.post(this.auth.host, body.toString(),
    //   {
    //     headers: new HttpHeaders()
    //       .set('Content-Type', 'application/x-www-form-urlencoded')
    //   }).map((response: ResAddStandard) => {
    //   return response;
    // });
  }

  updateSt (standard: StandardList) {
    // const body = new HttpParams()
    //   .set('ids', standard.id.toString())
    //   .set('idSpec', standard.specialty)
    //   .set('degreeOfStudying', standard.degreeOfStudying)
    //   .set('timeOfStudying', standard.timeOfStudying.toString())
    //   .set('typeOfStudying', standard.typeOfStudying.toString())
    //   .set('dateOfAcceptance', MainService.getDate(standard.dateOfAcceptance))
    //   .set('route', 'standards')
    //   .set('operation', 'update')
    //   .set('token', this.auth.token);
    //
    // return this.auth.http.post(this.auth.host, body.toString(),
    //   {
    //     headers: new HttpHeaders()
    //       .set('Content-Type', 'application/x-www-form-urlencoded')
    //   }).map((response: UpdateResponse) => {
    //   return response;
    // });
  }

  deleteSt (id: number) {
    // const body = new HttpParams()
    //   .set('id', id.toString())
    //   .set('route', 'standards')
    //   .set('operation', 'remove')
    //   .set('token', this.auth.token);
    //
    // return this.auth.http.post(this.auth.host, body.toString(),
    //   {
    //     headers: new HttpHeaders()
    //       .set('Content-Type', 'application/x-www-form-urlencoded')
    //   }).map((response: UpdateResponse) => {
    //   return response;
    // });
  }
}
