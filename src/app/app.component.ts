import {
  Type,
  Component,
  OnDestroy,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  ComponentRef
} from '@angular/core';

import { StandardsListComponent } from './components/standards-list/standards-list.component';
import { GroupsComponent } from './components/groups/groups.component';
import { CurriculumListComponent } from './components/curriculum-list/curriculum-list.component';

import { MainService } from './services/main.service';
import { AuthService } from './services/auth.service';
import { UserInfo } from './models/common';
import {SubjectsComponent} from "./components/subjects/subjects.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [
    StandardsListComponent,
    GroupsComponent,
    CurriculumListComponent,
    SubjectsComponent
  ]
})
export class AppComponent implements OnDestroy {

  standardsListCmp = StandardsListComponent;
  subjectsComponent = SubjectsComponent;
  groupsComponent = GroupsComponent;
  curriculumListComponent = CurriculumListComponent;
  component = '';
  welcome = true;

  @ViewChild('content', {read: ViewContainerRef})
  parent: ViewContainerRef;
  type: Type<StandardsListComponent>;
  cmpRef: ComponentRef<StandardsListComponent>;

  constructor (private componentFactoryResolver: ComponentFactoryResolver,
               private mainService: MainService,
               private auth: AuthService) {

    const href = window.location.href;
    if (href.indexOf('hash') !== -1) {
      const hash = href.split('hash=')[1];
      const data = atob(hash).split('$');

      console.log(href);

      const user: UserInfo = {
        userId: +data[0],
        type: data[1],
        time: data[2]
      };

      this.auth.checkUserSession(user).subscribe(response => {
        if (!response) {
          window.location.replace('./error.html');
        }
      });
    } else {
      window.location.replace('./error.html');
    }

    // this.auth.getToken('jaxa', 'jaxa97').subscribe(result => {
    //   if (result) {
      // } else {
      //   console.log('Username or password is incorrect');
      // }
    // });
  }

  ngOnDestroy() {
    this.auth.logout();
  }

  createComponentDynamically(cmp) {
    this.welcome = false;
    if (this.cmpRef) { this.cmpRef.destroy(); }
    this.type = cmp;

    const childComponent = this.componentFactoryResolver.resolveComponentFactory(this.type);
    const CmpRef = this.parent.createComponent(childComponent);
    this.component = CmpRef.instance.cmpName;

    this.cmpRef = CmpRef;
  }
}
