import { Component, Input, OnChanges } from '@angular/core';

import { LoadReportService } from '../../services/load-report.service';
import { AuthService } from '../../services/auth.service';

import { FilterReport, TypesOfStudying } from '../../models/common';
import { Department, DepartmentInfo } from '../../models/faculty';
import { ILoadReport } from '../../models/load';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['../load-kaf/load-kaf.component.css']
})

export class ReportsComponent implements OnChanges {

  @Input() depInfo: DepartmentInfo;
  @Input() filterReport: FilterReport;
  @Input() items: ILoadReport[] = [];

  durations: TypesOfStudying[] = [];
  types: TypesOfStudying[] = [];

  currentDuration = '';
  currentType = '';

  kafedra: Department = {
    id: null,
    shortName: '',
    fullName: '',
    chief: ''
  };
  faculty = this.kafedra;

  constructor(private ldReport: LoadReportService,
              private auth: AuthService) {
    this.durations = this.ldReport.durations;
    this.types = this.auth.TYPES.slice();
  }

  ngOnChanges() {

    this.kafedra = LoadReportService.getKafedraInfo(this.depInfo);
    this.faculty = LoadReportService.getFacultyInfo(this.depInfo);

    this.currentDuration = this.durations.find(o => o.id === this.filterReport.duration).name;

    if (this.filterReport.type !== 0) {
      this.currentType = this.types.find(o => o.id === this.filterReport.type).name;
    }
  }

  rowAmount(amount: number): number[] {
    return Array.from(Array(amount).keys());
  }

  print() { window.print(); }
}
