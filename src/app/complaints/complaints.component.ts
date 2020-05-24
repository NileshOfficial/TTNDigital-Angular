import { Component, OnInit } from '@angular/core';
import { faImage, IconDefinition } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'ttnd-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['../styles/generic.styles.css', './complaints.component.css']
})
export class ComplaintsComponent implements OnInit {

  imageIcon: IconDefinition = faImage;

  departments = ['Admin', 'IT', 'Infra', 'HR'];
  issues = ['Hardware', 'Infrastructure', 'Others'];
  constructor() { }

  ngOnInit(): void {
  }

}