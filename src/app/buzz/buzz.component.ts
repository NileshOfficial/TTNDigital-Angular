import { Component, OnInit } from '@angular/core';
import { faPen, faChevronRight, faAt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { buzzFormData } from '../interfaces/buzz.model';
import { NgForm } from '@angular/forms';
import { BuzzApiService } from '../services/buzz-api.service';

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

  options: Array<Array<string>> = [['activity', 'Activity'], ['lost and found', 'Lost And Found']];
  images: Array<File> = [];
  category: string = '';

  posts = [];

  constructor(private buzzApi: BuzzApiService) { }

  ngOnInit(): void {
    this.buzzApi.getBuzzFeed().subscribe(data => { this.posts = data });
  }

  fileChange(event) {
    this.images = <Array<File>>event.target.files;
  }

  categoryChanged(event: { option: string, idx: number }) {
    this.category = event.option;
    console.log(event.option);
  }

  postBuzz(form: NgForm) {
    const images = this.images;
    const formData: any = new FormData();
    for (const file of images) {
      formData.append("files", file, file.name);
    }
    formData.append('description', form.value['description']);
    formData.append('category', this.category);

    this.buzzApi.postBuzz(formData).subscribe(data => console.log(data), err => console.log(err));
  }

}
