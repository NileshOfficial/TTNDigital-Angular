import { Component, OnInit, ViewChild } from '@angular/core';
import { faCheck, faUndoAlt, faChevronRight, faTimes, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { ComplaintsService } from '../../services/complaints.service';
import { SelectData } from '../dropdown/selectData.model';
import { Complaint } from '../../interfaces/complaints.model';
import { NgForm } from '@angular/forms';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { Subscription } from 'rxjs';
import { UtilService } from '../../services/util.service';
import { invalidTokenErr } from '../../errCodes.conf';


@Component({
  selector: 'ttnd-resolve-board',
  templateUrl: './resolve-board.component.html',
  styleUrls: ['../styles/generic.styles.css', './resolve-board.component.css']
})
export class ResolveBoardComponent implements OnInit {

  @ViewChild('searchOptionsFilter') searchFilterRef: DropdownComponent;
  @ViewChild('deptOptionsFilter') deptFilterRef: DropdownComponent;
  @ViewChild('statusOptionsFilter') statusFilterRef: DropdownComponent;

  @ViewChild('timeTypeSelect') timeTypeSelect: DropdownComponent;
  @ViewChild('form') estimatedTimeForm: NgForm;

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
  filter: any = {};

  complaintDetailsVisible: boolean = false;
  complaintDetailsObject: Complaint = null;

  showLoader: boolean = true;
  skip: number = 0;
  limit: number = 10;
  subscription: Subscription = null;
  stopScrolling: boolean = false;
  loadingComplaints: boolean = true;

  freezePosting: boolean = false;
  posting: boolean = false;
  done: boolean = false;
  error: boolean = false;
  errMessage: string = '';

  complaintFetchErr: boolean = false;
  complaintFetchErrMsg: string = '';
  lazyFetchErr: boolean = false;
  lazyFetchErrMsg: string = '';

  constructor(private complaintApi: ComplaintsService, private util: UtilService) { }

  ngOnInit(): void {
    this.loadComplaintsOnInit();
  }

  loadComplaintsOnInit(): void {
    this.complaintApi.getAllComplaints(0, 10).subscribe(data => {
      this.complaints = data;
      this.loadingComplaints = false;
      this.skip += 10;
      if (data.length < this.limit)
        this.stopScrolling = true;
      this.complaintDetailsObject = data[0];
    }, err => {
      console.log(err);
      if (err.error.errorCode === invalidTokenErr) {
        this.util.refreshAuthToken(this.loadComplaintsOnInit.bind(this));
      } else {
        this.loadingComplaints = false;
        this.complaintFetchErr = true;
        this.complaintFetchErrMsg = 'Something went wrong, try refreshing. If error persists contact the administrator.';
      }
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
    this.freezePosting = true;
    this.posting = true;
    const patch = {
      status: this.dropDownValue,
      estimatedTime: {
        value: form.value.duration,
        spanType: this.estimatedTimeType,
      }
    }

    this.dropDownValue = '';
    this.estimatedTimeType = '';
    this.timeTypeSelect.reset();
    form.reset();

    this.complaintApi.updateStatus(this._id, patch).subscribe(data => {
      this._id = '';
      this.done = true;
      this.posting = false;
      setTimeout(() => {
        this.done = false;
        this.freezePosting = false;
        this.hideEstimatedTimePopup();
      }, 500);
    }, err => {
      console.log(err);

      if (err.error.errorCode === invalidTokenErr) {
        this.util.refreshAuthToken(this.updateEstimatedTime.bind(this), [this.estimatedTimeForm]);
      } else {
        this.posting = false;
        this.error = true;
        this.errMessage = 'Something went wrong, try refreshing. If error persists contact the administrator.';
      }
    });
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
    this.filter = {};

    if (this.departmentFilter) this.filter['department'] = this.departmentFilter;
    if (this.statusFilter) this.filter['status'] = this.statusFilter;
    if (this.searchFilter) {
      if (this.searchFilter === 'Issue Id')
        this.filter['issueId'] = this.searchField;
      if (this.searchFilter === 'Locked By')
        this.filter['lockedBy'] = this.searchField;
    }

    this.skip = 0;
    this.stopScrolling = false;
    this.complaints = [];
    this.loadingComplaints = true;

    this.complaintApi.getAllComplaints(this.skip, this.limit, this.filter).subscribe(data => {
      this.loadingComplaints = false;
      this.complaints = data;
      this.skip += 10;
      if (data.length < this.limit)
        this.stopScrolling = true;
      this.showLoader = false;
    }, err => {
      console.log(err);

      if (err.error.errorCode === invalidTokenErr) {
        this.util.refreshAuthToken(this.applyFilters.bind(this));
      } else {
        this.loadingComplaints = false;
        this.showLoader = false;
        this.complaintFetchErr = true;
        this.complaintFetchErrMsg = 'Something went wrong, try refreshing. If error persists contact the administrator.';
      }
    });
  }

  resetFilters(): void {
    this.deptFilterRef.reset('#000');
    this.searchFilterRef.reset('#000');
    this.statusFilterRef.reset('#000');
    this.searchField = '';
    this.filter = {};
    this.departmentFilter = '';
    this.statusFilter = '';
    this.searchFilter = '';

    this.skip = 0;
    this.stopScrolling = false;
    this.complaints = [];
    this.loadingComplaints = true;

    this.complaintApi.getAllComplaints(this.skip, this.limit).subscribe(data => {
      this.complaints = data;
      this.loadingComplaints = false;
      this.skip += 10;
      if (data.length < this.limit)
        this.stopScrolling = true;
      this.showLoader = false;
    }, err => {
      console.log(err);

      if (err.error.errorCode === invalidTokenErr) {
        this.util.refreshAuthToken(this.resetFilters.bind(this));
      } else {
        this.loadingComplaints = false;
        this.showLoader = false;
        this.complaintFetchErr = true;
        this.complaintFetchErrMsg = 'Something went wrong, try refreshing. If error persists contact the administrator.';
      }
    });
  }

  openMoreInfo(complaint: Complaint): void {
    this.complaintDetailsObject = complaint;
    this.complaintDetailsVisible = true;
  }

  closeMoreInfo(): void {
    this.complaintDetailsVisible = false;
  }

  onScroll(): void {
    if (!this.subscription && !this.stopScrolling) {
      this.showLoader = true;
      this.complaintApi.getAllComplaints(this.skip, this.limit, this.filter).subscribe(data => {
        this.complaints.push(...data);
        this.showLoader = false;
        this.subscription = null;
        this.skip += 10;
        if (data.length < this.limit)
          this.stopScrolling = true;
      }, err => {
        console.log(err);

        if (err.error.errorCode === invalidTokenErr) {
          this.util.refreshAuthToken(this.onScroll.bind(this));
        } else {
          this.showLoader = false;
          this.lazyFetchErr = true;
          this.lazyFetchErrMsg = 'Something went wrong, try refreshing. If error persists contact the administrator.';
        }
      });
    }
  }
}
