import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UnitService } from '../../service/common/unit.service';

@Component({
  selector: 'pa-unit-detail',
  templateUrl: './unit-detail.component.html',
  styleUrls: ['./unit-detail.component.css']
})
export class UnitDetailComponent implements OnInit {
  id: any;
  unitDetail = {
    buyerID: null,
    unitNo: "",
    companyName: "",
    towerName: "",
    appDate: "",
    area: null,
    applicationNo: "",
    applicantName:"",
    projectId: null,
    projectName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    zip: null,
    module: null
  }; 
  constructor(private activatedRoute: ActivatedRoute, private unitService: UnitService) {    
   }

  ngOnInit() {      
    this.activatedRoute.url.subscribe(
      (res) => {
        this.id = res[1].path;
      }
    );
    this.unitService.getUnit(this.id).subscribe(
      (data: any) => {
        this.unitDetail = data[0];
      }
    );
  }

}
