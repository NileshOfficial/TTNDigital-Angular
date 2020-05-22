import { Component, OnInit } from '@angular/core';
import { faSignOutAlt, faAngleRight, IconDefinition } from '@fortawesome/free-solid-svg-icons'

@Component({
  selector: 'ttnd-home',
  templateUrl: './home.component.html',
  styleUrls: ['../styles/generic.styles.css', './home.component.css']
})
export class HomeComponent implements OnInit {

  signOutIcon: IconDefinition = faSignOutAlt;
  rightArrowHead: IconDefinition = faAngleRight;

  constructor() { }

  ngOnInit(): void {
  }

}
