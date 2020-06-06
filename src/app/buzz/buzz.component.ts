import { Component, OnInit, ViewChild } from '@angular/core';
import { faPen, faChevronRight, faAt, faCheck, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { buzz } from '../interfaces/buzz.model';
import { NgForm } from '@angular/forms';
import { BuzzApiService } from '../services/buzz-api.service';
import { Subscription } from 'rxjs';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { UtilService } from '../services/util.service';
import { invalidTokenErr, fileSizeErr } from '../errCodes.conf';

@Component({
  selector: 'ttnd-buzz',
  templateUrl: './buzz.component.html',
  styleUrls: ['../styles/generic.styles.css', './buzz.component.css']
})
export class BuzzComponent implements OnInit {
  @ViewChild('category') categoryDropdown: DropdownComponent;
  @ViewChild('f') form: NgForm;

  penIcon: IconDefinition = faPen;
  postIcon: IconDefinition = faChevronRight;
  imageIcon: IconDefinition = faImage;
  atIcon: IconDefinition = faAt;
  tickIcon: IconDefinition = faCheck;

  loadingPosts: boolean = false;

  options: Array<Array<string>> = [['activity', 'Activity'], ['lost and found', 'Lost And Found']];
  images: Array<File> = [];
  category: string = '';
  posts: Array<buzz> = [];

  freezePosting: boolean = false;
  posting: boolean = false;
  done: boolean = false;
  error: boolean = false;
  errMessage: string = '';

  showLoader: boolean = false;
  skip = 0;
  limit = 5;
  subscription: Subscription = null;
  stopScrolling: boolean = false;

  postsFetchErr: boolean = false;
  postsFetchErrMsg: string = '';

  constructor(private buzzApi: BuzzApiService, private util: UtilService) { }

  ngOnInit(): void {
    this.loadPostsOnInit();
  }

  loadPostsOnInit() {
    this.loadingPosts = true;
    this.buzzApi.getBuzzFeed(this.skip, this.limit).subscribe(data => {
      this.loadingPosts = false;
      this.posts = data;
      this.skip += 5;
      if (data.length < this.limit)
        this.stopScrolling = true;
    }, err => {
      if (err.error.errorCode === invalidTokenErr) {
        this.util.refreshAuthToken(this.loadPostsOnInit.bind(this));
      } else {
        this.loadingPosts = false;
        this.postsFetchErr = true;
        this.postsFetchErrMsg = 'Something went wrong, try refreshing. If error persists contact the administrator.';
      }
    });
  }

  fileChange(event) {
    this.images = <Array<File>>event.target.files;
  }

  categoryChanged(event: { option: string, idx: number }) {
    this.category = event.option;
  }

  postBuzz(form: NgForm) {
    this.freezePosting = true;
    this.posting = true;
    const images = this.images;
    const formData: any = new FormData();
    for (const file of images) {
      formData.append("files", file, file.name);
    }
    formData.append('description', form.value['description']);
    formData.append('category', this.category);

    this.buzzApi.postBuzz(formData).subscribe(data => {
      form.reset();
      this.category = '';
      this.categoryDropdown.reset();
      this.images = [];
      this.posting = false;
      this.done = true;
      this.skip = 0;
      this.loadPostsOnInit();
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
        this.util.refreshAuthToken(this.postBuzz.bind(this), [this.form]);
      } else {
        this.posting = false;
        this.error = true;
        this.errMessage = 'Something went wrong, try refreshing. If error persists contact the administrator.';
      }
    });
  }

  onScroll() {
    if (!this.subscription && !this.stopScrolling) {
      this.showLoader = true;

      this.subscription = this.buzzApi.getBuzzFeed(this.skip, this.limit).subscribe(data => {
        this.posts.push(...data);
        if (data.length < this.limit)
          this.stopScrolling = true;
        this.skip += 5;
        this.showLoader = false;
        this.subscription = null;
      }, err => {
        console.log('scroll', err);
        if (err.error.errorCode === invalidTokenErr) {
          this.util.refreshAuthToken(this.onScroll.bind(this));
        } else {
          this.showLoader = false;
          this.postsFetchErr = true;
          this.postsFetchErrMsg = 'Something went wrong, try refreshing. If error persists contact the administrator.';
        }
      });
    }
  }

}
