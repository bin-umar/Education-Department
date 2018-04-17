import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthService } from './auth.service';

import { GroupResponse, IGroup, ResponseAdd, UpdateResponse } from '../models/common';

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
            idSpec: item.idSpec,
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

  addGroup(group: IGroup) {
    const body = new HttpParams()
      .set('id', '')
      .set('idSpec', group.idSpec.toString())
      .set('name', group.name)
      .set('degree', group.degree)
      .set('type', group.type)
      .set('course', group.course.toString())
      .set('studentsAmount', group.studentsAmount.toString())
      .set('educationYear', group.educationYear.toString())
      .set('route', 'groups')
      .set('operation', 'insert')
      .set('token', this.auth.token);

    return this.auth.http.post(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).map((response: ResponseAdd) => {
      return response;
    });
  }

  updateGroup(group: IGroup) {
    const body = new HttpParams()
      .set('id', group.id.toString())
      .set('idSpec', group.idSpec.toString())
      .set('name', group.name)
      .set('degree', group.degree)
      .set('type', group.type)
      .set('course', group.course.toString())
      .set('studentsAmount', group.studentsAmount.toString())
      .set('educationYear', group.educationYear.toString())
      .set('route', 'groups')
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

  deleteGroup (id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'groups')
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
