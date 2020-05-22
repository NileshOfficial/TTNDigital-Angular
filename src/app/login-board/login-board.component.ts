import { Component, OnInit } from '@angular/core';
import { IconDefinition, faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'ttnd-login-board',
  templateUrl: './login-board.component.html',
  styleUrls: ['../styles/generic.styles.css', './login-board.component.css']
})
export class LoginBoardComponent implements OnInit {

  googleIcon: IconDefinition = faGoogle;
  constructor() { }

  ngOnInit(): void {
  }

}
