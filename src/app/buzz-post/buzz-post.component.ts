import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { faCircle, faThumbsUp, faThumbsDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { buzz } from '../interfaces/buzz.model';

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

  constructor() { }



  ngOnInit(): void {
  }

  ngOnChanges(change: SimpleChanges) {
    this.postData = { ...this.postInputObject };
    const date = new Date(this.postData['date']);
    this.postData['date'] = date.getDate();
    this.postData['month'] = date.getMonth() + 1;
    this.postData['time'] = Date.now() - this.postInputObject.date;
  }

  toggleReview(type: string): void {
    if (type === 'like') {
      this.liked = !this.liked;
      if (this.liked) {
        this.disliked = false;
      }
    }
    else if (type === 'dislike') {
      this.disliked = !this.disliked;
      if (this.disliked)
        this.liked = false;
    }
  }

}
