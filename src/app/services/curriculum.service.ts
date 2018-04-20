import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {CurriculumList, ICurriculumList} from "../models/curriculum";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {MainService} from "./main.service";
import {IAuth, ResponseAdd, UpdateResponse} from "../models/common";
import {IStandard} from "../models/standards";

@Injectable()
export class CurriculumService {

  dataChange: BehaviorSubject<CurriculumList[]> = new BehaviorSubject<CurriculumList[]>([]);

  get data(): CurriculumList[] {
    return this.dataChange.value;
  }

  constructor (private httpClient: HttpClient,
               private auth: AuthService) {
  }

  getStandardsBySpec(idSpec) {
    return this.httpClient.get(
      this.auth.host + 'self.php?route=extractions&operation=list&token=' + this.auth.token
    ).map((response: Response) => {
      return response;
    });
  }

  getAllCurriculums(): void {
    this.httpClient.get<ICurriculumList>(
      this.auth.host + 'self.php?route=extractions&operation=list&token=' + this.auth.token
    ).subscribe(response => {
        const curriculums: CurriculumList[] = [];
        response.data.forEach( (item, i) => {
          curriculums.push({
            id: item.id,
            number: i + 1,
            speciality: item.speciality,
            course: item.course,
            degree: this.auth.DEGREES[+item.degree],
            type: this.auth.TYPES[+item.type],
            educationYear: item.educationYear,
            idStandard: item.idStandard,
            dateOfStandard: item.dateOfStandard,
            locked: +item.locked
          });
        });

        this.dataChange.next(curriculums);
      },
      (error: HttpErrorResponse) => {
        console.log (error.name + ' ' + error.message);
      });
  }

  addStandard(standard: CurriculumList) {
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
    //   }).map((response: ResponseAdd) => {
    //   return response;
    // });
  }

  updateSt (standard: CurriculumList) {
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
