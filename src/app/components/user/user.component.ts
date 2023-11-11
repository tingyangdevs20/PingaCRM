import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  Output,
  EventEmitter
} from '@angular/core';
import {
  BsModalRef,
  BsModalService
} from 'ngx-bootstrap/modal';
import {
  Validators,
  FormControl,
  FormBuilder
} from '../../../../node_modules/@angular/forms';
import {
  UserService
} from '../../service/common/user.service';
import {
  DataService
} from '../../service/data.service';
import { LocalStorageService } from '../../../../node_modules/ngx-webstorage';

@Component({
  selector: 'tr.pa-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @Input() user: any;
  @Output() refreshParent = new EventEmitter();
  @Output() fadeInState = new EventEmitter();

  public modalRef!: BsModalRef;
  htmlContent: any;
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
  formSubject: any;
  formMessage: any;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  submitted = false;
  smsSubmitted = false;
  erStatus = false;
  erSmsStatus = false;

  smsForm: any;
  mobileNo = '';
  message: any;
  errorResponse: any;

  emailId: any;
  mobilephone: any;

  constructor(private modalService: BsModalService, private userService: UserService, private dataService: DataService, private formBuilder: FormBuilder, private localStorage: LocalStorageService) {}

  ngOnInit() {
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
    this.emailId = this.user.emailid;
  }

  openSendSms(e: any, sendSms: TemplateRef<any>) {
    e.preventDefault();
    this.modalRef = this.modalService.show(sendSms)
    this.mobilephone = this.user.mobilephone
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

  activate(appLoginId: any) {
    this.dataService.activateUser(appLoginId).subscribe(
      (resp) => {

        if (resp) {
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
        if (resp) {
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
        this.errorResponse = error.error
        this.fadeInState.emit({
          successStatus: false,
          successType: 'deactivate',
          errorResponse: this.errorResponse
        })
      }
    )
  }

  sendNewMail(d: any, appLoginId: any) {
    this.formEmail = d.formEmail;
    this.formMessage = d.formMessage;
    this.formSubject = d.formSubject;
    this.submitted = true;

    if (this.sendMail.valid) {
      this.submitted = false;
      this.erStatus = false;

      this.userService.sendManualEmail(this.formEmail, this.formSubject, this.formMessage, appLoginId).subscribe(
        (resp) => {
          if (resp) {
            this.fadeInState.emit({
              successStatus: true,
              successType: 'mailSent'
            })
          }
          this.modalRef?.hide()
          this.sendMail.reset();
          this.user.emailid = this.emailId
        },
        (error) => {
          this.errorResponse = error.error
          this.fadeInState.emit({
            successStatus: false,
            successType: 'mailNotSent',
            errorResponse: this.errorResponse
          })
          this.modalRef?.hide()
          this.sendMail.reset();
          this.user.emailid = this.emailId
        },
        () => {
          this.modalRef?.hide();
          this.sendMail.reset();
          this.user.emailid = this.emailId
        }
      )
    } else {
      this.erStatus = true;
    }
  }

  resetPass(appLoginId: any) {
    this.dataService.resetPassword(appLoginId).subscribe(
      (resp) => {
        if (resp) {
          this.fadeInState.emit({
            successStatus: true,
            successType: 'resetPassEmailSent'
          })
        }
      },
      (error) => {
        this.errorResponse = error.error
        this.fadeInState.emit({
          successStatus: false,
          successType: 'resetPassEmailNotSent',
          errorResponse: this.errorResponse
        })
      }
    )
  }

  numberOnly(keyCode: number) {
    return (keyCode == 8 || keyCode == 0 || keyCode == 13) ? null : keyCode >= 48 && keyCode <= 57
  }

  sendNewSms(d: any, apploginId: any) {
    this.message = d.message;
    this.mobileNo = d.mobileNo;
    this.smsSubmitted = true;

    if (this.smsForm.valid) {
      this.smsSubmitted = false;
      this.erSmsStatus = false;
      this.userService.sendManualSms(apploginId, this.message, this.mobileNo).subscribe(
        (resp) => {
          if (resp == 0) {
            this.fadeInState.emit({
              successStatus: true,
              successType: 'smsSent'
            })
          }
          this.modalRef?.hide()
          this.smsForm.reset();
          this.user.mobilephone = this.mobilephone
        },
        (error) => {
          this.errorResponse = error.error
          this.fadeInState.emit({
            successStatus: false,
            successType: 'smsNotSent',
            errorResponse: this.errorResponse
          })
          this.modalRef?.hide()
          this.smsForm.reset();
          this.user.mobilephone = this.mobilephone
        },
        () => {
          this.modalRef?.hide()
          this.smsForm.reset();
          this.user.mobilephone = this.mobilephone
        }
      )
    } else {
      this.erSmsStatus = true;
    }
  }

  onEdit(appLoginID: any) {
    this.userService.getUser(appLoginID).subscribe(
      (data) => {
        this.userService.userInfo.next(data)
      }
    )
  }

  resetForm(formName: any) {
    switch (formName) {
      case 'smsForm':
        this.smsForm.reset();
        this.user.mobilephone = this.mobilephone
        this.submitted = false;
        this.erStatus = false;
        break;
      case 'sendMail':
        this.sendMail.reset();
        this.user.emailid = this.emailId
        this.submitted = false;
        this.erStatus = false;
        break;
    }
  }

  clearEmailContent() {
    this.sendMail.reset()
    this.user.emailid = this.emailId
  }

  clearSmsContent() {
    this.smsForm.reset()
    this.user.mobilephone = this.mobilephone
  }

}
