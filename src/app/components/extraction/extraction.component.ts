import {Component, Input, OnInit} from '@angular/core';
import {CurriculumList} from "../../models/curriculum";

@Component({
  selector: 'app-extraction',
  templateUrl: './extraction.component.html',
  styleUrls: ['./extraction.component.css']
})
export class ExtractionComponent implements OnInit {

  @Input() Curriculum: CurriculumList;

  constructor() { }

  ngOnInit() {
  }

}
