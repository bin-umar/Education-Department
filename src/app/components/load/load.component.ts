import { Component, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Kafedra } from '../../models/curriculum';
import { Faculty } from '../../models/common';
import { Load } from '../../models/load';
import { LoadService } from '../../services/load.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['./load.component.css'],
  providers: [ LoadService ],
  encapsulation: ViewEncapsulation.None,
})

export class LoadComponent implements OnInit {

  @Output() cmpName: any = 'Селанамоии гурӯҳҳо';

  kafedra: Kafedra = {
    id: null,
    shortName: '',
    fullName: ''
  };

  faculty: Faculty = {
    id: null,
    shortName: '',
    fullName: ''
  };

  subjects: Load[] = [];

  constructor(private loadService: LoadService,
              private authService: AuthService) {
  }

  ngOnInit() {
  }

  filteredSubjects() {
    return this.subjects.filter( x => +x.idGroup === 0);
  }

  findFlowGroup(id: number) {
    return this.subjects.filter(x => +x.idGroup === id);
  }

  findSimilarSubjects(subject: Load) {
    return this.filteredSubjects().filter(x => (
        x.degree === subject.degree &&
        x.type === subject.type &&
        +x.course === +subject.course &&
        +x.hour === +subject.hour &&
        +x.term === +subject.term &&
        x.subjectName === subject.subjectName &&
        +x.id !== +subject.id
    ));
  }

  sumStudentsAmount(id: number) {
    let sum = 0;
    this.subjects.filter(x => (
      +x.id === id || +x.idGroup === id
    )).forEach(x => {
      sum += +x.studentsAmount;
    });

    return sum;
  }

  getKafedrasLoadById(filter: { kf: Kafedra, fc: Faculty }) {

    if (filter.kf.id !== -1) {
      this.faculty = filter.fc;
      this.kafedra = filter.kf;

      this.loadService.getLoadSubjectsByKf(this.kafedra.id).subscribe((response) => {
        if (!response.error) {

          this.subjects = response.data.slice();
          this.subjects.forEach(subject => {

            subject.degree = this.authService.DEGREES[+subject.degree];
            subject.type = this.authService.TYPES[+subject.type];
            subject.idGroup = +subject.idGroup;
            subject.isFlowSaved = !(subject.idGroup === 0);

          });
        }
      });
    }
  }

  disConnectFlowedGroups(mId: number, fId: number) {
    this.loadService.disConnectFlowedGroups(mId, fId).subscribe(resp => {
      if (!resp.error) {
        const sb = this.subjects.find(x => +x.id === fId);
        sb.isFlowSaved = false;
        sb.idGroup = 0;
        sb.hour = this.subjects.find(x => +x.id === mId).hour;
      }
    });
  }

  saveFlowedSubject(mId: number, fId: number) {
    this.loadService.saveFlowedSubject(mId, fId).subscribe(resp => {
      if (!resp.error) {
        this.subjects.find(x => +x.id === fId).isFlowSaved = true;
      }
    });
  }
}
