import { Component, ViewChild, resolveForwardRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  formdata:any = {}
  otpdata:any = {}
  isOtp:any = false;
  inputType:any = 'password'
  warning:any = {
    username:false,
    first_name:false,
    last_name:false,
    useremail:false,
    userphone:false,
    password:false
  }
  phone: any;
  isLoading: boolean = false;
  terms:any = false
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  constructor(private baseService:BaseService,private router:Router,private auth:AuthService) {}

  ngOnInit(){
    if(this.auth.getUser()){
      this.router.navigate(["/my-account"])
    }
  }

  moveToNext(nextInput: any) {
    if (nextInput) {
      nextInput.focus();
    }
  }

  userSignup(){
    if(this.validate()){
      if(this.isEmailValid()){
        this.isLoading = true;
        this.baseService.post('/api/auth/signup',this.formdata,{}).subscribe((res:any)=>{
          if(res["status"]){
            this.baseService.post('/api/email/register/' + res['_id'],{},{}).subscribe((res:any)=>{});
            this.isOtp = true;
            this.phone = this.formdata["userphone"];
            this.isLoading = false;
          }else{
            Swal.fire("Failed",res["message"],"warning");
            this.isLoading = false;
          }
        });
      }else{
        Swal.fire("Failed","Wrong Email Format","warning");
      }
    }
  }

  isEmailValid() {
    return this.emailPattern.test(this.formdata["useremail"]);
  }

  togglePasswordVisibility() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  veryClient(){
    this.isLoading = true;
    const concatenatedValue = Object.values(this.otpdata).join("");
    const intValue = parseInt(concatenatedValue, 10);
    let data = {
      otp: intValue,
      userphone: this.phone
    }
    if(this.otpdata){
      this.baseService.post('/api/auth/verify',data,{}).subscribe((res:any)=>{
        if(res["status"]){
          Swal.fire("Success","Signup Successfull :)","success");
          this.router.navigate(['/login']);
        }else{
          Swal.fire("Failed","Wrong OTP","warning");
        }
        this.isLoading = false;
      });
    }
  }

  resendSMS(){
    let data = {
      phonenumber: this.phone
    }
    this.baseService.post('/api/auth/sendSMS',data,{}).subscribe((res:any)=>{
      if(res["status"]){
        Swal.fire("Success","OTP Sent Success :)","success");
      }else{
        Swal.fire("Failed","Something Went Wrong","warning");
      }
    });
  }

  validate(){
    // Iterate through form fields and check for missing required fields
    for (const key of Object.keys(this.warning)) {
      console.log(this.formdata[key])
      if (!this.formdata[key]) {
        this.warning[key] = true;
      }else{
        this.warning[key] = false;
      }
    }
    if(Object.values(this.warning).some(value => value === true)){
      return false;
    }else{
      return true;
    }
  }
}
