import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DataService } from '../../service/data.service'
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'pa-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css'],
  animations: [
    trigger('animateOnAction', [
      transition('fadeOut<=>fadeIn', [
        animate(1500, style({opacity: 1})),
        animate(3000, style({opacity: 1})),
        animate(100, style({opacity: 0}))
      ])
    ])
  ]
})
export class ForgetPasswordComponent implements OnInit {
  validState: any;
  submitted=false;
  bindVar = 'fadeOut';
  forgetPassStatus: any;
  classStatus: any;
  failureResponse: any;
  constructor(private dataService: DataService) { }

  fadeIn() {
    this.bindVar = 'fadeIn'
  }
  
  fadeOut() {
    this.bindVar = 'fadeOut'
  }

  animEnd(e: any) {
    this.forgetPassStatus = ''
  }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    this.submitted=true;
    if(!f.valid){
      this.validState=true;
    }else{
      this.submitted=false;
      let groupId = this.dataService.getGroupId();
      let userName = f.value.userName.toString();
      this.dataService.forgotPassword(groupId, userName).subscribe(
        (resp) => {
          if(resp == true) {
            this.forgetPassStatus = 'success'
            this.classStatus = 'success'
            this.bindVar == 'fadeOut'?this.fadeIn():this.fadeOut()
            f.reset();
          }
        },
        (error) => {
          this.failureResponse = error.error
          this.forgetPassStatus = 'fail'
          this.classStatus = 'fail'
          this.bindVar == 'fadeOut'?this.fadeIn():this.fadeOut()
          f.reset()
        } 
      );
    }
    
     
  }
}
