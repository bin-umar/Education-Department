import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
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

import { Faculty, IGroup, Kafedra } from '../../models/faculty';
import { Spec, TypesOfStudying } from '../../models/common';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['../standards-list/standards-list.component.css'],
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

  displayedColumns = ['number', 'name', 'course', 'degree', 'type',
    'studentsAmount', 'subgroup', 'subgroup2', 'educationYear', 'actions'];

  myControl: FormControl = new FormControl();
  filteredOptions: Observable<Spec[]>;
  selectedSpec: Spec;
  options: Spec[] = [];
  add = true;

  group: IGroup;
  types: TypesOfStudying[] = [];
  degrees: string[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              public httpClient: HttpClient,
              private mainService: MainService,
              private groupsService: GroupsService,
              private auth: AuthService,
              public dialog: MatDialog) {
    this.types = this.auth.TYPES.slice();
    this.degrees = this.auth.DEGREES.slice();
  }

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
      kfId: null,
      fcId: null,
      fSpec_Shifr: ''
    };

    this.group = {
      id: null,
      kfId: null,
      fcId: null,
      idSpec: null,
      number: null,
      name: '',
      degree: null,
      type: null,
      course: null,
      subgroup: null,
      subgroup2: null,
      studentsAmount: null,
      educationYear: null,
      extraction: 0,
      load: 0
    };
  }

  getContentByKfId(data: {kf: Kafedra, fc: Faculty}) {

    if (+data.fc.id === 0) {
      this.filteredOptions = Observable.of(this.options);
    } else {

      if (+data.kf.id === 0) {
        this.filteredOptions = Observable.of(this.options.filter(option => +option.fcId === +data.fc.id));
      } else {

        this.filteredOptions = Observable.of(this.options.filter(option => +option.kfId === +data.kf.id));
      }
    }

    this.dataSource.filterByKf = +data.kf.id;
    this.dataSource.filterByFc = +data.fc.id;

    this.refreshTable();
  }

  addGroup() {
    this.group.idSpec = this.selectedSpec.fID;
    this.groupsService.addGroup(this.group).subscribe((res) => {
      if (!res.error) {
        this.groupDatabase.dataChange.value.push({
          id: res.data.id,
          kfId: this.group.kfId,
          fcId: this.group.fcId,
          idSpec: this.group.idSpec,
          number: this.dataSource.filteredData.length + 1,
          name: this.group.name,
          degree: this.auth.DEGREES[this.group.degree],
          type: this.auth.TYPES.find(o => o.id === +this.group.type).name,
          course: this.group.course,
          subgroup: this.group.subgroup,
          subgroup2: this.group.subgroup2,
          studentsAmount: this.group.studentsAmount,
          educationYear: (+this.group.educationYear - 2000).toString(),
          extraction: this.group.extraction,
          load: this.group.load
        });

        this.refreshTable();
        this.setStToDefault();
      } else {
        console.log('Problem happened while adding new group');
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
          kfId: this.group.kfId,
          fcId: this.group.fcId,
          idSpec: this.group.idSpec,
          number: this.group.number,
          name: this.group.name,
          degree: this.auth.DEGREES[this.group.degree],
          type: this.auth.TYPES.find(o => o.id === +this.group.type).name,
          course: this.group.course,
          subgroup: this.group.subgroup,
          subgroup2: this.group.subgroup2,
          studentsAmount: this.group.studentsAmount,
          educationYear: (+this.group.educationYear - 2000).toString(),
          extraction: this.group.extraction,
          load: this.group.load
        });

        this.refreshTable();
        this.setStToDefault();
      } else {
        console.log('Problem with updating group');
      }
    });
  }

  displayFn(spec?: Spec): string | undefined {
    return spec ? spec.fSpec_Shifr + " " + spec.fSpec_NameTaj : undefined;
  }

  editGroup(row: IGroup) {

    if (row.load === 0) {
      this.add = false;
      this.panelOpenState = true;

      const sIndex = this.options.findIndex(x => x.fID === row.idSpec);
      const tIndex = this.auth.TYPES.findIndex(x => x.name === row.type);
      const dIndex = this.auth.DEGREES.findIndex(x => x === row.degree);

      this.selectedSpec = this.options[sIndex];
      this.group = {
        id: row.id,
        kfId: row.kfId,
        fcId: row.fcId,
        idSpec: row.idSpec,
        number: row.number,
        name: row.name,
        degree: dIndex.toString(),
        type: tIndex.toString(),
        course: row.course,
        subgroup: row.subgroup,
        subgroup2: row.subgroup2,
        studentsAmount: row.studentsAmount,
        educationYear: 20 + row.educationYear,
        extraction: +row.extraction,
        load: +row.load
      };
    }
  }

  connectGroupExt(group: IGroup) {
    if (group.extraction > 0) {
      this.groupsService.generateLoad(group.id, group.extraction).subscribe(resp => {
          if (!resp.error) {
            group.load = resp.data.id;
          }
      });
    }
  }

  disconnectGroupExt(group: IGroup) {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      data: {
        data: group,
        type: 'loads'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.groupsService.deleteLoad(group.load).subscribe(resp => {
          if (!resp.error) {
            group.load = 0;
          }
        });
      }
    });
  }

  deleteGroup(row: IGroup) {
    if (row.load === 0) {
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
              console.log('Error has been happened while deleting Group');
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
  _kfChange = new BehaviorSubject(0);
  _fcChange = new BehaviorSubject(0);

  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  get filterByKf(): number { return this._kfChange.value; }
  set filterByKf(kfId: number) { this._kfChange.next(kfId); }

  get filterByFc(): number { return this._fcChange.value; }
  set filterByFc(fcId: number) { this._fcChange.next(fcId); }

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
