import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { faCircle, faThumbsUp, faThumbsDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { buzz } from '../interfaces/buzz.model';
import { BuzzApiService } from '../services/buzz-api.service';

@Component({
  selector: 'ttnd-buzz-post',
  templateUrl: './buzz-post.component.html',
  styleUrls: ['../styles/generic.styles.css', './buzz-post.component.css']
})
export class BuzzPostComponent implements OnInit, OnChanges {

  @Input('post') postInputObject: buzz;

  postData: object;

  dotIcon: IconDefinition = faCircle;
  likeIcon: IconDefinition = faThumbsUp;
  dislikeIcon: IconDefinition = faThumbsDown;

  liked: boolean = false;
  disliked: boolean = false;

  constructor(private buzzApi: BuzzApiService) { }

  ngOnInit(): void {
  }

  ngOnChanges(change: SimpleChanges) {
    this.postData = { ...this.postInputObject };
    const date = new Date(this.postData['date']);
    this.postData['date'] = date.getDate();
    this.postData['month'] = date.getMonth() + 1;
    this.postData['time'] = Date.now() - this.postInputObject.date;
  }

  toggleLike() {
    this.liked = !this.liked;
    if (this.liked) {
      if (this.disliked) {
        this.disliked = false;
        //update dislike -1
        this._updateReviews('dislikes', false);
        this.buzzApi.updateReview(this.postData['_id'], true, 'dislike').subscribe(data => console.log(data), err => console.log(err));
      }
      //update like +1
      this._updateReviews('likes');
      this.buzzApi.updateReview(this.postData['_id'], false).subscribe(data => console.log(data), err => console.log(err));
    } else {
      //update like -1
      this._updateReviews('likes', false);
      this.buzzApi.updateReview(this.postData['_id'], true).subscribe(data => console.log(data), err => console.log(err));
    }
  }

  toggleDislike() {
    this.disliked = !this.disliked;
    if (this.disliked) {
      if (this.liked) {
        this.liked = false;
        //update like -1
        this._updateReviews('likes', false);
        this.buzzApi.updateReview(this.postData['_id'], true).subscribe(data => console.log(data), err => console.log(err));
      }
      //update dislike +1
      this._updateReviews('dislikes');
      this.buzzApi.updateReview(this.postData['_id'], false, 'dislike').subscribe(data => console.log(data), err => console.log(err));
    } else {
      //update dislike -1
      this._updateReviews('dislikes', false);
      this.buzzApi.updateReview(this.postData['_id'], true, 'dislike').subscribe(data => console.log(data), err => console.log(err));
    }
  }

  _updateReviews(type: string, inc: boolean = true) {
    if (inc) {
      const newPostData = { ...this.postData }
      newPostData[type] += 1;
      this.postData = newPostData;
    } else {
      const newPostData = { ...this.postData }
      newPostData[type] -= 1;
      this.postData = newPostData;
    }
  }

}
