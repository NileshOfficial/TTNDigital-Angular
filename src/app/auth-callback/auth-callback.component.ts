import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ttnd-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['../styles/generic.styles.css', './auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if(!this.activatedRoute.snapshot.queryParams['code'])
      this.router.navigate(['/', 'auth', 'login']);
  }

}
