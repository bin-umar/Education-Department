import {
  Component,
  ComponentFactoryResolver,
  ComponentRef, ElementRef,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';

import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';

import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../services/data.service';
import { StandardComponent } from '../standard/standard.component';
import { MainService } from '../../services/main.service';
import { Spec, StandardList } from '../../models/interfaces';
import { AuthService } from '../../services/auth.service';
import { AppService } from '../../services/app.service';
import { DeleteDialogComponent } from '../../dialogs/delete/delete.dialog.component';

@Component({
  selector: 'app-standards-list',
  templateUrl: './standards-list.component.html',
  styleUrls: ['./standards-list.component.css'],
  entryComponents: [ StandardComponent ]
})

export class StandardsListComponent implements OnInit {

  @Output() cmpName: any = "Стандартҳо";
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('standard', {read: ViewContainerRef}) parent: ViewContainerRef;
  @ViewChild('filter') filterInput: ElementRef;

  type: Type<StandardComponent>;
  cmpRef: ComponentRef<StandardComponent>;
  standardCmp = StandardComponent;

  myControl: FormControl = new FormControl();
  filteredOptions: Observable<Spec[]>;

  exampleDatabase: DataService | null;
  dataSource: ExampleDataSource | null;
  panelOpenState = false;

  displayedColumns = ['number', 'specialty', 'degreeOfStudying'
    , 'timeOfStudying', 'typeOfStudying', 'dateOfAcceptance', 'actions'];
  selectedSpec: Spec;
  standardList: StandardList = {
    id: null,
    number: null,
    specialty: null,
    degreeOfStudying: null,
    profession: null,
    timeOfStudying: null,
    typeOfStudying: null,
    dateOfAcceptance: new Date()
  };

  options: Spec[] = [];
  standards: StandardList[] = [];
  add = true;
  index: number;
  id: number;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private mainService: MainService,
              public httpClient: HttpClient,
              private auth: AuthService,
              private appService: AppService,
              private dataService: DataService,
              public dialog: MatDialog) {
  }

  formControl = new FormControl('', [ Validators.required ]);

  ngOnInit() {

    this.mainService.getSpecialityList().subscribe((response) => {
      response.data.forEach(item => {
        this.options.push(item);
      });

      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith<string | Spec>(''),
          map(value => typeof value === 'string' ? value : value.fSpec_Shifr),
          map(val => val ? this.filter(val) : this.options.slice())
        );
    });

    this.loadData();
  }

  filter(val: string): Spec[] {
    return this.options.filter(option =>
      option.fSpec_Shifr.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  displayFn(spec?: Spec): string | undefined {
    return spec ? spec.fSpec_Shifr + " " + spec.fSpec_NameRus : undefined;
  }

  addStandard() {
    this.standardList.specialty = this.selectedSpec.fID.toString();
    this.dataService.addStandard(this.standardList).subscribe((res) => {
      this.exampleDatabase.dataChange.value.push({
        id: res.data.id,
        number: this.dataSource.filteredData.length,
        specialty: this.selectedSpec.fSpec_Shifr,
        degreeOfStudying: this.appService.degrees[this.standardList.degreeOfStudying],
        profession: this.standardList.profession,
        timeOfStudying: this.standardList.timeOfStudying,
        typeOfStudying: this.appService.types[this.standardList.typeOfStudying],
        dateOfAcceptance: this.standardList.dateOfAcceptance
      });

      this.refreshTable();
      this.standards.push(this.standardList);
    });
  }

  editSt(id: number) {
    this.add = false;
    this.panelOpenState = true;
    this.standardList = this.standards[this.findIndexById(id)];
  }

  deleteSt(row: StandardList) {

    this.index = row.number - 1;
    this.id = row.id;
    const dialogRef = this.dialog.open(DeleteDialogComponent, { data: row });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.dataService.deleteSt(this.id).subscribe( data => {

        });
        const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.id);
        // for delete we use splice in order to remove single object from DataService
        this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
        this.refreshTable();
      }
    });
  }

  findIndexById(id: number) {
    return this.standards.findIndex(x => +x.id === +id);
  }

  openSt(id: number) {
    this.createComponentDynamically(this.standardList);
  }

  saveModifiedSt() {  }

  createComponentDynamically(cmp) {
    if (this.cmpRef) { this.cmpRef.destroy(); }
    this.type = cmp;

    const childComponent = this.componentFactoryResolver.resolveComponentFactory(this.type);
    const CmpRef = this.parent.createComponent(childComponent);
    CmpRef.instance.Standard = {
      id: 0,
      number: 1,
      specialty: '530102 - Автоматонии системаҳои коркарди маълумот',
      degreeOfStudying: 'бакалавр',
      profession: 'Муҳандис доир ба технологияҳои иттилоотӣ',
      timeOfStudying: 4,
      typeOfStudying: 'рӯзона',
      dateOfAcceptance: new Date()
    };
    // this.component = CmpRef.instance.cmpName;
    // this.cmp = CmpRef.instance.openStandard;

    this.cmpRef = CmpRef;
  }

  // If you don't need a filter or a pagination this can be simplified, you just use code from else block
  private refreshTable() {
    // if there's a paginator active we're using it for refresh
    if (this.dataSource._paginator.hasNextPage()) {
      this.dataSource._paginator.nextPage();
      this.dataSource._paginator.previousPage();
      // in case we're on last page this if will tick
    } else if (this.dataSource._paginator.hasPreviousPage()) {
      this.dataSource._paginator.previousPage();
      this.dataSource._paginator.nextPage();
      // in all other cases including active filter we do it like this
    }
    // else {
    //   this.dataSource.filter = '';
    //   this.dataSource.filter = this.filter.nativeElement.value;
    // }
  }

  public loadData() {
    this.exampleDatabase = new DataService(this.httpClient, this.auth);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    Observable.fromEvent(this.filterInput.nativeElement, 'keyup')
      .debounceTime(150)
      .distinctUntilChanged()
      .subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filterInput.nativeElement.value;
      });
  }
}

export class ExampleDataSource extends DataSource<StandardList> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: StandardList[] = [];
  renderedData: StandardList[] = [];

  constructor(public _exampleDatabase: DataService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<StandardList[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllStandards();

    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((issue: StandardList) => {
        const searchStr = (issue.id + issue.number + issue.specialty + issue.degreeOfStudying).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    });
  }
  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  sortData(data: StandardList[]): StandardList[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'number': [propertyA, propertyB] = [a.number, b.number]; break;
        case 'specialty': [propertyA, propertyB] = [a.specialty, b.specialty]; break;
        case 'degreeOfStudying': [propertyA, propertyB] = [a.degreeOfStudying, b.degreeOfStudying]; break;
        case 'timeOfStudying': [propertyA, propertyB] = [a.timeOfStudying, b.timeOfStudying]; break;
        case 'typeOfStudying': [propertyA, propertyB] = [a.typeOfStudying, b.typeOfStudying]; break;
        case 'dateOfAcceptance': [propertyA, propertyB] = [a.dateOfAcceptance.toDateString(), b.dateOfAcceptance.toDateString()]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
