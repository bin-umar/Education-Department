import { Component, OnInit, Output } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';
import { LoadReportService } from '../../services/load-report.service';
import { ExtractionService } from '../../services/extraction.service';
import { MainService } from '../../services/main.service';

import { ILoadKafSubject } from '../../models/load-kaf';
import { FilterReport, TypesOfStudying } from '../../models/common';
import { Department, DepartmentInfo } from '../../models/faculty';
import { ILoadReport, LoadReport} from '../../models/load';

@Component({
  selector: 'app-load-report',
  templateUrl: './load-report.component.html',
  styleUrls: ['./load-report.component.css']
})

export class LoadReportComponent implements OnInit {

  @Output() cmpName: any = 'Ҳисоботҳо';
  depInfo: DepartmentInfo = {
    fcId: -1,
    fcFullName: '',
    fcShortName: '',
    fcChief: '',
    kfId: -1,
    kfFullName: '',
    kfShortName: '',
    kfChiefPosition: '',
    kfChief: ''
  };

  subjects: ILoadKafSubject[] = [];
  loadKafSubjects: ILoadKafSubject[] = [];
  reportSubjects: ILoadReport[] = [];

  types: TypesOfStudying[] = [];
  durations: TypesOfStudying[] = [];

  filterReport: FilterReport = {
    mainFilter: '',
    type: 0,
    duration: 0
  };

  activeTabIndex = 2;

  constructor(private auth: AuthService,
              private stService: SettingsService,
              private extService: ExtractionService,
              private mainService: MainService,
              private ldReport: LoadReportService) {

    this.subjects = this.ldReport.subjects;
    this.types = this.auth.TYPES.slice();
    this.durations = this.ldReport.durations;

  }

  ngOnInit() {
    if (this.subjects.length > 0) { this.activeTabIndex = 0; }
  }

  doFilter() {
    let depId: number = null;
    if (this.filterReport.mainFilter.indexOf('kf-') !== -1) {
      depId = this.depInfo.kfId;
    } else if (this.filterReport.mainFilter.indexOf('fc-') !== -1) {
      depId = this.depInfo.fcId;
    }

    if (this.filterReport.mainFilter.indexOf('-type') !== -1) {
      if (this.filterReport.type === 0) {
        const str = this.filterReport.mainFilter.split("-")[0];
        this.filterReport.mainFilter = str + '-full';
      }
    }

    if (depId !== -1) {
      const loadReport = new LoadReport(this.subjects,
                                        this.filterReport,
                                        this.extService.kafedras.slice(),
                                        this.mainService.faculties.slice(),
                                        this.durations,
                                        depId);

      this.reportSubjects = loadReport.getItems();
    }
  }

  loadData() {
    this.ldReport.getLoadReport().subscribe(res => this.subjects = res);
  }

  getContentByKfId(data: {kf: Department, fc: Department}) {
    if (data.kf) {
      this.auth.getDepartmentInfo(data.kf.id).subscribe(response => {
        if (!response.error) {
          this.depInfo = response.data;
          this.loadKafSubjects = this.subjects.filter(o => +o.kfId === +data.kf.id);
        }
      });
    } else {
      this.depInfo.fcId = +data.fc.id;
      this.depInfo.fcFullName = data.fc.fullName;
      this.depInfo.fcShortName = data.fc.shortName;
    }
  }

  sum(prop: string, term?: number, typeS?: number) {
    return this.ldReport.Sum(this.subjects, prop, term, typeS);
  }

}
