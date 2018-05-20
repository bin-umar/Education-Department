import {Component, Input, OnInit} from '@angular/core';
import {IGroup} from "../../models/common";

@Component({
  selector: 'app-load',
  templateUrl: './load.component.html',
  styleUrls: ['../standard/standard.component.css']
})
export class LoadComponent implements OnInit {

  @Input() group: IGroup;

  constructor() { }

  ngOnInit() {
  }

}
