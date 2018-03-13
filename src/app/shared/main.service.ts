import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable()
export class MainService {

  constructor(private auth: AuthService) {}

  getSpecialityList() {
    // const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.auth.token });
    console.log(this.auth.token);
    return this.auth.http.get(
      this.auth.host + '/self.php?route=spec&operation=list&token=' + this.auth.token
    ).map((response: Response) => {
      return response;
    });
  }
}
