import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { ExtractionService } from '../../services/extraction.service';
import { MainService } from '../../services/main.service';

import { Kafedra, Faculty } from '../../models/faculty';

@Component({
  selector: 'app-fk-filter',
  templateUrl: './fk-filter.component.html',
  styleUrls: ['./fk-filter.component.css'],
  providers: [ ExtractionService ]
})
export class FkFilterComponent implements OnInit {

  @Output() OnChooseKafedra = new EventEmitter<{kf: Kafedra, fc: Faculty}>();
  faculties: Faculty[] = [];
  selectedKf: number;
  selectedFc: number;
  kafedras: Kafedra[] = [];

  emptyOption = {id: 0, shortName: '', fullName: ''};

  constructor(private extService: ExtractionService,
              private mainService: MainService) {
  }

  ngOnInit() {
    this.mainService.getFacultyList().subscribe(resp => {
      if (!resp.error) {
        this.faculties = resp.data.slice();
        this.faculties.unshift(this.emptyOption);
      }
    });
  }

  findKafedra() {
    if (this.selectedFc === 0) {
      this.getContentByKfId();

      this.selectedFc = -1;
      this.selectedKf = -1;
      this.kafedras = [];

    } else {
      this.extService.getKafedraByFacultyId(this.selectedFc).subscribe(resp => {
        if (!resp.error) {
          this.kafedras = resp.data.slice();
          this.kafedras.unshift(this.emptyOption);

          this.selectedKf = 0;
          this.getContentByKfId();
        }
      });
    }
  }

  getContentByKfId() {
    const fc = this.faculties.find(x => +x.id === +this.selectedFc);
    const kf = this.kafedras.find(x => +x.id === +this.selectedKf);

    this.OnChooseKafedra.emit({kf: kf, fc: fc});
  }

}
