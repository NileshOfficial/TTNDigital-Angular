import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthApiService } from '../services/auth-api.service';
import { LocalstorageService } from '../services/localstorage.service';
import { TokenstoreService } from '../services/tokenstore.service';

@Component({
  selector: 'ttnd-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['../styles/generic.styles.css', './auth-callback.component.css']
})
export class AuthCallbackComponent implements OnInit {

  constructor(private authApi: AuthApiService,
    private router: Router,
    private currentPoint: ActivatedRoute,
    private localStorage: LocalstorageService,
    private tokenstore: TokenstoreService) { }

  ngOnInit(): void {
    const code = this.currentPoint.snapshot.queryParams['code'];
    this.authApi.getAuthToken(code).subscribe(token => {

      this.authApi.isAdmin(token.access_token, token.id_token).subscribe(result => {
        token['admin'] = result.admin;
        
        this.tokenstore.token = token;
        this.localStorage.storeToken(token);
        this.router.navigate(['/home']);
      }, err => {
        console.log(err);
        this.router.navigate(['/']);
      });

    }, err => {
      console.log(err);
      this.router.navigate(['/']);
    });
  }

}
