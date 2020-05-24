import { Component, OnInit } from '@angular/core';
import { faSort, faFilter, faChevronRight, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ttnd-resolve-board',
  templateUrl: './resolve-board.component.html',
  styleUrls: ['../styles/generic.styles.css', './resolve-board.component.css']
})
export class ResolveBoardComponent implements OnInit {

  sortIcon: IconDefinition = faSort;
  filterIcon: IconDefinition = faFilter;
  rightArrowIcon: IconDefinition = faChevronRight;
  crossIcon: IconDefinition = faTimes;

  statusOptions: Array<string> = ['Open', 'Resolved', 'In Progress'];
  departmentOptions: Array<string> = ['Admin', 'IT', 'Infra', 'HR'];
  searchOptions: Array<string> = ['Issue Id', 'Locked By'];
  timePopupVisible: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  getDropdownValue(event: { heading: string, idx: number }) {
    if(event.heading === 'In Progress' || event.heading === 'Open')
      this.timePopupVisible = true;
    else this.hideEstimatedTimePopup()
  }

  estimatedTimeSubmit() {
    this.hideEstimatedTimePopup();
  }

  hideEstimatedTimePopup() {
    this.timePopupVisible = false;
  }

}
