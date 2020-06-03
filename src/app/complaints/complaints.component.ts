import { Component, OnInit, ViewChild } from '@angular/core';
import { faImage, IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { NgForm } from '@angular/forms';
import { SelectData } from '../dropdown/selectData.model';
import { AuthApiService } from '../services/auth-api.service';
import { ComplaintsService } from '../services/complaints.service';

@Component({
  selector: 'ttnd-complaints',
  templateUrl: './complaints.component.html',
  styleUrls: ['../styles/generic.styles.css', './complaints.component.css']
})
export class ComplaintsComponent implements OnInit {
  @ViewChild('department') dept: DropdownComponent;
  @ViewChild('issueTitle') issueTitle: DropdownComponent;

  imageIcon: IconDefinition = faImage;

  departments = [['Admin', 'Admin'], ['IT', 'IT'], ['Infra', 'Infra'], ['HR', 'HR']];
  issues = [['Hardware', 'Hardware'], ['Infrastructure', 'Infrastructure'], ['Others', 'Others']];

  attachments: Array<File> = [];
  selectedDept: string = '';
  selectedIssue: string = '';
  name: string = '';
  email: string = '';

  constructor(private authApi: AuthApiService, private complaintsApi: ComplaintsService) { }

  ngOnInit(): void {
    this.authApi.fetchUserDetails().subscribe(data => {
      this.name = data['name'];
      this.email = data['email'];
    });
  }

  onSubmit(form: NgForm): void {
    console.log("herer");
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

    this.complaintsApi.addComplaint(formData).subscribe(data => {
      console.log(data);
    }, err => {
      console.log(err.error);
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
}
