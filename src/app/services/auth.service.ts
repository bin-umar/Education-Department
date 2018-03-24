import { Injectable } from '@angular/core';
import {
  HttpClient
} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { IAuth } from '../models/interfaces';
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthService {

  public host = 'http://api.techuni.lo';
  public token: string;

  constructor(public http: HttpClient) {}

  getToken(username: string, password: string): Observable<boolean> {
    return this.http.get(
      this.host + '/self.php?route=auth&operation=login&username=' + username + '&password=' + password
    ).map((response: IAuth) => {
      const token = response.data.hash;
      if (token) {
        // set token property
        this.token = token;
        console.log(token);

        // store username and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token }));

        // return true to indicate successful login
        return true;
      } else {
        // return false to indicate failed login
        return false;
      }
    });
  }

  logout(): void {
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }

}
