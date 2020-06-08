import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faSignOutAlt, faAngleRight, IconDefinition } from '@fortawesome/free-solid-svg-icons'
import { AuthApiService } from '../../services/auth-api.service';
import { TokenstoreService, LocalstorageService } from '../../services/util.service';

@Component({
  selector: 'ttnd-home',
  templateUrl: './home.component.html',
  styleUrls: ['../styles/generic.styles.css', './home.component.css']
})
export class HomeComponent implements OnInit {

  signOutIcon: IconDefinition = faSignOutAlt;
  rightArrowHead: IconDefinition = faAngleRight;

  adminStatus: boolean = false;

  constructor(private authApi: AuthApiService,
    private tokenstore: TokenstoreService,
    private localstore: LocalstorageService,
    private router: Router) { }

  ngOnInit(): void {
    this.adminStatus = this.tokenstore.token.admin;
  }

  logout() {
    const revokeTokens = () => {
      this.tokenstore.token = null;
      this.localstore.deleteToken();
      this.router.navigate(['/']);
    }

    this.authApi.logout().subscribe(revokeTokens, err => {
      if (err.errorCode && err.errorCode === "INVALID_AUTH_TOKEN")
        revokeTokens;
      else alert('request failed try again, later');
    });
  }

}
