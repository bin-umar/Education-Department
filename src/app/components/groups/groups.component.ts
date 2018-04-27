import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';

import { DeleteDialogComponent } from '../../dialogs/delete/delete.dialog.component';

import { GroupsService } from '../../services/groups.service';
import { AuthService } from '../../services/auth.service';
import { MainService } from '../../services/main.service';

import { IGroup, Spec } from '../../models/common';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
  providers: [ GroupsService ]
})

export class GroupsComponent implements OnInit {

  @Output() cmpName = 'Гурӯҳҳо';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filterInput: ElementRef;

  groupDatabase: GroupsService | null;
  dataSource: GroupsDataSource | null;
  panelOpenState = false;

  displayedColumns = ['number', 'name',  'degree',
    'type', 'course', 'studentsAmount', 'educationYear', 'actions'];

  myControl: FormControl = new FormControl();
  filteredOptions: Observable<Spec[]>;
  selectedSpec: Spec;
  options: Spec[] = [];
  add = true;

  group: IGroup;

  constructor( public httpClient: HttpClient,
               private mainService: MainService,
               private groupsService: GroupsService,
               private auth: AuthService,
               public dialog: MatDialog) { }

  ngOnInit() {
    this.setStToDefault();

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

  setStToDefault() {
    this.add = true;
    this.panelOpenState = false;
    this.selectedSpec = {
      fID: null,
      fSpec_NameRus: '',
      fSpec_NameTaj: '',
      fSpec_Shifr: ''
    };

    this.group = {
      id: null,
      idSpec: null,
      number: null,
      name: '',
      degree: null,
      type: null,
      course: null,
      studentsAmount: null,
      educationYear: null
    };
  }

  addGroup() {
    this.group.idSpec = this.selectedSpec.fID;
    this.groupsService.addGroup(this.group).subscribe((res) => {
      if (!res.error) {
        this.groupDatabase.dataChange.value.push({
          id: res.data.id,
          idSpec: this.group.idSpec,
          number: this.dataSource.filteredData.length + 1,
          name: this.group.name,
          degree: this.auth.DEGREES[this.group.degree],
          type: this.auth.TYPES[this.group.type],
          course: this.group.course,
          studentsAmount: this.group.studentsAmount,
          educationYear: this.group.educationYear
        });

        this.refreshTable();
        this.setStToDefault();
      } else {
        console.log("Problem happened while adding new group");
      }
    });
  }

  saveModifiedGroup() {
    this.group.idSpec = this.selectedSpec.fID;
    const sIndex = this.groupDatabase.dataChange.value.findIndex(x => x.id === this.group.id);

    this.groupsService.updateGroup(this.group).subscribe((res) => {
      if (!res.error) {
        this.groupDatabase.dataChange.value.splice(sIndex, 1, {
          id: this.group.id,
          idSpec: this.group.idSpec,
          number: this.group.number,
          name: this.group.name,
          degree: this.auth.DEGREES[this.group.degree],
          type: this.auth.TYPES[this.group.type],
          course: this.group.course,
          studentsAmount: this.group.studentsAmount,
          educationYear: this.group.educationYear
        });

        this.refreshTable();
        this.setStToDefault();
      } else {
        console.log("Problem with updating group");
      }
    });
  }

  displayFn(spec?: Spec): string | undefined {
    return spec ? spec.fSpec_Shifr + " " + spec.fSpec_NameRus : undefined;
  }

  editGroup(row: IGroup) {
    this.add = false;
    this.panelOpenState = true;

    const sIndex = this.options.findIndex(x => x.fID === row.idSpec);
    const tIndex = this.auth.TYPES.findIndex(x => x === row.type);
    const dIndex = this.auth.DEGREES.findIndex(x => x === row.degree);

    this.selectedSpec = this.options[sIndex];
    this.group = {
      id: row.id,
      idSpec: row.idSpec,
      number: row.number,
      name: row.name,
      degree: dIndex.toString(),
      type: tIndex.toString(),
      course: row.course,
      studentsAmount: row.studentsAmount,
      educationYear: row.educationYear
    };
  }

  deleteGroup(row: IGroup) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '500px',
        data: {
          data: row,
          type: 'groups'
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.groupsService.deleteGroup(row.id).subscribe( data => {
          if (!data.error) {
            const foundIndex = this.groupDatabase.dataChange.value.findIndex(x => x.id === row.id);

            this.groupDatabase.dataChange.value.splice(foundIndex, 1);
            this.refreshTable();
          } else {
            console.log("Error has been happened while deleting Group");
          }
        });
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
    this.groupDatabase = new GroupsService(this.httpClient, this.auth);
    this.dataSource = new GroupsDataSource(this.groupDatabase, this.paginator, this.sort);
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

export class GroupsDataSource extends DataSource<IGroup> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: IGroup[] = [];
  renderedData: IGroup[] = [];

  constructor(public _exampleDatabase: GroupsService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<IGroup[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllGroups();

    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((issue: IGroup) => {
        const searchStr = (issue.id + issue.number + issue.degree + issue.name + issue.educationYear).toLowerCase();
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
  sortData(data: IGroup[]): IGroup[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'number': [propertyA, propertyB] = [a.number, b.number]; break;
        case 'name': [propertyA, propertyB] = [a.name, b.name]; break;
        case 'course': [propertyA, propertyB] = [a.course, b.course]; break;
        case 'type': [propertyA, propertyB] = [a.type, b.type]; break;
        case 'degree': [propertyA, propertyB] = [a.degree, b.degree]; break;
        case 'studentsAmount': [propertyA, propertyB] = [a.studentsAmount, b.studentsAmount]; break;
        case 'educationYear': [propertyA, propertyB] = [a.educationYear, b.educationYear]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
