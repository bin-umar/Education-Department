import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { ResponseExtractionSubject } from '../models/curriculum';

@Injectable()
export class ExtractionService {

  constructor(private auth: AuthService) { }

  getSubjectsByExtractionId(id: number) {
    return this.auth.http.get(
      this.auth.host + 'self.php?route=extractions&operation=one' +
      '&id=' + id + '&token=' + this.auth.token
    ).map((response: ResponseExtractionSubject) => {
      return response;
    });
  }

}
