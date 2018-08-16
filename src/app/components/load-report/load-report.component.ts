import { Component, OnInit, Output } from '@angular/core';
import { Department, DepartmentInfo } from '../../models/faculty';
import { AuthService } from '../../services/auth.service';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-load-report',
  templateUrl: './load-report.component.html',
  styleUrls: ['./load-report.component.css']
})

export class LoadReportComponent implements OnInit {

  @Output() cmpName: any = 'Ҳисоботҳо';
  depInfo: DepartmentInfo = {
    fcId: 0,
    fcFullName: '',
    fcShortName: '',
    fcChief: '',
    kfId: 0,
    kfFullName: '',
    kfShortName: '',
    kfChiefPosition: '',
    kfChief: '',
  };

  constructor(private auth: AuthService,
              private stService: SettingsService) { }

  ngOnInit() {
  }

  getContentByKfId(data: {kf: Department, fc: Department}) {
    this.auth.getDepartmentInfo(data.kf.id).subscribe(resp2 => {
      if (!resp2.error) {
        this.depInfo = resp2.data;
        this.stService.getLoadCoefficients();
      }
    });
  }

}
