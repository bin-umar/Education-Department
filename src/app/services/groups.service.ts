import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { AuthService } from './auth.service';
import { ResponseAdd, UpdateResponse } from '../models/common';
import { GroupResponse, IGroup } from '../models/faculty';

@Injectable()
export class GroupsService {
  dataChange: BehaviorSubject<IGroup[]> = new BehaviorSubject<IGroup[]>([]);

  constructor (private httpClient: HttpClient,
               private auth: AuthService) {}

  get data(): IGroup[] {
    return this.dataChange.value;
  }

  getAllGroups(): void {
    const body = new HttpParams()
      .set('route', 'groups')
      .set('operation', 'list')
      .set('token', this.auth.token);

    this.auth.http.post<GroupResponse>(this.auth.host, body.toString(),
      {
        headers: new HttpHeaders()
          .set('Content-Type', 'application/x-www-form-urlencoded')
      }).subscribe(response => {
      const groups: IGroup[] = [];
      response.data.forEach( (item, i) => {
        groups.push({
          id: +item.id,
          kfId: +item.kfId,
          fcId: +item.fcId,
          idSpec: item.idSpec,
          number: i + 1,
          name: item.name,
          degree: this.auth.DEGREES[+item.degree],
          type: this.auth.TYPES.find(o => o.id === +item.type).name,
          course: +item.course,
          subgroup: +item.subgroup,
          subgroup2: +item.subgroup2,
          studentsAmount: +item.studentsAmount,
          educationYear: item.educationYear,
          extraction: +item.extraction,
          load: +item.load
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
      .set('subgroup', group.subgroup.toString())
      .set('subgroup2', group.subgroup2.toString())
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
      .set('subgroup', group.subgroup.toString())
      .set('subgroup2', group.subgroup2.toString())
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

  generateLoad (idGroup: number, idExtraction: number) {
    const body = new HttpParams()
      .set('group_id', idGroup.toString())
      .set('extraction_id', idExtraction.toString())
      .set('route', 'loads')
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

  deleteLoad(id: number) {
    const body = new HttpParams()
      .set('id', id.toString())
      .set('route', 'loads')
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

  updateLoad(idLoad: number) {
    const body = new HttpParams()
      .set('load_id', idLoad.toString())
      .set('route', 'loads')
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
}
