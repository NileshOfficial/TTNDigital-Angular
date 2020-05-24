import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { faChevronUp, faChevronDown, IconDefinition, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ttnd-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['../styles/generic.styles.css', './dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  @Input() heading: string = '';
  @Input() options: Array<string | number> = [];
  @Input() bordered: boolean = false;
  @Input() select: number = null;
  @Output() selectChanged: EventEmitter<{ heading: string, idx: number }> = new EventEmitter();

  upArrowHead: IconDefinition = faChevronUp;
  downArrowHead: IconDefinition = faChevronDown;
  optionsVisible: boolean = false;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.optionsVisible = false;
    }
  }

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
    if (this.select)
      this.heading = this.options[this.select] as string;
  }

  toggleOptions() {
    this.optionsVisible = !this.optionsVisible;
  }

  updateHeading(heading: string, idx: number) {
    this.heading = heading;
    this.selectChanged.emit({ heading, idx });
  }
}
