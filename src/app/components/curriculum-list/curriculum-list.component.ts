import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { MatDialog, MatPaginator, MatSort } from '@angular/material';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, fromEvent, of, merge } from 'rxjs';
import { map, startWith, debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { ExtractionComponent } from '../extraction/extraction.component';
import { DeleteDialogComponent } from '../../dialogs/delete/delete.dialog.component';

import { CurriculumService } from '../../services/curriculum.service';
import { MainService } from '../../services/main.service';
import { AuthService } from '../../services/auth.service';

import { Spec, TypesOfStudying } from '../../models/common';
import { Department } from '../../models/faculty';
import { CurriculumList } from '../../models/curriculum';
import { Standard } from '../../models/standards';


@Component({
  selector: 'app-curriculum-list',
  templateUrl: './curriculum-list.component.html',
  styleUrls: ['../standards-list/standards-list.component.css'],
  providers: [ CurriculumService ],
  entryComponents: [ ExtractionComponent ]
})
export class CurriculumListComponent implements OnInit {

  @Output() cmpName: any = 'Иқтибосҳо';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('curriculum', {read: ViewContainerRef}) parent: ViewContainerRef;
  @ViewChild('filter') filterInput: ElementRef;

  cmpRef: ComponentRef<ExtractionComponent>;
  myControl: FormControl = new FormControl();
  filteredOptions: Observable<Spec[]>;

  curriculumDatabase: CurriculumService | null;
  dataSource: CurriculumDataSource | null;
  panelOpenState = false;

  displayedColumns = ['number', 'speciality', 'course', 'degree', 'type', 'educationYear', 'dateOfStandard', 'actions'];
  selectedSpec: Spec;
  curriculumList: CurriculumList;

  options: Spec[] = [];
  standards: Standard[] = [];
  _standards: Standard[] = [];
  add = true;
  error = false;
  errorText = '';

  types: TypesOfStudying[] = [];
  degrees: string[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private mainService: MainService,
              private auth: AuthService,
              private curriculumService: CurriculumService,
              public  dialog: MatDialog,
              public  httpClient: HttpClient) {
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

  displayFn(spec?: Spec): string | undefined {
    return spec ? spec.fSpec_Shifr + " " + spec.fSpec_NameTaj : undefined;
  }

  getContentByKfId(data: {kf: Department, fc: Department}) {

    if (+data.fc.id === 0) {
      this.filteredOptions = of(this.options);
    } else if (data.kf) {
      if (+data.kf.id === 0) {
        this.filteredOptions = of(this.options.filter(option => +option.fcId === +data.fc.id));
      } else {
        this.filteredOptions = of(this.options.filter(option => +option.kfId === +data.kf.id));
      }
    }

    this.dataSource.filterByKf = data.kf ? +data.kf.id : 0;
    this.dataSource.filterByFc = +data.fc.id;

    this.refreshTable();
  }

  specChange() {
    const option = this.selectedSpec;
    this.curriculumList.speciality = option.fID.toString();
    this.standards = [];

    this.curriculumService.getStandardsBySpec(option.fID).subscribe( resp => {
      if (!resp.error) {
        resp.data.forEach(item => {
          this.standards.push({
            ids: item.ids,
            kfId: item.kfId,
            fcId: item.fcId,
            fSpec_Shifr: '',
            timeOfStudying: item.timeOfStudying,
            typeOfStudying: this.types.find(o => o.id === +item.typeOfStudying).name,
            degreeOfStudying: this.degrees[item.degreeOfStudying],
            dateOfAcceptance: new Date(item.dateOfAcceptance),
            locked: item.locked
          });
        });

        this._standards = this.standards.slice();
      }
    });
  }

  findStandard() {

    let degree = this.curriculumList.degree,
          type = this.curriculumList.type;

    if (degree !== null && type !== null) {

      degree = this.degrees[degree];
      type = this.types.find(o => o.id === +type).name;

      this.standards = this._standards.filter(item => (
        item.degreeOfStudying === degree && item.typeOfStudying === type
      ));
    }
  }

  setStToDefault() {
    this.add = true;
    this.error = false;
    this.errorText = '';
    this.panelOpenState = false;
    this.selectedSpec = {
      fID: null,
      fSpec_NameRus: '',
      fSpec_NameTaj: '',
      kfId: null,
      fcId: null,
      fSpec_Shifr: ''
    };

    this.curriculumList = {
      id: null,
      number: null,
      kfId: null,
      fcId: null,
      speciality: null,
      degree: null,
      type: null,
      course: null,
      educationYear: null,
      idStandard: null,
      dateOfStandard: null,
      locked: 0
    };
  }

  addExtraction() {
    const cc = this.curriculumList;
    const i = this.curriculumDatabase.dataChange.value.findIndex(x =>
      (+x.course === +cc.course) && (x.type === this.types.find(o => o.id === +cc.type).name)
      && (x.degree === this.degrees[cc.degree]) && (+x.educationYear === (+cc.educationYear - 2000))
      && (x.speciality === this.selectedSpec.fSpec_Shifr));

    if (i === -1) {
      const standard = this.standards.find(item => item.ids === this.curriculumList.idStandard);

      if (+standard.locked === 1) {
        this.curriculumList.dateOfStandard = standard.dateOfAcceptance;

        this.curriculumService.addCurriculum(this.curriculumList).subscribe((res) => {
          if (!res.error) {
            this.curriculumDatabase.dataChange.value.push({
              id: res.data.id,
              number: this.dataSource.filteredData.length + 1,
              kfId: this.curriculumList.kfId,
              fcId: this.curriculumList.fcId,
              speciality: this.selectedSpec.fSpec_Shifr,
              course: this.curriculumList.course,
              degree: this.degrees[+this.curriculumList.degree],
              type: this.types.find(o => o.id === +this.curriculumList.type).name,
              educationYear: (+this.curriculumList.educationYear - 2000).toString(),
              idStandard: this.curriculumList.idStandard,
              dateOfStandard: this.curriculumList.dateOfStandard,
              locked: +this.curriculumList.locked
            });

            this.refreshTable();
            this.setStToDefault();
          } else {
            console.log("Problem happened while adding new standard");
          }
        });
      } else {
        console.log("Standard isn't ready for getting data");
      }
    } else {
      this.error = true;
      this.errorText = 'Инхел иқтибос аллакай вуҷуд дорад.';
    }
  }

  editSt(row: CurriculumList) {
    if (row.locked === 0) {

      const sIndex = this.options.findIndex(x => x.fSpec_Shifr === row.speciality);

      this.selectedSpec = this.options[sIndex];
      this.curriculumService.getStandardsBySpec(this.selectedSpec.fID).subscribe( resp => {
        if (!resp.error) {
          resp.data.forEach(item => {
            this._standards.push({
              ids: item.ids,
              kfId: item.kfId,
              fcId: item.fcId,
              fSpec_Shifr: '',
              timeOfStudying: item.timeOfStudying,
              typeOfStudying: this.types.find(o => o.id === +item.typeOfStudying).name,
              degreeOfStudying: this.degrees[item.degreeOfStudying],
              dateOfAcceptance: new Date(item.dateOfAcceptance),
              locked: item.locked
            });
          });

          this.standards = this._standards.filter(item => (
            item.degreeOfStudying === row.degree &&
            item.typeOfStudying === row.type
          ));

          const tIndex = this.types.findIndex(x => x.name === row.type);
          const dIndex = this.degrees.findIndex(x => x === row.degree);

          this.curriculumList = {
            id: row.id,
            number: row.number,
            kfId: row.kfId,
            fcId: row.fcId,
            speciality: row.speciality,
            degree: dIndex.toString(),
            type: tIndex.toString(),
            course: row.course,
            educationYear: row.educationYear,
            idStandard: row.idStandard,
            dateOfStandard: row.dateOfStandard,
            locked: row.locked
          };

          this.add = false;
          this.panelOpenState = true;
        }
      });
    }
  }

  deleteSt(row: CurriculumList) {
    if (row.locked === 0) {

      const dialogRef = this.dialog.open(DeleteDialogComponent, {
        width: '500px',
        data: {
          data: row,
          type: 'extraction'
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === 1) {
          this.curriculumService.deleteCurriculum(row.id).subscribe( data => {
            if (!data.error) {
              const foundIndex = this.curriculumDatabase.dataChange.value.findIndex(x => x.id === row.id);

              this.curriculumDatabase.dataChange.value.splice(foundIndex, 1);
              this.refreshTable();
            } else {
              console.log("Error has been happened while deleting Extraction");
            }
          });
        }
      });
    }
  }

  updateCurriculum(row: CurriculumList) {
    this.curriculumService.updateCurriculum(row).subscribe(response => {
      if (!response.error) {
        console.log('Successfully updated');
      } else {
        console.error('Something wrong happened while updating');
      }
    });
  }

  openSt(row: CurriculumList) {
    if (this.cmpRef) { this.cmpRef.destroy(); }

    const sIndex = this.options.findIndex(x => x.fSpec_Shifr === row.speciality);
    const speciality = this.options[sIndex];

    const childComponent = this.componentFactoryResolver.resolveComponentFactory(ExtractionComponent);
    const CmpRef = this.parent.createComponent(childComponent);

    CmpRef.instance.Curriculum = {
      id: row.id,
      number: row.number,
      kfId: row.kfId,
      fcId: row.fcId,
      speciality: speciality.fSpec_Shifr + " - \"" + speciality.fSpec_NameTaj + "\"",
      degree: row.degree,
      type: row.type,
      course: +row.course,
      educationYear: row.educationYear,
      idStandard: row.idStandard,
      dateOfStandard: row.dateOfStandard,
      locked: row.locked
    };

    CmpRef.instance.idSpec = +speciality.fID;

    this.cmpRef = CmpRef;
  }

  saveModifiedSt() {
    this.curriculumList.speciality = this.selectedSpec.fID.toString();
    const sIndex = this.curriculumDatabase.dataChange.value.findIndex(x => x.id === this.curriculumList.id);

    this.curriculumService.updateCurriculum(this.curriculumList).subscribe((res) => {
      if (!res.error) {
        this.curriculumDatabase.dataChange.value.splice(sIndex, 1, {
          id: this.curriculumList.id,
          number: this.curriculumList.number,
          kfId: this.curriculumList.kfId,
          fcId: this.curriculumList.fcId,
          speciality: this.selectedSpec.fSpec_Shifr,
          course: this.curriculumList.course,
          degree: this.degrees[+this.curriculumList.degree],
          type: this.types.find(o => o.id === +this.curriculumList.type).name,
          educationYear: (+this.curriculumList.educationYear - 2000).toString(),
          idStandard: this.curriculumList.idStandard,
          dateOfStandard: this.curriculumList.dateOfStandard,
          locked: +this.curriculumList.locked
        });

        this.refreshTable();
        this.setStToDefault();
      } else {
        console.log("Problem with updating extraction");
      }
    });
  }

  lockCurriculum(row: CurriculumList, status: number) {
    this.curriculumService.lockCurriculum(row.id, status).subscribe(res => {
      if (!res.error) {
        const sIndex = this.curriculumDatabase.dataChange.value.findIndex(x => x.id === row.id);
        row.locked = status;
        this.curriculumDatabase.dataChange.value.splice(sIndex, 1, row);

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
    this.curriculumDatabase = new CurriculumService(this.httpClient, this.auth);
    this.dataSource = new CurriculumDataSource(this.curriculumDatabase, this.paginator, this.sort);
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

export class CurriculumDataSource extends DataSource<CurriculumList> {
  _filterChange = new BehaviorSubject('');
  _kfChange = new BehaviorSubject(0);
  _fcChange = new BehaviorSubject(0);

  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  get filterByKf(): number { return this._kfChange.value; }
  set filterByKf(kfId: number) { this._kfChange.next(kfId); }

  get filterByFc(): number { return this._fcChange.value; }
  set filterByFc(fcId: number) { this._fcChange.next(fcId); }

  filteredData: CurriculumList[] = [];
  renderedData: CurriculumList[] = [];

  constructor(public _exampleDatabase: CurriculumService,
              public _paginator: MatPaginator,
              public _sort: MatSort) {
    super();
    // Reset to the first page when the user changes the filter.
    this._filterChange.subscribe(() => this._paginator.pageIndex = 0);
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<CurriculumList[]> {
    // Listen for any changes in the base data, sorting, filtering, or pagination
    const displayDataChanges = [
      this._exampleDatabase.dataChange,
      this._sort.sortChange,
      this._filterChange,
      this._kfChange,
      this._fcChange,
      this._paginator.page
    ];

    this._exampleDatabase.getAllCurriculums();

    return merge(...displayDataChanges).pipe(map(() => {
      // Filter data
      this.filteredData = this._exampleDatabase.data.slice().filter((issue: CurriculumList) => {
        const searchStr = (issue.id + issue.number + issue.speciality + issue.course + issue.educationYear).toLowerCase();

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
  sortData(data: CurriculumList[]): CurriculumList[] {
    if (!this._sort.active || this._sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'number': [propertyA, propertyB] = [a.number, b.number]; break;
        case 'speciality': [propertyA, propertyB] = [a.speciality, b.speciality]; break;
        case 'course': [propertyA, propertyB] = [a.course, b.course]; break;
        case 'educationYear': [propertyA, propertyB] = [a.educationYear, b.educationYear]; break;
      }

      const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
    });
  }
}
