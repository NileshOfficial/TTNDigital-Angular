import { Component, OnInit, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { faChevronUp, faChevronDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'ttnd-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['../../styles/generic.styles.css', './dropdown.component.css']
})
export class DropdownComponent implements OnInit {

  @Input() heading: string = '';
  @Input() placeholder: string = '';
  @Input() options: Array<Array<string>> = [];
  @Input() bordered: boolean = false;
  @Input() select: number = null;
  @Input() noSelect: boolean = false;
  @Output() selectChanged: EventEmitter<{ option: string, idx: number }> = new EventEmitter();

  upArrowHead: IconDefinition = faChevronUp;
  downArrowHead: IconDefinition = faChevronDown;
  optionsVisible: boolean = false;
  currentColor: string = 'initial';

  @HostListener('document:click', ['$event'])
  clickout(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.optionsVisible = false;
    }
  }

  constructor(private eRef: ElementRef) { }

  ngOnInit(): void {
    if (this.select !== null) {
      this.heading = this.options[this.select][1] as string;
      const color = this.options[this.select][2];
      this.currentColor = color || 'initial';
    }
  }

  toggleOptions() {
    this.optionsVisible = !this.optionsVisible;
  }

  updateHeading(heading: Array<string>, idx: number) {
    if (idx === 0 && this.noSelect) {
      this.heading = '';
      this.selectChanged.emit({ option: this.options[idx][0], idx });
    } else {
      this.heading = heading[1];
      const option = this.options[idx];
      this.selectChanged.emit({ option: option[0], idx });
    }
    this.optionsVisible = false;
    const color = this.options[idx][2];
    this.currentColor = color || 'initial';

  }

  reset(color?: string) {
    this.heading = '';
    this.currentColor = color || 'inherit';
  }
}