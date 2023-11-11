import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { DataService } from '../../service/data.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'pa-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css'],
  animations: [
    trigger('animateOnAction', [
      transition('fadeOut<=>fadeIn', [
        animate(1500, style({ opacity: 1 })),
        animate(3000, style({ opacity: 1 })),
        animate(100, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class SetPasswordComponent implements OnInit {
  setPasswordForm: any;
  submitted = false;
  erStatus = false;
  passwordNotMatch = false;
  userN: any;
  groupId: any;
  apploginId: any;
  bindVar = 'fadeOut';
  classStatus: any;
  setPasswordStatus: any;
  failureResponse: any;

  constructor(private localStorage: LocalStorageService, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private router: Router, private dataService: DataService) { }

  fadeIn() {
    this.bindVar = 'fadeIn'
  }

  fadeOut() {
    this.bindVar = 'fadeOut'
  }

  animEnd() {
    if (this.classStatus == 'success') {
      this.router.navigate(['/login'])
      this.classStatus = ''
    }
    this.failureResponse = ''
    this.setPasswordStatus = ''
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(
      (res: any) => {
        if (res && res.data && res.data[0]) {
          this.userN = res.data[0].userName;
          this.groupId = res.data[0].groupId;
          this.apploginId = res.data[0].appLoginId;
        }
        if (res && res.status === 400) {
          const navigationExtras: NavigationExtras = {
            queryParams: {
              errMgs: res.error,
            },
          };
          this.router.navigate(['/login'], navigationExtras);
        }
      },
      (error) => {
        this.router.navigate(['/login']);
      }
    );

    this.setPasswordForm = this.formBuilder.group({
      userName: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required],
    });
  }


  setPassword(data: any) {
    const userName = this.userN;
    const newPassword = data['newPassword'];
    const confirmNewPassword = data['confirmNewPassword'];
    const src = this.activatedRoute.snapshot.queryParams['t']; // Access query parameter directly

    this.submitted = true;

    if (this.setPasswordForm.valid) {
      if (newPassword === confirmNewPassword) {
        this.submitted = false;
        this.passwordNotMatch = false;
        this.erStatus = false;

        this.dataService.changePassword(
          this.groupId,
          this.apploginId,
          userName,
          null,
          newPassword,
          confirmNewPassword,
          src
        ).subscribe(
          (resp) => {
            if (resp === true) {
              this.setPasswordStatus = 'success';
              this.classStatus = 'success';
              this.bindVar === 'fadeOut' ? this.fadeIn() : this.fadeOut(); // Check your fade methods
            }
          },
          (error) => {
            this.setPasswordStatus = 'fail';
            this.classStatus = 'fail';
            this.failureResponse = error.error;
            this.bindVar === 'fadeOut' ? this.fadeIn() : this.fadeOut(); // Check your fade methods
          }
        );
      } else {
        this.passwordNotMatch = true;
      }
    } else {
      this.erStatus = true;
    }
  }

  matchPassword(data: any) {
    const newPassword = data['newPassword'];
    const confirmNewPassword = data['confirmNewPassword'];

    if (newPassword !== confirmNewPassword) {
      this.passwordNotMatch = true;
    } else {
      this.passwordNotMatch = false;
    }
  }


}
