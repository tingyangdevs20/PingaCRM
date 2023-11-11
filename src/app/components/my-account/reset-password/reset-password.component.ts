import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormBuilder } from '../../../../../node_modules/@angular/forms';
import { DataService } from '../../../service/data.service';
import { LocalStorageService } from '../../../../../node_modules/ngx-webstorage';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'pa-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
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
export class ResetPasswordComponent implements OnInit {
  profile: any;
  changePasswordForm: any;
  submitted = false;
  erStatus = false;
  passwordNotMatch = false;
  bindVar = 'fadeOut';
  resetPassStatus: any;
  failureResponse: any;
  classStatus: any

  constructor(private dataService: DataService, private formBuilder: FormBuilder, private localStorage: LocalStorageService) { }

  fadeIn() {
    this.bindVar = 'fadeIn'
  }
  
  fadeOut() {
    this.bindVar = 'fadeOut'
  }

  animEnd(e: any) {
    this.resetPassStatus = ''
  }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      existingPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    })       
  }

  changePassword(data: any) {   
    let existingPassword = data['existingPassword'];
    let newPassword = data['newPassword'];
    let confirmNewPassword = data['confirmNewPassword']
    let groupId = this.dataService.getGroupId();
    let source = 'cp';
    let appLoginId = this.localStorage.retrieve('appLoginId')
    let username = this.localStorage.retrieve('username')
    this.submitted = true;
    
    if (this.changePasswordForm.valid) {
      if (newPassword === confirmNewPassword) {
        this.submitted = false;
        this.passwordNotMatch = false;
        this.erStatus = false;
        this.dataService.changePassword(groupId, appLoginId, username, existingPassword, newPassword, confirmNewPassword, source).subscribe(
          (resp) => {
            if(resp == true) {
              this.resetPassStatus = 'success'
              this.classStatus = 'success'
              this.bindVar == 'fadeOut'?this.fadeIn():this.fadeOut()
            }
          },
          (error) => {
            this.resetPassStatus = 'fail'
            this.classStatus = 'fail'
            this.failureResponse = error.error
            this.bindVar == 'fadeOut'?this.fadeIn():this.fadeOut()
          },
          () => {
            this.changePasswordForm.reset();
          }
        )
      } else {
        this.passwordNotMatch = true;
      }
    } else {
      this.erStatus = true;
    }
  }


  matchPassword(data: any){
    let newPassword = data['newPassword'];
    let confirmNewPassword = data['confirmNewPassword'];
    if (newPassword != confirmNewPassword) {
      this.passwordNotMatch = true;
    }else{
      this.passwordNotMatch = false;
    }
  }

}
