import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { IGroup } from '../../models/interfaces';

import { GroupsService } from '../../services/groups.service';
import { AuthService } from '../../services/auth.service';

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

  displayedColumns = ['number', 'name',  'degree',
    'type', 'course', 'studentsAmount', 'educationYear', 'actions'];

  constructor( public httpClient: HttpClient,
               private auth: AuthService,
               private groupsService: GroupsService,
               public dialog: MatDialog) { }

  ngOnInit() {
    this.loadData();
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
