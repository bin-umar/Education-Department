import {Component, ElementRef, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator, MatSort} from '@angular/material';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  @Output() cmpName = 'Гурӯҳҳо';
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('filter') filterInput: ElementRef;

  displayedColumns = ['number', 'name',  'degree',
    'type', 'course', 'studentsAmount', 'educationYear', 'actions'];

  constructor() { }

  ngOnInit() {
  }

}
