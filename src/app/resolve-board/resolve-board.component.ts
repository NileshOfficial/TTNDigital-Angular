import { Component, OnInit, ViewChild } from '@angular/core';
import { faSort, faCheck, faUndoAlt, faChevronRight, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ComplaintsService } from '../services/complaints.service';
import { SelectData } from '../dropdown/selectData.model';
import { Complaint } from '../services/complaints.model';
import { NgForm } from '@angular/forms';
import { DropdownComponent } from '../dropdown/dropdown.component';

@Component({
  selector: 'ttnd-resolve-board',
  templateUrl: './resolve-board.component.html',
  styleUrls: ['../styles/generic.styles.css', './resolve-board.component.css']
})
export class ResolveBoardComponent implements OnInit {

  @ViewChild('searchOptionsFilter') searchFilterRef: DropdownComponent;
  @ViewChild('deptOptionsFilter') deptFilterRef: DropdownComponent;
  @ViewChild('statusOptionsFilter') statusFilterRef: DropdownComponent;

  sortIcon: IconDefinition = faSort;
  rightArrowIcon: IconDefinition = faChevronRight;
  crossIcon: IconDefinition = faTimes;
  resetIcon: IconDefinition = faUndoAlt;
  tickIcon: IconDefinition = faCheck;

  statusOptions: Array<Array<string>> = [['Open', 'Open', '#e04a32'], ['Resolved', 'Resolved', '#2ec020'], ['In Progress', 'In Progress', '#1a73e8']];
  departmentOptions: Array<Array<string>> = [['Admin', 'Admin'], ['IT', 'IT'], ['Infra', 'Infra'], ['HR', 'HR']];

  statusFilterOptions: Array<Array<string>> = [['', 'None', '#000'], ['Open', 'Open'], ['Resolved', 'Resolved'], ['In Progress', 'In Progress']];
  departmentFilterOptions: Array<Array<string>> = [['', 'None'], ...this.departmentOptions];
  searchOptions: Array<Array<string>> = [['', 'None'], ['Issue Id', 'Issue Id'], ['Locked By', 'Locked By']];

  timePopupVisible: boolean = false;
  timePopupPosition: any;
  dropDownValue: string = '';
  _id: string = '';

  complaints: Array<Complaint> = [];
  currentStatus: number = null;
  estimatedTimeType: string = null;

  departmentFilter: string = '';
  statusFilter: string = '';
  searchFilter: string = '';
  searchField: string = '';
  filter: any = null;

  constructor(private complaintApi: ComplaintsService) { }

  ngOnInit(): void {
    this.complaintApi.getAllComplaints(0, 0).subscribe(data => {
      this.complaints = data;
    });
  }

  getDropdownValue(event: SelectData, _id: string): void {
    if (event.option === 'In Progress') {
      this._id = _id;
      this.dropDownValue = event.option;
      this.timePopupVisible = true;
    }
    else {
      this.complaintApi.updateStatus(_id, { status: event.option }).subscribe(data => {
        console.log(data);
        this.hideEstimatedTimePopup();
      }, err => console.log(err));
      this.hideEstimatedTimePopup();
    }
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
    }
  }

  currentComplaintStatus(option: string): number {
    switch (option) {
      case 'Open': return 0;
      case 'Resolved': return 1;
      case 'In Progress': return 2;
    }
  }

  updateEstimatedTime(form: NgForm): void {
    const patch = {
      status: this.dropDownValue,
      estimatedTime: {
        value: form.value.duration,
        spanType: this.estimatedTimeType,
      }
    }

    this.dropDownValue = '';
    this.estimatedTimeType = '';
    this._id = '';
    form.reset();

    this.complaintApi.updateStatus(this._id, patch).subscribe(data => {
      console.log(data);
      this.hideEstimatedTimePopup();
    }, err => console.log(err));
  }

  timeType(event: SelectData): void {
    this.estimatedTimeType = event.option;
  }

  getDeptFilter(event: SelectData): void {
    this.departmentFilter = event.option;
  }

  getStatusFilter(event: SelectData): void {
    this.statusFilter = event.option;
  }

  getSearchFilter(event: SelectData): void {
    this.searchFilter = event.option;
  }

  applyFilters(): void {
    console.log("here");
    this.filter = {};

    if (this.departmentFilter) this.filter['department'] = this.departmentFilter;
    if (this.statusFilter) this.filter['status'] = this.statusFilter;
    if (this.searchFilter) {
      if (this.searchFilter === 'Issue Id')
        this.filter['issueId'] = this.searchField;
      if (this.searchFilter === 'Locked By')
        this.filter['lockedBy'] = this.searchField;
    }

    console.log(this.filter);
    this.complaintApi.getAllComplaints(0, 0, this.filter).subscribe(data => {
      this.complaints = data;
    })
  }

  resetFilters(): void {
    this.deptFilterRef.reset('#000');
    this.searchFilterRef.reset('#000');
    this.statusFilterRef.reset('#000');
    this.searchField = '';
    this.filter = null;
    this.departmentFilter = '';
    this.statusFilter = '';
    this.searchFilter = '';

    this.complaintApi.getAllComplaints(0, 0).subscribe(data => {
      this.complaints = data;
    })
  }
}
