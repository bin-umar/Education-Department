import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import {IStandard, ResAddStandard, StandardList} from "../models/interfaces";
import {AuthService} from "./auth.service";
import {MainService} from "./main.service";

@Injectable()
export class DataService {

  dataChange: BehaviorSubject<StandardList[]> = new BehaviorSubject<StandardList[]>([]);
  dialogData: any;

  constructor (private httpClient: HttpClient,
               private auth: AuthService) {}

  get data(): StandardList[] {
    return this.dataChange.value;
  }

  getDialogData() {
    return this.dialogData;
  }

  /** CRUD METHODS */
  getAllStandards(): void {
    this.httpClient.get<IStandard>(
      this.auth.host + '/self.php?route=standards&operation=list&token=' + this.auth.token
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
            dateOfAcceptance: item.dateOfAcceptance
          });
        });

        this.dataChange.next(standards);
      },
      (error: HttpErrorResponse) => {
      console.log (error.name + ' ' + error.message);
      });
  }

  // DEMO ONLY, you can find working methods below
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

  updateSt (stList: StandardList): void {
    this.dialogData = stList;
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
      }).map((response: Response) => {
      return response;
    });
  }
}


const DEGREES = ['бакалавр', 'магистр', 'PhD'];
const TYPES = ['рӯзона', 'ғоибона', 'фосилавӣ'];

/* REAL LIFE CRUD Methods I've used in my projects. ToasterService uses Material Toasts for displaying messages:

    // ADD, POST METHOD
    addItem(kanbanItem: KanbanItem): void {
    this.httpClient.post(this.API_URL, kanbanItem).subscribe(data => {
      this.dialogData = kanbanItem;
      this.toasterService.showToaster('Successfully added', 3000);
      },
      (err: HttpErrorResponse) => {
      this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
    });
   }

    // UPDATE, PUT METHOD
     updateItem(kanbanItem: KanbanItem): void {
    this.httpClient.put(this.API_URL + kanbanItem.id, kanbanItem).subscribe(data => {
        this.dialogData = kanbanItem;
        this.toasterService.showToaster('Successfully edited', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }

  // DELETE METHOD
  deleteItem(id: number): void {
    this.httpClient.delete(this.API_URL + id).subscribe(data => {
      console.log(data['']);
        this.toasterService.showToaster('Successfully deleted', 3000);
      },
      (err: HttpErrorResponse) => {
        this.toasterService.showToaster('Error occurred. Details: ' + err.name + ' ' + err.message, 8000);
      }
    );
  }
*/




