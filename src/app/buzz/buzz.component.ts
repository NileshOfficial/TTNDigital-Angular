import { Component, OnInit } from '@angular/core';
import { faPen, faChevronRight, faAt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { Icon } from '@fortawesome/fontawesome-svg-core';


@Component({
  selector: 'ttnd-buzz',
  templateUrl: './buzz.component.html',
  styleUrls: ['../styles/generic.styles.css', './buzz.component.css']
})
export class BuzzComponent implements OnInit {

  penIcon: IconDefinition = faPen;
  postIcon: IconDefinition = faChevronRight;
  imageIcon: IconDefinition = faImage;
  atIcon: IconDefinition = faAt;

  data = {
    description: "fksfkhgsfhsgfhjds skgfkhdsf gjhdshk gdsfhkgdsgfhdsg hjdsfgkdsfuerh flkdshflkdsdhfkjl hfdljkhdfkjlghkdsjfghljkfdshglk jdshgldsfh gldfhgjk hdkghhdsjk g kds kg hhkjghdsjklg hdskljghljkds hhglsdjkf gh lkdffsglkd gkjldsfhgljk dshg",
    category: 'fsdfsdf',
    images: ['fsdfdsf'],
    likes: 234,
    dislikes: 23,
    date: Date.now(),
    email: "nilesh.kumar@tothenew.com"
  }

  constructor() { }

  ngOnInit(): void {
  }

}
