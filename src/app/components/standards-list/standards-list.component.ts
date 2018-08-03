import {
  Component,
  ComponentFactoryResolver,
  ComponentRef, ElementRef,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';

import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, fromEvent, of, merge } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { StandardComponent } from '../standard/standard.component';
import { DeleteDialogComponent } from '../../dialogs/delete/delete.dialog.component';

import { DataService } from '../../services/data.service';
import { MainService } from '../../services/main.service';
import { AuthService } from '../../services/auth.service';

import { StandardList } from '../../models/standards';
import { Spec, TypesOfStudying } from '../../models/common';
import { Kafedra, Faculty } from '../../models/faculty';

@Component({
  selector: 'app-standards-list',
  templateUrl: './standards-list.component.html',
  styleUrls: ['./standards-list.component.css'],
  entryComponents: [ StandardComponent ]
})

export class StandardsListComponent implements OnInit {

  @Output() cmpName: any = 'Стандартҳо';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('standard', {read: ViewContainerRef}) parent: ViewContainerRef;
  @ViewChild('filter') filterInput: ElementRef;

  cmpRef: ComponentRef<StandardComponent>;
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<Spec[]>;

  exampleDatabase: DataService | null;
  dataSource: ExampleDataSource | null;
  panelOpenState = false;

  displayedColumns = ['number', 'specialty', 'degreeOfStudying'
    , 'timeOfStudying', 'typeOfStudying', 'dateOfAcceptance', 'actions'];
  selectedSpec: Spec;
  standardList: StandardList;

  options: Spec[] = [];
  add = true;
  isSubjectTypesLoaded = false;

  types: TypesOfStudying[] = [];
  degrees: string[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private mainService: MainService,
              private auth: AuthService,
              private dataService: DataService,
              public  dialog: MatDialog,
              public  httpClient: HttpClient) {
    this.types = this.auth.TYPES.slice();
    this.degrees = this.auth.DEGREES.slice();
  }

  formControl = new FormControl('', [ Validators.required ]);

  ngOnInit() {
    this.setStToDefault();

    this.mainService.getSpecialityList().subscribe((response) => {
      if (!response.error) {
        this.options = response.data.slice();

        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith<string | Spec>(''),
            map(value => typeof value === 'string' ? value : value.fSpec_Shifr),
            map(val => val ? this.filter(val) : this.options.slice())
          );
      } else {
        console.log('Something happened while getting specialities');
      }
    });

    this.mainService.getSubjectTypesList().subscribe(data => {
      this.isSubjectTypesLoaded = data;
    });

    this.loadData();
  }

  filter(val: string): Spec[] {
    return this.options.filter(option =>
      option.fSpec_Shifr.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  displayFn(spec?: Spec): string | undefined {
    return spec ? spec.fSpec_Shifr + " " + spec.fSpec_NameTaj : undefined;
  }

  setStToDefault() {
    this.add = true;
    this.panelOpenState = false;
    this.selectedSpec = {
      fID: null,
      fSpec_NameRus: '',
      fSpec_NameTaj: '',
      kfId: null,
      fcId: null,
      fSpec_Shifr: ''
    };

    this.standardList = {
      id: null,
      number: null,
      kfId: null,
      fcId: null,
      specialty: null,
      degreeOfStudying: null,
      profession: null,
      timeOfStudying: null,
      typeOfStudying: null,
      dateOfAcceptance: null,
      locked: 0
    };
  }

  getContentByKfId(data: {kf: Kafedra, fc: Faculty}) {

    if (+data.fc.id === 0) {
      this.filteredOptions = of(this.options);
    } else {

      if (+data.kf.id === 0) {
        this.filteredOptions = of(this.options.filter(option => +option.fcId === +data.fc.id));
      } else {

        this.filteredOptions = of(this.options.filter(option => +option.kfId === +data.kf.id));
      }
    }

    this.dataSource.filterByKf = +data.kf.id;
    this.dataSource.filterByFc = +data.fc.id;

    this.refreshTable();
  }

  addStandard() {
    this.standardList.specialty = this.selectedSpec.fID.toString();
    this.dataService.addStandard(this.standardList).subscribe((res) => {
      if (!res.error) {
        this.exampleDatabase.dataChange.value.push({
          id: res.data.id,
          number: this.dataSource.filteredData.length + 1,
          kfId: this.standardList.kfId,
          fcId: this.standardList.fcId,
          specialty: this.selectedSpec.fSpec_Shifr,
          degreeOfStudying: this.auth.DEGREES[this.standardList.degreeOfStudying],
          profession: this.standardList.profession,
          timeOfStudying: this.standardList.timeOfStudying,
          typeOfStudying: this.auth.TYPES[this.standardList.typeOfStudying],
          dateOfAcceptance: this.standardList.dateOfAcceptance,
          locked: this.standardList.locked
        });

        this.refreshTable();
        this.setStToDefault();
      } else {
        console.log("Problem happened while adding new standard");
      }
    });
  }

  editSt(row: StandardList) {
    if (row.locked === 0) {
      this.add = false;
      this.panelOpenState = true;

      const sIndex = this.options.findIndex(x => x.fSpec_Shifr === row.specialty);
      const tIndex = this.auth.TYPES.findIndex(x => x.name === row.typeOfStudying);
      const dIndex = this.auth.DEGREES.findIndex(x => x === row.degreeOfStudying);

      this.selectedSpec = this.options[sIndex];
      this.standardList = {
        id: row.id,
        number: row.number,
        kfId: row.kfId,
        fcId: row.fcId,
        specialty: row.specialty,
        degreeOfStudying: dIndex.toString(),
        profession: row.profession,
        timeOfStudying: row.timeOfStudying,
        typeOfStudying: tIndex.toString(),
        dateOfAcceptance: row.dateOfAcceptance,
        locked: row.locked
      };
    }
  }

  deleteSt(row: StandardList) {
    if (row.locked === 0) {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
          width: '500px',
          data: {
            data: row,
            type: 'standard'
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          this.dataService.deleteSt(row.id).subscribe( data => {
            if (!data.error) {
              const foundIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === row.id);

              this.exampleDatabase.dataChange.value.splice(foundIndex, 1);
              this.refreshTable();
            } else {
              console.log("Error has been happened while deleting Standard");
            }
          });
        }
      });
    }
  }

  openSt(row: StandardList) {

    if (this.isSubjectTypesLoaded) {
      if (this.cmpRef) { this.cmpRef.destroy(); }

      const sIndex = this.options.findIndex(x => x.fSpec_Shifr === row.specialty);
      const speciality = this.options[sIndex];

      const childComponent = this.componentFactoryResolver.resolveComponentFactory(StandardComponent);
      const CmpRef = this.parent.createComponent(childComponent);

      CmpRef.instance.Standard = {
        id: row.id,
        number: row.number,
        kfId: row.kfId,
        fcId: row.fcId,
        specialty: speciality.fSpec_Shifr + " " + speciality.fSpec_NameTaj,
        degreeOfStudying: row.degreeOfStudying,
        profession: row.profession,
        timeOfStudying: row.timeOfStudying,
        typeOfStudying: row.typeOfStudying,
        dateOfAcceptance: new Date(row.dateOfAcceptance),
        locked: row.locked
      };

      this.cmpRef = CmpRef;
    } else {
      console.log("Subject Types haven't been loaded yet");
    }
  }

  saveModifiedSt() {
    this.standardList.specialty = this.selectedSpec.fID.toString();
    this.standardList.dateOfAcceptance = new Date(this.standardList.dateOfAcceptance);
    const sIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === this.standardList.id);

    this.dataService.updateSt(this.standardList).subscribe((res) => {
      if (!res.error) {
        this.exampleDatabase.dataChange.value.splice(sIndex, 1, {
            id: this.standardList.id,
            number: this.standardList.number,
            kfId: this.standardList.kfId,
            fcId: this.standardList.fcId,
            specialty: this.selectedSpec.fSpec_Shifr,
            degreeOfStudying: this.auth.DEGREES[this.standardList.degreeOfStudying],
            profession: this.standardList.profession,
            timeOfStudying: this.standardList.timeOfStudying,
            typeOfStudying: this.auth.TYPES.find(o => o.id === +this.standardList.typeOfStudying).name,
            dateOfAcceptance: this.standardList.dateOfAcceptance,
            locked: this.standardList.locked
        });

        this.refreshTable();
        this.setStToDefault();
      } else {
        console.log("Problem with updating standard");
      }
    });
  }

  lockStandard(row: StandardList, status: number) {
    this.dataService.lockStandard(row.id, status).subscribe(res => {
      if (!res.error) {
        const sIndex = this.exampleDatabase.dataChange.value.findIndex(x => x.id === row.id);
        row.locked = status;
        this.exampleDatabase.dataChange.value.splice(sIndex, 1, row);

        this.refreshTable();
        this.setStToDefault();
      }
    });
  }

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
    } else {
      this.dataSource.filter = '';
      this.dataSource.filter = this.filterInput.nativeElement.value;
    }
  }

  public loadData() {
    this.exampleDatabase = new DataService(this.httpClient, this.auth);
    this.dataSource = new ExampleDataSource(this.exampleDatabase, this.paginator, this.sort);
    fromEvent(this.filterInput.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged())
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
  _kfChange = new BehaviorSubject(0);
  _fcChange = new BehaviorSubject(0);

  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  get filterByKf(): number { return this._kfChange.value; }
  set filterByKf(kfId: number) { this._kfChange.next(kfId); }

  get filterByFc(): number { return this._fcChange.value; }
  set filterByFc(fcId: number) { this._fcChange.next(fcId); }

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

    return merge(...displayDataChanges).pipe(map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((issue: StandardList) => {
        const searchStr = (issue.id + issue.number + issue.specialty + issue.degreeOfStudying).toLowerCase();

        if (this.filterByFc === 0) {
          return (searchStr.indexOf(this.filter.toLowerCase()) !== -1);
        } else {

          if (this.filterByKf === 0) {
            return (searchStr.indexOf(this.filter.toLowerCase()) !== -1) && +issue.fcId === +this.filterByFc;
          } else {
            return (searchStr.indexOf(this.filter.toLowerCase()) !== -1) && +issue.kfId === +this.filterByKf;
          }
        }

      });

      // Sort filtered data
      const sortedData = this.sortData(this.filteredData.slice());

      // Grab the page's slice of the filtered sorted data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      this.renderedData = sortedData.splice(startIndex, this._paginator.pageSize);
      return this.renderedData;
    }));
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
