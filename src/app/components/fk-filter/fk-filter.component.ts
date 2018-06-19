import {Component, EventEmitter, Output} from '@angular/core';
import { Kafedra } from '../../models/curriculum';
import { ExtractionService } from '../../services/extraction.service';

@Component({
  selector: 'app-fk-filter',
  templateUrl: './fk-filter.component.html',
  styleUrls: ['./fk-filter.component.css'],
  providers: [ ExtractionService ]
})
export class FkFilterComponent {

  @Output() OnChooseKafedra = new EventEmitter<{kfId: number, fcId: number}>();
  faculties = [{
      id: 1,
      name: 'тт'
    },
    {
      id: 2,
      name: 'Факултаи энергетикӣ'
    },
    {
      id: 3,
      name: 'ттт'
    },
    {
      id: 4,
      name: 'Факултаи химиявӣ'
    },
    {
      id: 5,
      name: 'Факултаи сохтмон ва меъморӣ'
    },
    {
      id: 6,
      name: 'Факултаи нақлиёт'
    },
    {
      id: 7,
      name: 'Факултаи технологияҳои иттилоотӣ ва коммуникатсионӣ'
    },
    {
      id: 8,
      name: 'Факултаи менеҷмент ва коммуникатсияҳои нақлиётӣ'
    }];
  selectedKf: number;
  selectedFc: number;
  kafedras: Kafedra[] = [];

  constructor(private extService: ExtractionService) { }

  findKafedra() {
    this.extService.getKafedraByFacultyId(this.selectedFc).subscribe(resp => {
      if (!resp.error) {
        this.kafedras = resp.data.slice();
      }
    });
  }

  getContentByKfId() {
    this.OnChooseKafedra.emit({kfId: this.selectedKf, fcId: this.selectedFc});
  };

}
