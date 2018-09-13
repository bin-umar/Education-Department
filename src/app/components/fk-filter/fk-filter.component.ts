import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ExtractionService } from '../../services/extraction.service';
import { MainService } from '../../services/main.service';
import { Department } from '../../models/faculty';

@Component({
  selector: 'app-fk-filter',
  templateUrl: './fk-filter.component.html',
  styleUrls: ['./fk-filter.component.css']
})

export class FkFilterComponent implements OnInit {

  @Output() OnChooseKafedra = new EventEmitter<{kf: Department, fc: Department}>();
  faculties: Department[] = [];
  selectedKf: number;
  selectedFc: number;
  kafedras: Department[] = [];

  emptyOption = {
    id: 0,
    shortName: '',
    fullName: '',
    chief: ''
  };

  constructor(private extService: ExtractionService,
              private mainService: MainService) {

    if (this.extService.kafedras.length === 0) {
      this.extService.getKafedras().subscribe();
    }

    this.faculties = this.mainService.faculties.slice();
    this.faculties.unshift(this.emptyOption);

  }

  ngOnInit() {
    if (this.mainService.faculties.length === 0) {
      this.mainService.getFacultyList().subscribe(resp => {
          this.faculties = resp.slice();
          this.faculties.unshift(this.emptyOption);
      });
    }
  }

  findKafedra() {
    if (this.selectedFc === 0) {
      this.getContentByKfId();

      this.selectedFc = -1;
      this.selectedKf = -1;
      this.kafedras = [];

    } else {

      this.kafedras = this.extService.getKafedraByFacultyId(this.selectedFc);
      this.kafedras.unshift(this.emptyOption);
      this.getContentByKfId();

    }
  }

  getContentByKfId() {
    const fc = this.faculties.find(x => +x.id === +this.selectedFc);
    const kf = this.kafedras.find(x => +x.id === +this.selectedKf);

    this.OnChooseKafedra.emit({kf: kf, fc: fc});
  }

}
