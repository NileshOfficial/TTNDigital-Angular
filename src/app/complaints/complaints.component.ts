import { Component, OnInit, ViewChild } from '@angular/core';
import { faImage, IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { faCheck, faUndoAlt } from '@fortawesome/free-solid-svg-icons';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { NgForm } from '@angular/forms';
import { SelectData } from '../dropdown/selectData.model';
import { AuthApiService } from '../services/auth-api.service';
import { ComplaintsService } from '../services/complaints.service';
import { Complaint } from '../services/complaints.model';
import { Subscription } from 'rxjs';
import { invalidTokenErr, fileSizeErr } from '../errCodes.conf';
import { UtilService } from '../services/util.service';
import { TokenstoreService } from '../services/tokenstore.service';

@Component({
  selector: 'ttnd-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['../styles/generic.styles.css', './complaints.component.css']
})
export class ComplaintsComponent implements OnInit {
  @ViewChild('department') dept: DropdownComponent;
  @ViewChild('issueTitle') issueTitle: DropdownComponent;

  @ViewChild('deptOptionsFilter') deptOptionsFilter: DropdownComponent;
  @ViewChild('statusOptionsFilter') statusOptionsFilter: DropdownComponent;

  @ViewChild('form') form: NgForm;

  imageIcon: IconDefinition = faImage;
  tickIcon: IconDefinition = faCheck;
  resetIcon: IconDefinition = faUndoAlt;

  departments = [['Admin', 'Admin'], ['IT', 'IT'], ['Infra', 'Infra'], ['HR', 'HR']];
  issues = [['Hardware', 'Hardware'], ['Infrastructure', 'Infrastructure'], ['Others', 'Others']];
  complaints: Array<Complaint> = [];

  attachments: Array<File> = [];
  selectedDept: string = '';
  selectedIssue: string = '';
  name: string = '';
  email: string = '';
  freezePosting: boolean = false;
  posting: boolean = false;
  done: boolean = false;
  error: boolean = false;
  errMessage: string = '';

  loadingComplaints: boolean = true;
  skip: number = 0;
  limit: number = 10;
  subscription: Subscription;
  stopScrolling: boolean = false;
  showLoader: boolean = false;

  complaintDetailsVisible: boolean = false;
  complaintDetailsObject: Complaint;

  searchField: string = '';
  departmentFilterOptions: Array<Array<string>> = [['', 'None'], ['Admin', 'Admin'], ['IT', 'IT'], ['Infra', 'Infra'], ['HR', 'HR']];
  statusFilterOptions: Array<Array<string>> = [['', 'None', '#000'], ['Open', 'Open'], ['Resolved', 'Resolved'], ['In Progress', 'In Progress']];
  deptFilterValue: string = '';
  statusFilterValue: string = '';
  filters: any = {};

  complaintFetchErr: boolean = false;
  complaintFetchErrMsg: string = '';
  lazyFetchErr: boolean = false;
  lazyFetchErrMsg: string = '';

  constructor(private tokenStore: TokenstoreService, private complaintsApi: ComplaintsService, private util: UtilService) { }

  ngOnInit(): void {
    const tokenSplit = this.tokenStore.token.id_token.split('.');
    const { name, email } = JSON.parse(atob(tokenSplit[1]));
    this.name = name;
    this.email = email;

    this.loadComplaintsOnInit();
  }

  loadComplaintsOnInit(): void {
    this.complaintsApi.getUserComplaints(this.skip, this.limit).subscribe(data => {
      this.loadingComplaints = false;
      this.complaints = data;
      this.skip += 10;
      if (data.length < this.limit)
        this.stopScrolling = true;
      this.complaintDetailsObject = data[0];
    }, err => {
      if (err.error.errorCode === invalidTokenErr) {
        this.util.refreshAuthToken(this.loadComplaintsOnInit.bind(this));
      } else {
        this.loadingComplaints = false;
        this.complaintFetchErr = true;
        this.complaintFetchErrMsg = 'Something went wrong, try refreshing. If error persists contact the administrator.';
      }
    });
  }

  onSubmit(form: NgForm): void {
    this.freezePosting = true;
    this.posting = true;

    const formData: any = new FormData();
    for (const file of this.attachments) {
      formData.append('files', file, file.name);
    }
    formData.append('department', this.selectedDept);
    formData.append('title', this.selectedIssue);
    formData.append('description', form.value['description']);

    this.complaints = null;
    this.loadingComplaints = true;
    this.stopScrolling = false;

    this.complaintsApi.addComplaint(formData).subscribe(data => {
      form.reset();
      this.dept.reset();
      this.issueTitle.reset();
      this.posting = false;
      this.done = true;
      this.skip = 0;
      this.loadComplaintsOnInit();
      setTimeout(() => {
        this.done = false;
        this.freezePosting = false;
      }, 500);
    }, err => {
      console.log(err);
      if (err.error.errorCode === fileSizeErr) {
        this.posting = false;
        this.error = true;
        this.errMessage = err.error.message;
        setTimeout(() => {
          this.error = false;
          this.freezePosting = false;
        }, 1000);
      } else if (err.error.errorCode === invalidTokenErr) {
        this.util.refreshAuthToken(this.onSubmit.bind(this), [this.form]);
      } else {
        this.posting = false;
        this.error = true;
        this.errMessage = 'Something went wrong, try refreshing. If error persists contact the administrator.';
      }
    })
  }

  departmentSelected(event: SelectData): void {
    this.selectedDept = event.option;
  }

  issueTitleSelected(event: SelectData): void {
    this.selectedIssue = event.option;
  }

  fileChange(event): void {
    this.attachments = <Array<File>>event.target.files;
  }

  onScroll(): void {
    if (!this.subscription && !this.stopScrolling) {
      this.showLoader = true;
      this.subscription = this.complaintsApi.getUserComplaints(this.skip, this.limit, this.filters).subscribe(data => {
        if (data.length < this.limit)
          this.stopScrolling = true;
        this.complaints.push(...data);
        this.subscription = null;
        this.showLoader = false;
        this.skip += 10;
      }, err => {
        console.log('scroll', err);
        if (err.error.errorCode === invalidTokenErr) {
          this.util.refreshAuthToken(this.onScroll.bind(this));
        } else {
          this.showLoader = false;
          this.lazyFetchErr = true;
          this.lazyFetchErrMsg = 'Something went wrong, try refreshing. If error persists contact the administrator.';
        }
      })
    }
  }

  openMoreInfo(complaint: Complaint): void {
    this.complaintDetailsObject = complaint;
    this.complaintDetailsVisible = true;
  }

  closeMoreInfo(): void {
    this.complaintDetailsVisible = false;
    this.complaintDetailsObject = null;
  }

  getDeptFilter(event: SelectData): void {
    this.deptFilterValue = event.option;
  }

  getStatusFilter(event: SelectData): void {
    this.statusFilterValue = event.option;
  }

  applyFilters(): void {
    this.filters = {};

    if (this.searchField) this.filters['issueId'] = this.searchField;
    if (this.deptFilterValue) this.filters['department'] = this.deptFilterValue;
    if (this.statusFilterValue) this.filters['status'] = this.statusFilterValue;

    this.skip = 0;
    this.stopScrolling = false;
    this.complaints = [];
    this.loadingComplaints = true;

    this.complaintsApi.getUserComplaints(this.skip, this.limit, this.filters).subscribe(data => {
      this.loadingComplaints = false;
      this.complaints = data;
      this.skip += 10;
      if (data.length < this.limit)
        this.stopScrolling = true;
    }, err => {
      if (err.error.errorCode === invalidTokenErr) {
        this.util.refreshAuthToken(this.applyFilters.bind(this));
      } else {
        this.loadingComplaints = false;
        this.complaintFetchErr = true;
        this.complaintFetchErrMsg = 'Something went wrong, try refreshing. If error persists contact the administrator.';
      }
    });
  }

  resetFilters(): void {
    this.searchField = '';
    this.deptOptionsFilter.reset();
    this.statusOptionsFilter.reset();
    this.filters = {};
    this.deptFilterValue = '';
    this.statusFilterValue = '';

    this.skip = 0;
    this.stopScrolling = false;
    this.complaints = [];
    this.loadingComplaints = true;

    this.complaintsApi.getUserComplaints(this.skip, this.limit).subscribe(data => {
      this.complaints = data;
      this.loadingComplaints = false;
      this.skip += 10;
      if (data.length < this.limit)
        this.stopScrolling = true;
    }, err => {
      if (err.error.errorCode === invalidTokenErr) {
        this.util.refreshAuthToken(this.resetFilters.bind(this));
      } else {
        this.loadingComplaints = false;
        this.complaintFetchErr = true;
        this.complaintFetchErrMsg = 'Something went wrong, try refreshing. If error persists contact the administrator.';
      }
    })
  }
}
