import { Component, OnInit, Input, TemplateRef, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../service/data.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Validators, FormControl, FormBuilder } from '../../../../node_modules/@angular/forms';
import { BuyerService } from '../../service/common/buyer.service';
import { Router, ActivatedRoute } from '../../../../node_modules/@angular/router';
import { LocalStorageService } from '../../../../node_modules/ngx-webstorage';

@Component({
  selector: 'tr.pa-cbuyer',
  templateUrl: './cbuyer.component.html',
  styleUrls: ['./cbuyer.component.css']
})
export class CbuyerComponent implements OnInit {
  @Input() cbuyer: any;
  @Input() index: any;
  @Output() refreshParent = new EventEmitter();
  @Output() fadeInState = new EventEmitter();
  @Output() onChecked = new EventEmitter();

  htmlContent: any;
  checkState = false;
  public modalRef: BsModalRef | undefined;
  mobNo = 100;
  config: Object = {
    addRemoveLinks: true
  };
  /* options: Object = {
    height: 150,
    placeholderText: 'Message',
    quickInsertButtons: ['disable'],
    paragraphFormat: {
      N: 'Normal',
      H1: 'Heading 1',
      H2: 'Heading 2',
      H3: 'Heading 3',
      H4: 'Heading 4',
      H5: 'Heading 5',
      H6: 'Heading 6'
    },
    toolbarButtons: ['paragraphFormat', '|', 'bold', 'italic', '|', 'formatOL', 'formatUL', 'outdent', 'indent', '|', 'insertLink', '|', 'insertImage', '|', 'html']
  } */
  editorConfig = {
    "editable": true,
    "spellcheck": true,
    "height": "auto",
    "minHeight": "500",
    "width": "auto",
    "minWidth": "0",
    "enableToolbar": true,
    "showToolbar": true,
    "placeholder": "Enter text here...",
    "toolbar": [
      ["bold", "italic", "underline"],
      ["fontName", "fontSize", "color"],
      ["undo", "redo"],
      ["paragraph", "blockquote", "removeBlockquote", "horizontalLine", "orderedList", "unorderedList"]
    ]
  }
  smsOptions: Object = {
    height: 150,
    placeholderText: 'Message',
    quickInsertButtons: ['disable'],
    paragraphFormat: {},
    toolbarButtons: []
  }

  sendMail: any;
  formEmail: any;
  formMessage: any;
  formSubject: any;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  submitted = false;
  smsSubmitted = false;
  erStatus = false;
  erSmsStatus = false

  smsForm: any;
  message: any;
  mobileNo = '';
  // appLoginIdArray: Array<any>;
  errorResponse: any;

  emailId: any;
  mobilePhone: any;

  constructor(private dataService: DataService, private modalService: BsModalService, private buyerService: BuyerService, private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute, private localStorage: LocalStorageService) { }

  ngOnInit() {
    this.dataService.checkStatus.subscribe(
      (resp) => {
        this.checkState = resp;
      }
    )

    this.sendMail = this.formBuilder.group({
      formSubject: ['', Validators.required],
      formMessage: new FormControl(),
      formEmail: ['', [Validators.required, Validators.email, Validators.pattern(this.emailPattern)]]
    })

    this.smsForm = this.formBuilder.group({
      mobileNo: ['', Validators.required],
      message: new FormControl()
    })

  }

  openSendEmail(e: any, sendEmail: TemplateRef<any>) {
    e.preventDefault();
    this.modalRef = this.modalService.show(sendEmail)
    this.sendMail.reset();
    this.emailId = this.cbuyer.emaiID
  }

  openSendSms(e: any, sendSms: TemplateRef<any>) {
    e.preventDefault();
    this.modalRef = this.modalService.show(sendSms)
    this.mobilePhone = this.cbuyer.mobileNo
  }

  sendBuyerID(e: any, buyerId: any) {
    e.preventDefault();
    this.dataService.setCbuyerId(buyerId);
  }

  openActivateUser(e: any, activateUser: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(activateUser)
  }

  openDeactivateUser(e: any, deactivateUser: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(deactivateUser)
  }

  openResetPassword(e: any, resetPassword: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(resetPassword)
  }

  getBuyerIds(e: any, appLoginId: any) {
    let checkStatus = e.target.checked;

    this.onChecked.emit({
      status: checkStatus,
      id: appLoginId
    })
  }

  activate(appLoginId: any) {
    this.dataService.activateUser(appLoginId).subscribe(
      (resp) => {
        ('Success status :' + resp)
        if (resp == true) {
          let pn = this.localStorage.retrieve('pageNum')
          this.refreshParent.emit({
            response: resp,
            pageNum: pn
          });
          this.fadeInState.emit({
            successStatus: true,
            successType: 'activate'
          })
        }
      },
      (error) => {
        (error)
        this.errorResponse = error.error
        this.fadeInState.emit({
          successStatus: false,
          successType: 'activate',
          errorResponse: this.errorResponse
        })
      }
    )
  }

  deactivate(appLoginId: any) {
    this.dataService.deactivateUser(appLoginId).subscribe(
      (resp) => {
        ('Success status :' + resp)
        if (resp == true) {
          let pn = this.localStorage.retrieve('pageNum')
          this.refreshParent.emit({
            response: resp,
            pageNum: pn
          });
          this.fadeInState.emit({
            successStatus: true,
            successType: 'deactivate'
          })
        }
      },
      (error) => {
        (error)
        this.errorResponse = error.error
        this.fadeInState.emit({
          successStatus: false,
          successType: 'deactivate',
          errorResponse: this.errorResponse
        })
      }
    )
  }

  resetPass(appLoginId: any) {
    this.dataService.resetPassword(appLoginId).subscribe(
      (resp) => {
        ('Success status :' + resp)
        if (resp == true) {
          this.fadeInState.emit({
            successStatus: true,
            successType: 'resetPassEmailSent'
          })
        }
      },
      (error) => {
        (error)
        this.errorResponse = error.error
        this.fadeInState.emit({
          successStatus: false,
          successType: 'resetPassEmailNotSent',
          errorResponse: this.errorResponse
        })
      }
    ),
      () => {
        if (this.modalRef)
          this.modalRef?.hide()
      }
  }

  sendNewMail(d: any, apploginId: any) {
    this.formEmail = d.formEmail;
    this.formMessage = d.formMessage;
    this.formSubject = d.formSubject;
    this.submitted = true;
    if (this.sendMail.valid) {
      this.submitted = false;
      this.erStatus = false;
      this.buyerService.sendManualEmailFromBuyer(this.formEmail, this.formSubject, this.formMessage, apploginId).subscribe(
        (resp) => {
          ('Status success: ' + resp)
          if (resp == true) {
            this.fadeInState.emit({
              successStatus: true,
              successType: 'mailSent'
            })
          }
          if (this.modalRef)
            this.modalRef?.hide();
          this.sendMail.reset();
          this.cbuyer.emaiID = this.emailId
        },
        (error) => {
          (error)
          this.errorResponse = error.error
          this.fadeInState.emit({
            successStatus: false,
            successType: 'mailNotSent',
            errorResponse: this.errorResponse
          })
          if (this.modalRef)
            this.modalRef?.hide();
          this.sendMail.reset();
          this.cbuyer.emaiID = this.emailId
        }
      )
    } else {
      this.erStatus = true;
    }
  }

  numberOnly(keyCode: number) {
    return (keyCode == 8 || keyCode == 0 || keyCode == 13) ? null : keyCode >= 48 && keyCode <= 57
  }

  sendNewSms(d: any, apploginId: any) {
    this.message = d.message;
    this.mobileNo = d.mobileNo;
    (d)
    this.smsSubmitted = true;

    if (this.smsForm.valid) {
      this.smsSubmitted = false;
      this.erSmsStatus = false;
      this.buyerService.sendManualSms(this.message, this.mobileNo, apploginId).subscribe(
        (resp) => {
          ("Success status: " + resp);
          if (resp == true) {
            this.fadeInState.emit({
              successStatus: true,
              successType: 'smsSent'
            })
          }
          if (this.modalRef)
            this.modalRef?.hide();
          this.smsForm.reset();
          this.cbuyer.mobileNo = this.mobilePhone
        },
        (error) => {
          (error)
          this.errorResponse = error.error
          this.fadeInState.emit({
            successStatus: false,
            successType: 'smsNotSent',
            errorResponse: this.errorResponse
          })
          if (this.modalRef)
            this.modalRef?.hide();
          this.smsForm.reset();
          this.cbuyer.mobileNo = this.mobilePhone
        }
      )
    } else {
      this.erSmsStatus = true;
    }
  }

  goTo(unit: any, e: any) {
    e.preventDefault();
    (e);
    this.router.navigate(['../unit-detail', unit.buyerId], { relativeTo: this.activatedRoute })
  }

  resetForm(formName: string) {
    switch (formName) {
      case 'smsForm':
        this.smsForm.reset();
        this.cbuyer.mobileNo = this.mobilePhone
        this.submitted = false;
        this.erStatus = false;
        break;
      case 'sendMail':
        this.sendMail.reset();
        this.cbuyer.emaiID = this.emailId
        this.submitted = false;
        this.erStatus = false;
        break;
    }
  }

  clearEmailContent() {
    this.sendMail.reset()
    this.cbuyer.emaiID = this.emailId
  }

  clearSmsContent() {
    this.smsForm.reset()
    this.cbuyer.mobileNo = this.mobilePhone
  }
}
