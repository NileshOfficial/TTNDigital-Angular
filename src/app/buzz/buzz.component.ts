import { Component, OnInit } from '@angular/core';
import { faPen, faChevronRight, faAt, faCheck, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { buzz } from '../interfaces/buzz.model';
import { NgForm } from '@angular/forms';
import { BuzzApiService } from '../services/buzz-api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'ttnd-buzz',
  templateUrl: './buzz.component.html',
  styleUrls: ['../styles/generic.styles.css', './buzz.component.css']
})
export class BuzzComponent implements OnInit {

  penIcon: IconDefinition = faPen;
  postIcon: IconDefinition = faChevronRight;
  imageIcon: IconDefinition = faImage;
  atIcon: IconDefinition = faAt;
  tickIcon: IconDefinition = faCheck;

  options: Array<Array<string>> = [['activity', 'Activity'], ['lost and found', 'Lost And Found']];
  images: Array<File> = [];
  category: string = '';
  posts: Array<buzz> = [];
  heading = 'Category';

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

  constructor(private buzzApi: BuzzApiService) { }

  ngOnInit(): void {
    this.buzzApi.getBuzzFeed(this.skip, this.limit).subscribe(data => {
      console.log(this.skip);
      this.posts.push(...data);
      this.skip += 5;
    });
  }

  fileChange(event) {
    this.images = <Array<File>>event.target.files;
  }

  categoryChanged(event: { option: string, idx: number }) {
    this.category = event.option;
    console.log(event.option);
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
    form.reset();
    this.heading = '';

    this.buzzApi.postBuzz(formData).subscribe(data => {
      this.posting = false;
      this.done = true;
      setTimeout(() => {
        this.done = false;
        this.freezePosting = false;
      }, 500);
    }, err => {
      this.posting = false;
      setTimeout(() => {
        this.done = false;
        this.freezePosting = false;
      }, 500);
    });
  }

  onScroll() {
    if (!this.subscription && !this.stopScrolling) {
      this.showLoader = true;

      this.subscription = this.buzzApi.getBuzzFeed(this.skip, this.limit).subscribe(data => {
        this.posts.push(...data);
        if (data.length === 0)
          this.stopScrolling = true;
        this.skip += 5;
        this.showLoader = false;
        this.subscription = null;
      }, err => {
        console.log(err);
        this.subscription = null;
        this.showLoader = false;
      });
    }
  }

}
