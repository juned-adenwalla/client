import { Component, resolveForwardRef } from '@angular/core';
import { Router } from '@angular/router';
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
  isOtp:any = false
  warning:any = {
    username:false,
    useremail:false,
    userphone:false,
    password:false
  }
  phone: any;
  constructor(private baseService:BaseService,private router:Router) {}

  ngOnInit(){
    if(localStorage.getItem("userdata")){
      this.router.navigate(["/my-account"])
    }
  }

  userSignup(){
    console.log(this.validate())
    if(this.validate()){
      this.baseService.post('/api/auth/signup',this.formdata,{}).subscribe((res:any)=>{
        console.log('res:',res)
        if(res["status"]){
          this.isOtp = true;
          this.phone = this.formdata["userphone"];
        }else{
          Swal.fire("Failed","Something Went Wrong","warning");
        }
      });
    }
  }

  veryClient(){
    const concatenatedValue = Object.values(this.otpdata).join("");
    const intValue = parseInt(concatenatedValue, 10);
    let data = {
      otp: intValue,
      userphone: this.phone
    }
    if(this.otpdata){
      this.baseService.post('/api/auth/verify',data,{}).subscribe((res:any)=>{
        if(res["status"]){
          this.baseService.post('/api/base/sendmail',{name:this.formdata?.username,emailid:this.formdata?.useremail,service:"register"},{}).subscribe((res:any)=>{});
          this.router.navigate(['/login']);
        }else{
          Swal.fire("Failed","Wrong OTP","warning");
        }
      });
    }
    console.log(this.otpdata);
  }

  resendSMS(){
    let data = {
      phonenumber: this.phone
    }
    this.baseService.post('/api/auth/sendSMS',data,{}).subscribe((res:any)=>{
      console.log(res)
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
