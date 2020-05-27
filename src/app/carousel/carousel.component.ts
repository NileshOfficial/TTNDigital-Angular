import { Component, OnInit, Input } from '@angular/core';
import { faChevronLeft, faChevronRight, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ttnd-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  @Input() images: Array<string> = [];
  prevIcon: IconDefinition = faChevronLeft;
  nextIcon: IconDefinition = faChevronRight;
  current: number = 0;
  constructor() { }

  ngOnInit(): void {
  }

  prev() {
    if (this.current > 0)
      this.current--;
  }

  next() {
    if ((this.current + 1) < this.images.length)
      this.current++;
  }

}
