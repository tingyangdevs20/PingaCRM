export class Users {
    constructor(
        public username: string,
        public firstname: string,
        public middlename: string,
        public lastname: string,
        public workphone: number,
        public mobilephone: number,
        public usertype: string,
        public password: string
    ){
        this.username = username;
        this.firstname = firstname;
        this.middlename = middlename;
        this.lastname = lastname;
        this.workphone = workphone;
        this.mobilephone = mobilephone;
        this.usertype = usertype;
        this.password = password;
    }
}
