import { Component, Output, ViewEncapsulation } from '@angular/core';

import { Department} from '../../models/faculty';
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

export class LoadComponent {

  @Output() cmpName: any = 'Селанамоии гурӯҳҳо';

  kafedra: Department = {
    id: null,
    shortName: '',
    fullName: '',
    chief: ''
  };

  faculty = this.kafedra;
  subjects: Load[] = [];
  error = false;

  constructor(private loadService: LoadService,
              private authService: AuthService) {
  }

  filteredSubjects() {
    return this.subjects.filter( x => +x.idGroup === 0);
  }

  getErrorSubjects() {
    const erSubjects = this.subjects.filter(o => o.hasError === true);
    this.error = erSubjects.length > 0;

    return erSubjects;
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
        +x.fcId === +subject.fcId &&
        x.subjectName === subject.subjectName &&
        +x.id !== +subject.id &&
        +x.idGroup === 0));
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

  getKafedrasLoadById(filter: { kf: Department, fc: Department }) {
    if (filter.kf && filter.kf.id !== -1) {
      this.faculty = filter.fc;
      this.kafedra = filter.kf;

      this.loadService.getLoadSubjectsByKf(this.kafedra.id).subscribe((response) => {
        if (!response.error) {

          this.subjects = response.data.slice();
          this.subjects.forEach((subject, id, array) => {

            subject.degree = this.authService.DEGREES[+subject.degree];
            subject.type = this.authService.TYPES.find(o => o.id === +subject.type).name;
            subject.idGroup = +subject.idGroup;
            subject.isFlowSaved = !(subject.idGroup === 0);

            if (subject.idGroup > 0) {
              const i = array.findIndex(o => +o.id === subject.idGroup);
              if (i === -1) { subject.hasError = true; }
            }

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

  correctErroneousSubject(subject: Load) {
    this.loadService.disConnectFlowedGroups(subject.idGroup, subject.id).subscribe(resp => {
      if (!resp.error) {
        const sb = this.subjects.find(x => +x.id === +subject.id);
        sb.isFlowSaved = false;
        sb.idGroup = 0;
        sb.hasError = false;
      }
    });
  }
}
