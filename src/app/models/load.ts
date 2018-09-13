import { ILoadKafSubject } from './load-kaf';
import { FilterReport, TypesOfStudying } from './common';
import { Department } from './faculty';

export interface Load {
  id: number;
  subjectName: string;
  idExSubject: number;
  fcId: number;
  fcName: string;
  term: number;
  course: number;
  group: string;
  degree: string;
  type: string;
  studentsAmount: number;
  section: string;
  hour: number;
  idGroup: number;
  isFlowSaved: boolean;
  hasError: boolean;
}

export interface ILoad {
  error: boolean;
  data: [Load];
}

export interface Teacher {
  id: number;
  fio: string;
  position: string;
  scienceDegree: string;
  v1: number;
  v2: number;
  v3: number;
}

export interface ITeacher {
  error: boolean;
  data: [Teacher];
}

export interface ILoadReport {
  number: number;
  itemName: string;
  courseProject: number;
  courseWork: number;
  workKont: number;
  lecture: number;
  laboratory: number;
  practical: number;
  seminar: number;
  kmro: number;
  totalAuditHour: number;
  exam: number;
  checkout: number;
  advice: number;
  practices: number;
  gosExam: number;
  diploma: number;
  total: number;
}

export class LoadReport {
  private items: ILoadReport [] = [];
  private currentDuration = '';
  private currentFilter = '';


  constructor(private subjects: ILoadKafSubject[],
              private filterReport: FilterReport,
              private kafedras: Department[],
              private faculties: Department[],
              private durations: TypesOfStudying[],
              private depId?: number) {

    this.currentDuration = this.durations.find(o => o.id === this.filterReport.duration).name;
    this.currentFilter = this.filterReport.mainFilter;

    if (this.currentFilter.indexOf('-fc') !== -1) { this.mergeByFc();
    } else if (this.currentFilter.indexOf('-kf') !== -1) { this.mergeByKf();
    } else if (this.currentFilter.indexOf('-type') !== -1) { this.mergeByType();
    } else {

      let departments: ILoadKafSubject[];

      if (this.depId && this.currentFilter.indexOf('fc-') !== -1) {
        departments = this.subjects.filter(o => +o.fcId === +this.depId);
      } else if (this.depId && this.currentFilter.indexOf('kf-') !== -1) {
        departments = this.subjects.filter(o => +o.kfId === +this.depId);
      } else {
        departments = this.subjects;
      }

      this.mergeAll(departments);
    }

  }

  private mergeByFc() {
    let _subjects = this.subjects;

    if (this.filterReport.duration !== 0) {
      _subjects = _subjects.filter(s => +s.term === this.filterReport.duration);
    }

    this.faculties.forEach((faculty, i) => {
      const subjects = _subjects.filter(o => +o.fcId === +faculty.id);

      const item = this.sum(subjects);

      item.itemName = faculty.fullName;
      item.number = (i + 1);

      this.items.push(item);
    });

    this.items.push(this.wholeSum(_subjects));
  }

  private mergeByKf() {

    let _kafedras;
    let _subjects;

    if (this.depId && this.filterReport.mainFilter.indexOf('-kf') !== -1) {
      _kafedras = this.kafedras.filter(o => +o.fcId === +this.depId);
      _subjects = this.subjects.filter(o => +o.fcId === +this.depId);
    } else {
      _kafedras = this.kafedras;
      _subjects = this.subjects;
    }

    if (this.filterReport.duration !== 0) {
      _subjects = _subjects.filter(s => +s.term === this.filterReport.duration);
    }

    _kafedras.forEach((kafedra, i) => {
      const subjects = _subjects.filter(o => +o.kfId === +kafedra.id);

      const item = this.sum(subjects);

      item.itemName = kafedra.fullName;
      item.number = (i + 1);

      this.items.push(item);
    });

    this.items.push(this.wholeSum(_subjects));
  }

  private mergeByType() {

    let departments: ILoadKafSubject[];

    if (this.depId && this.currentFilter.indexOf('fc-') !== -1) {
      departments = this.subjects.filter(o => +o.fcId === +this.depId);
    } else if (this.depId && this.currentFilter.indexOf('kf-') !== -1) {
      departments = this.subjects.filter(o => +o.kfId === +this.depId);
    } else {
      departments = this.subjects;
    }

    departments = departments.filter(o => +o.type === this.filterReport.type);

    this.mergeAll(departments);
  }

  private mergeAll(subjects: ILoadKafSubject[]) {
    this.durations.forEach(o => {
      let _subjects = subjects;

      if (o.id !== 0) {
        _subjects = subjects.filter(s => +s.term === o.id);
      }

      const item = this.sum(_subjects);
      item.itemName = 'Ҳамагӣ дар ' + o.name.toLowerCase();

      this.items.push(item);
    });
  }

  private wholeSum(subjects) {
    const sum = this.sum(subjects);
          sum.itemName = 'Ҳамагӣ дар ' + this.currentDuration.toLowerCase();

          return sum;
  }

  private sum(items: ILoadKafSubject[]) {
    const sum: ILoadReport = {
      number: null,
      itemName: null,
      courseProject: 0,
      courseWork: 0,
      workKont: 0,
      lecture: 0,
      laboratory: 0,
      practical: 0,
      seminar: 0,
      kmro: 0,
      totalAuditHour: 0,
      exam: 0,
      checkout: 0,
      advice: 0,
      practices: 0,
      gosExam: 0,
      diploma: 0,
      total: 0
    };

    items.forEach(o => {
      sum.courseProject += o.courseProject;
      sum.courseWork += o.courseWork;
      sum.workKont += o.workKont;
      sum.lecture += o.lecture.total;
      sum.laboratory += o.laboratory.total;
      sum.practical += o.practical.total;
      sum.seminar += o.seminar.total;
      sum.kmro += o.kmro.total;
      sum.totalAuditHour += o.totalAuditHour;
      sum.exam += o.exam;
      sum.checkout += o.checkout;
      sum.advice += o.advice;
      sum.practices += o.practices;
      sum.gosExam += o.gosExam;
      sum.diploma += o.diploma;
      sum.total += o.total;
    });

    return sum;
  }

  public getItems() {
    return this.items;
  }
}
