import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { IAuth } from './interfaces';
import { Observable } from "rxjs/Observable";

@Injectable()
export class AuthService {

  public host = 'http://api.techuni.lo';
  public token: string;

  constructor(public http: HttpClient) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
    if (!this.token) {
      this.getToken('jaxa', 'jaxa97').subscribe(result => {
        if (result) {
          console.log('Done authorization!');
        } else {
          console.log('Username is incorrect');
        }
      });
    }
  }

  getToken(username: string, password: string): Observable<boolean> {
    return this.http.get(
      this.host + '/self.php?route=auth&operation=login&username=' + username + '&password=' + password
    ).map((response: IAuth) => {
      console.log(response);
      const token = response.data.hash;
      if (token) {
        // set token property
        this.token = token;

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
