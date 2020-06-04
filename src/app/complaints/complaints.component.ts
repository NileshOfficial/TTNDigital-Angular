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

  constructor(private authApi: AuthApiService, private complaintsApi: ComplaintsService) { }

  ngOnInit(): void {
    this.authApi.fetchUserDetails().subscribe(data => {
      this.name = data['name'];
      this.email = data['email'];
    });

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
    })
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

    form.reset();
    this.dept.reset();
    this.issueTitle.reset();

    this.complaints = null;
    this.loadingComplaints = true;
    this.stopScrolling = false;

    this.complaintsApi.addComplaint(formData).subscribe(data => {
      this.posting = false;
      this.done = true;
      this.skip = 0;
      this.loadComplaintsOnInit();
      setTimeout(() => {
        this.done = false;
        this.freezePosting = false;
      }, 500);
    }, err => {
      this.posting = false;
      //if (err.error.errorCode === 'LIMIT_FILE_SIZE') {
      this.error = true;
      this.errMessage = err.error.message;
      setTimeout(() => {
        this.error = false;
        this.freezePosting = false;
      }, 1000);
      //}
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
        this.subscription = null;
        this.showLoader = false;
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
    });
  }

  resetFilters(): void {
    this.searchField = '';
    this.deptOptionsFilter.reset();
    this.statusOptionsFilter.reset();
    this.filters = {};

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
    })
  }
}
