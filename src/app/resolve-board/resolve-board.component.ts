import { Component, OnInit } from '@angular/core';
import { faSort, faFilter, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ttnd-resolve-board',
  templateUrl: './resolve-board.component.html',
  styleUrls: ['../styles/generic.styles.css', './resolve-board.component.css']
})
export class ResolveBoardComponent implements OnInit {

  sortIcon: IconDefinition = faSort;
  filterIcon: IconDefinition = faFilter;
  statusOptions: Array<string> = ['Open', 'Resolved', 'In Progress'];
  departmentOptions: Array<string> = ['Admin', 'IT', 'Infra', 'HR'];
  searchOptions: Array<string> = ['Issue Id', 'Locked By']

  constructor() { }

  ngOnInit(): void {
  }

  getDropdownValue(event: { heading: string, idx: number }) {

  }

}
