import { Component, OnInit } from '@angular/core';
import { faSort, faFilter, faChevronRight, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ComplaintsService } from '../services/complaints.service';
import { SelectData } from '../dropdown/selectData.model';
import { Complaint } from '../services/complaints.model';

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

  statusOptions: Array<Array<string>> = [['Open', 'Open', '#e04a32'], ['Resolved', 'Resolved', '#2ec020'], ['In Progress', 'In Progress', '#1a73e8']];
  departmentOptions: Array<Array<string>> = [['Admin', 'Admin'], ['IT', 'IT'], ['Infra', 'Infra'], ['HR', 'HR']];
  searchOptions: Array<Array<string>> = [['Issue Id', 'Issue Id'], ['Locked By', 'Locked By']];

  timePopupVisible: boolean = false;
  timePopupPosition: any;

  complaints: Array<Complaint> = [];
  currentStatus: number = null;

  constructor(private complaintApi: ComplaintsService) { }

  ngOnInit(): void {
    this.complaintApi.getAllComplaints(0, 0).subscribe(data => {
      this.complaints = data;
    });
  }

  getDropdownValue(event: SelectData) {
    if (event.option === 'In Progress') {
      this.timePopupVisible = true;
    }
    else this.hideEstimatedTimePopup()
    console.log(this.timePopupVisible);
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

  currentComplaintStatus(option: string): number {
    switch (option) {
      case 'Open': return 0;
      case 'Resolved': return 1;
      case 'In Progress': return 2;
    }
  }

}
