import { Component, OnInit } from '@angular/core';
import { faEnvelope, IconDefinition } from '@fortawesome/free-regular-svg-icons';
import { faLinkedinIn, faTwitter, faFacebookF, faYoutube } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'ttnd-help',
  templateUrl: './help.component.html',
  styleUrls: ['../styles/generic.styles.css', './help.component.css']
})
export class HelpComponent implements OnInit {

  mailIcon: IconDefinition = faEnvelope;
  linkedinIcon: IconDefinition = faLinkedinIn;
  twitterIcon: IconDefinition = faTwitter;
  facebookIcon: IconDefinition = faFacebookF;
  youtubeIcon: IconDefinition = faYoutube;

  constructor() { }

  ngOnInit(): void {
  }

}
