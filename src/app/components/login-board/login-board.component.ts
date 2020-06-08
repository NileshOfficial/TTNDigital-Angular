import { Component, OnInit } from '@angular/core';
import { IconDefinition, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { HttpParams } from '@angular/common/http';
import * as config from '../../config/login.conf';

@Component({
  selector: 'ttnd-login-board',
  templateUrl: './login-board.component.html',
  styleUrls: ['../styles/generic.styles.css', './login-board.component.css']
})
export class LoginBoardComponent implements OnInit {

  googleIcon: IconDefinition = faGoogle;

  googleLoginUri = config.oauthCodeUri;

  constructor() { }

  ngOnInit(): void {
    this.googleLoginUri = this.googleLoginUri + `?${this.loginConfig()}`
  }

  private loginConfig(): string {
    const conf = {
      client_id: config.clientId,
      redirect_uri: config.redirect_uri,
      scope: config.scope.join(' '),
      response_type: config.response_type,
      access_type: config.access_type,
      prompt: config.prompt
    }

    let configParams = new HttpParams();
    for (let key in conf) {
      configParams = configParams.set(key, conf[key]);
    }

    return configParams.toString();
  }

}
