import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardsListComponent } from './standards-list.component';

describe('StandardsListComponent', () => {
  let component: StandardsListComponent;
  let fixture: ComponentFixture<StandardsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
