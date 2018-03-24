import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  ViewChild,
  ComponentFactoryResolver,
  ComponentRef,
  Type
} from '@angular/core';

import { StandardsListComponent } from "./components/standards-list/standards-list.component";
import { MainService } from './services/main.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  entryComponents: [
    StandardsListComponent
  ]
})
export class AppComponent implements
  OnInit,
  OnDestroy {

  standardsListCmp = StandardsListComponent;
  component = "";
  // cmp;

  @ViewChild('content', {read: ViewContainerRef})
  parent: ViewContainerRef;
  type: Type<StandardsListComponent>;
  cmpRef: ComponentRef<StandardsListComponent>;

  constructor (private componentFactoryResolver: ComponentFactoryResolver,
               private mainService: MainService,
               private auth: AuthService) {

    this.auth.getToken('jaxa', 'jaxa97').subscribe(result => {
      if (result) {
        this.createComponentDynamically(this.standardsListCmp);
      } else {
        console.log('Username or password is incorrect');
      }
    });

  }

  ngOnInit() {}

  ngOnDestroy() {
    this.auth.logout();
  }

  createComponentDynamically(cmp) {

    if (this.cmpRef) { this.cmpRef.destroy(); }
    this.type = cmp;

    const childComponent = this.componentFactoryResolver.resolveComponentFactory(this.type);
    const CmpRef = this.parent.createComponent(childComponent);
    this.component = CmpRef.instance.cmpName;
    // this.cmp = CmpRef.instance.openStandard;

    this.cmpRef = CmpRef;
  }
}
