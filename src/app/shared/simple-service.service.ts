import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

@Injectable()
export class SimpleService {
  constructor(private http: HttpClient) { }

  getSomething(text) {
    return this.http.get('http://localhost/edudep/?text=' + text).map((data: Response ) => {
      return data;
    });
  }
}
