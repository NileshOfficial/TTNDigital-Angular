import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { faAngleUp, faAngleDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ttnd-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['../styles/generic.styles.css', './dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  @Input() heading: string = '';
  @Input() options: Array<string | number> = [];
  @Input() bordered: boolean = false;
  @Output() selected: EventEmitter<string | number> = new EventEmitter();

  upArrowHead: IconDefinition = faAngleUp;
  downArrowHead: IconDefinition = faAngleDown;
  optionsVisible: boolean = false;

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.optionsVisible = false;
    }
  }

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
  }

  toggleOptions() {
    this.optionsVisible = !this.optionsVisible;
  }

  updateHeading(heading: string) {
    this.heading = heading;
    this.selected.emit(this.heading);
  }
}
