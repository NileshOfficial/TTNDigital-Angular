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

  statusOptions: Array<Array<string>> = [['Open', 'Open'], ['Resolved', 'Resolved'], ['In Progress', 'In Progress']];
  departmentOptions: Array<Array<string>> = [['Admin', 'Admin'], ['IT', 'IT'], ['Infra', 'Infra'], ['HR', 'HR']];
  searchOptions: Array<Array<string>> = [['Issue Id', 'Issue Id'], ['Locked By', 'Locked By']];

  timePopupVisible: boolean = false;
  timePopupPosition: any;

  constructor() { }

  ngOnInit(): void {
  }

  getDropdownValue(event: { heading: string, idx: number }) {
    if (event.heading === 'In Progress' || event.heading === 'Open')
      this.timePopupVisible = true;
    else this.hideEstimatedTimePopup()
  }

  estimatedTimeSubmit() {
    this.hideEstimatedTimePopup();
  }

  hideEstimatedTimePopup() {
    this.timePopupVisible = false;
  }

  getClickedElementRef(event) {
    let card = document.getElementById("card").getBoundingClientRect();
    const cardX = card.x;
    const cardY = card.y;

    if (event.target.attributes.class && event.target.attributes.class.nodeValue === 'clickHandle') {
      const positionMeta = event.target.getBoundingClientRect();
      this.timePopupPosition = {
        'top.px': positionMeta['y'] - cardY - 50,
        'left.px': positionMeta['x'] - cardX - positionMeta['width'] - 50
      }
      console.log(positionMeta['x'], positionMeta['y']);
    }
  }

}
