import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  OnInit,
  Output,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  MatPaginator,
  MatSort,
  MatTableDataSource
} from '@angular/material';

import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Observable';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
import { StandardComponent } from '../standard/standard.component';
import { MainService } from '../../shared/main.service';
import { Spec, StandardList } from '../../shared/interfaces';

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

  type: Type<StandardComponent>;
  cmpRef: ComponentRef<StandardComponent>;
  standardCmp = StandardComponent;

  myControl: FormControl = new FormControl();
  filteredOptions: Observable<Spec[]>;

  dataSource: MatTableDataSource<StandardList>;
  panelOpenState = false;

  displayedColumns = ['number', 'specialty', 'degreeOfStudying'
    , 'timeOfStudying', 'typeOfStudying', 'dateOfAcceptance', 'actions'];
  selectedSpec: Spec;
  standardList: StandardList = {
    id: 0,
    number: -1,
    specialty: '',
    degreeOfStudying: 'undergraduate',
    profession: '',
    timeOfStudying: 0,
    typeOfStudying: 'dayTime',
    dateOfAcceptance: ''
  };

  options: Spec[] = [];
  users: StandardList[] = [];
  standards: StandardList[] = [];

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private mainService: MainService) {
    this.mainService.getStandardList().subscribe((response) => {
      if (!response.error) {
        response.data.forEach((item, i) => {
          this.standards.push({
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

        this.dataSource = new MatTableDataSource(this.standards);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }

      /*
 this.mainService.addStandard().subscribe((response) => {
         console.log(response);
       });
*/
    });
  }

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
    this.mainService.addStandard(this.standardList).subscribe((res) => {
      console.log(res);
      this.standards.push(this.standardList);
    });
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
    this.createComponentDynamically(this.standardList);
  }

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

const DEGREES = ['бакалавр', 'магистр', 'PhD'];
// const DEGREES2 = ['undergraduate', 'graduate', 'phd'];
const TYPES = ['рӯзона', 'ғоибона', 'фосилавӣ'];
// const TYPES2 = ['dayTime', 'partTime', 'distance'];
