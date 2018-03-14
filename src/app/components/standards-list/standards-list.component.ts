import {
  Component, ComponentFactoryResolver, ComponentRef,
  OnInit, Output, Type, ViewChild, ViewContainerRef
} from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { FormControl } from "@angular/forms";

import { Observable } from "rxjs/Observable";
import { startWith } from "rxjs/operators/startWith";
import { map } from "rxjs/operators/map";
import { StandardComponent } from "../standard/standard.component";
import { AddStandardComponent } from "../add-standard/add-standard.component";
import { MainService } from "../../shared/main.service";

@Component({
  selector: 'app-standards-list',
  templateUrl: './standards-list.component.html',
  styleUrls: ['./standards-list.component.css'],
  entryComponents: [
    StandardComponent
  ]
})

export class StandardsListComponent implements OnInit {

  @Output() cmpName: any = "Стандартҳо";

  dataSource: MatTableDataSource<StandardList>;
  panelOpenState = false;

  displayedColumns = ['number', 'specialty', 'degreeOfStudying'
    , 'timeOfStudying', 'typeOfStudying', 'dateOfAcceptance', 'actions'];
  standardList: StandardList = {
    id: '',
    number: -1,
    specialty: '',
    degreeOfStudying: 'undergraduate',
    profession: '',
    timeOfStudying: 0,
    typeOfStudying: 'dayTime',
    dateOfAcceptance: ''
  };
  options = [];
  users: StandardList[] = [];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('standard', {read: ViewContainerRef}) parent: ViewContainerRef;
  type: Type<StandardComponent>;
  cmpRef: ComponentRef<StandardComponent>;
  standardCmp = StandardComponent;

  myControl: FormControl = new FormControl();
  filteredOptions: Observable<string[]>;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private mainService: MainService) {
    for (let i = 1; i <= 10; i++) { this.users.push(createNewUser(i)); }
    this.dataSource = new MatTableDataSource(this.users);
  }

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(val => this.filter(val))
      );

    this.mainService.getSpecialityList().subscribe((response) => {
      console.log(response);
      response.data.forEach(item => {
        this.options.push(item.fSpec_Shifr);
      });
    });
  }

  filter(val: string): string[] {
    return this.options.filter(option =>
      option.toLowerCase().indexOf(val.toLowerCase()) === 0);
  }

  addStandard(): void {
    // this.users.push(this.standardList);
    // this.dataSource = new MatTableDataSource(this.users);
    // this.standardList.degreeOfStudying.val = this.selectedDegree;
    console.log(this.standardList);
    // console.log(this.users);
  }

  /**
   * Set the paginator and sort after the view init since this component will
   * be able to query its view for the initialized paginator and sort.
   */

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  editSt(id: number) {
    this.panelOpenState = true;
    this.standardList = this.users[this.findIndexById(id)];
  }

  deleteSt(id: number) {
    this.users.splice(this.findIndexById(id), 1);
  }

  findIndexById(id: number): number {
    return this.users.findIndex(x => +x.id === +id);
  }

  openSt(id: number) {
    // console.log(this.users);
    this.createComponentDynamically(this.standardList);
  }

  createComponentDynamically(cmp) {
    if (this.cmpRef) { this.cmpRef.destroy(); }
    this.type = cmp;

    const childComponent = this.componentFactoryResolver.resolveComponentFactory(this.type);
    const CmpRef = this.parent.createComponent(childComponent);
    CmpRef.instance.Standard = {
      id: '',
      number: 1,
      specialty: '530102 - Автоматонии системаҳои коркарди маълумот',
      degreeOfStudying: 'бакалавр',
      profession: 'Муҳандис доир ба технологияҳои иттилоотӣ',
      timeOfStudying: 4,
      typeOfStudying: 'рӯзона',
      dateOfAcceptance: ''
    };
    // this.component = CmpRef.instance.cmpName;
    // this.cmp = CmpRef.instance.openStandard;

    this.cmpRef = CmpRef;
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  }
}

/** Builds and returns a new User. */
function createNewUser(id: number): StandardList {
  const name =
    NAMES[Math.round(Math.random() * (NAMES.length - 1))];

  const i = Math.round(Math.random() * (DEGREES.length - 1));
  // const degree = DEGREES[i];
  const degree2 = DEGREES2[i];
  const time =  TIMES[Math.round(Math.random() * (TIMES.length - 1))];
  // const type =  TYPES[i];
  const type2 =  TYPES2[i];

  return {
    id: id.toString(),
    number: id,
    specialty: name,
    degreeOfStudying: degree2,
    profession: '',
    timeOfStudying: time,
    typeOfStudying: type2,
    dateOfAcceptance: ''
  };
}

const DEGREES = ['бакалавр', 'магистр', 'PhD'];
const DEGREES2 = ['undergraduate', 'graduate', 'phd'];
const TIMES = [4, 2, 3];
const TYPES = ['рӯзона', 'ғоибона', 'фосилавӣ'];
const TYPES2 = ['dayTime', 'partTime', 'distance'];

const NAMES = ['530102', '530101', '400102', '700200', '712512', '569152',
               '530102', '530103', '530104', '530105', '530106', '530107',
               '530108', '530109', '400103', '400104', '400105', '400106'];

export interface StandardList {
  id: string;
  number: number;
  specialty: string;
  degreeOfStudying: string;
  profession: string;
  timeOfStudying: number;
  typeOfStudying: string;
  dateOfAcceptance: string;
}
