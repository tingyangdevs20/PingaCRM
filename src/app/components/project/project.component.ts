import { Component, OnInit, Input } from '@angular/core';
import { LocalStorageService } from '../../../../node_modules/ngx-webstorage';

@Component({
  selector: 'tr.pa-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  @Input() project: any;
  constructor(private localStorage: LocalStorageService) { }

  ngOnInit() {
  }

  redirectToUser() {
    this.localStorage.store('fromProject', 1);
  }

  

}
