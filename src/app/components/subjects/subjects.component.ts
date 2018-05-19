import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { DeleteDialogComponent } from '../../dialogs/delete/delete.dialog.component';

import { SubjectService } from '../../services/subject.service';
import { AuthService } from '../../services/auth.service';
import { MainService } from '../../services/main.service';

import { ISubject } from '../../models/common';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['../standards-list/standards-list.component.css'],
  providers: [ SubjectService ]
})

export class SubjectsComponent implements OnInit {

  @Output() cmpName = 'Фаннҳо';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filterInput: ElementRef;

  subjectDatabase: SubjectService | null;
  dataSource: SubjectsDataSource | null;
  panelOpenState = false;

  displayedColumns = ['number', 'name_tj', 'name_ru', 'shortname_tj', 'shortname_ru', 'subjects_actions'];

  add = true;
  subject: ISubject;

  constructor( public httpClient: HttpClient,
               private mainService: MainService,
               private subjectsService: SubjectService,
               private auth: AuthService,
               public dialog: MatDialog) { }

  ngOnInit() {
    this.setStToDefault();
    this.loadData();
  }

  setStToDefault() {
    this.add = true;
    this.panelOpenState = false;

    this.subject = {
      id: null,
      number: null,
      name_tj: '',
      name_ru: '',
      shortname_ru: '',
      shortname_tj: '',
      removable: 0
    };
  }

  addSubject() {
    this.subjectsService.addSubject(this.subject).subscribe((res) => {
      if (!res.error) {
        this.subjectDatabase.dataChange.value.push({
          id: res.data.id,
          number: this.dataSource.filteredData.length + 1,
          name_tj: this.subject.name_tj,
          name_ru: this.subject.name_ru,
          shortname_ru: this.subject.shortname_ru,
          shortname_tj: this.subject.shortname_tj,
          removable: this.subject.removable
        });

        this.refreshTable();
        this.setStToDefault();
      } else {
        console.log('Problem happened while adding new subject');
      }
    });
  }

  saveModifiedSubject() {
    const sIndex = this.subjectDatabase.dataChange.value.findIndex(x => x.id === this.subject.id);

    this.subjectsService.updateSubject(this.subject).subscribe((res) => {
      if (!res.error) {
        this.subjectDatabase.dataChange.value.splice(sIndex, 1, {
          id: this.subject.id,
          number: this.subject.number,
          name_tj: this.subject.name_tj,
          name_ru: this.subject.name_ru,
          shortname_ru: this.subject.shortname_ru,
          shortname_tj: this.subject.shortname_tj,
          removable: this.subject.removable
        });

        this.refreshTable();
        this.setStToDefault();
      } else {
        console.log('Problem with updating subject');
      }
    });
  }

  editSubject(row: ISubject) {
    this.add = false;
    this.panelOpenState = true;

    this.subject = {
      id: row.id,
      number: row.number,
      name_tj: row.name_tj,
      name_ru: row.name_ru,
      shortname_ru: row.shortname_ru,
      shortname_tj: row.shortname_tj,
      removable: row.removable
    };
  }

  deleteSubject(row: ISubject) {
    console.log(row);
    if (row.removable === 0) {
      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '500px',
        data: {
          data: row.name_tj,
          type: 'subjects'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          this.subjectsService.deleteSubject(row.id).subscribe( data => {
            if (!data.error) {
              const foundIndex = this.subjectDatabase.dataChange.value.findIndex(x => x.id === row.id);

              this.subjectDatabase.dataChange.value.splice(foundIndex, 1);
              this.refreshTable();
            } else {
              console.log('Error has been happened while deleting Subject');
            }
          });
        }
      });
    }
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
    this.subjectDatabase = new SubjectService(this.httpClient, this.auth);
    this.dataSource = new SubjectsDataSource(this.subjectDatabase, this.paginator, this.sort);
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

export class SubjectsDataSource extends DataSource<ISubject> {
  _filterChange = new BehaviorSubject('');

  get filter(): string {
    return this._filterChange.value;
  }

  set filter(filter: string) {
    this._filterChange.next(filter);
  }

  filteredData: ISubject[] = [];
  renderedData: ISubject[] = [];

  constructor(public _exampleDatabase: SubjectService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<ISubject[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllSubjects();

    return Observable.merge(...displayDataChanges).map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((issue: ISubject) => {
        const searchStr = (issue.id + issue.name_tj + issue.name_ru + issue.shortname_ru + issue.shortname_tj).toLowerCase();
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

  disconnect() {}

  /** Returns a sorted copy of the database data. */
  sortData(data: ISubject[]): ISubject[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'name_tj': [propertyA, propertyB] = [a.name_tj, b.name_tj]; break;
        case 'name_ru': [propertyA, propertyB] = [a.name_ru, b.name_ru]; break;
        case 'shortname_tj': [propertyA, propertyB] = [a.shortname_tj, b.shortname_tj]; break;
        case 'shortname_ru': [propertyA, propertyB] = [a.shortname_ru, b.shortname_ru]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
