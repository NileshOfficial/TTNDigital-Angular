import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ttnd-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {
  
  @Input() animation: string;
  @Input() outerDimension: number;
  @Input() innerDimension: number;

  constructor() { }

  ngOnInit(): void {
  }

  setOuterHeightWidth() {
    return {
      'height.px': this.outerDimension,
      'width.px': this.outerDimension
    }
  }

  setInnerHeightWidth() {
    return {
      'height.px': this.innerDimension,
      'width.px': this.innerDimension
    }
  }
}
