import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';

@Component({
  selector: 'ttnd-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['../styles/generic.styles.css', './auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authApi: AuthApiService, private router: Router, private currentPoint: ActivatedRoute) { }

  ngOnInit(): void {
    const code = this.currentPoint.snapshot.queryParams['code'];
    this.authApi.getAuthToken(code).subscribe(data => {
      this.router.navigate(['/home']);
    }, err => {
      console.log(err);
      this.router.navigate(['/']);
    });
  }

}
