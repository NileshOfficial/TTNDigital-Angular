import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';
import { LocalstorageService } from '../services/localstorage.service';

@Component({
  selector: 'ttnd-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['../styles/generic.styles.css', './auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authApi: AuthApiService, 
    private router: Router, 
    private currentPoint: ActivatedRoute,
    private localStorage: LocalstorageService) { }

  ngOnInit(): void {
    const code = this.currentPoint.snapshot.queryParams['code'];
    this.authApi.getAuthToken(code).subscribe(token => {
      this.localStorage.storeToken(token);
      this.router.navigate(['/home']);
    }, err => {
      this.router.navigate(['/']);
    });
  }

}
