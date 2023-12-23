import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formdata: any = {};
  inputType:any = 'password';
  isLoading:any = false;
  forgetpass:any = false;
  warning:any = {
    useremail:false,
    password:false
  }
  constructor(private baseService:BaseService,private router:Router,private auth:AuthService) {}

  ngOnInit(){
    if(this.auth.getUser()){
      this.router.navigate(["/my-account"])
    }
  }

  togglePasswordVisibility() {
    this.inputType = this.inputType === 'password' ? 'text' : 'password';
  }

  signinUser(){
    if(this.validate()){
      this.isLoading = true;
      this.baseService.post('/api/auth/login',this.formdata,{}).subscribe((res:any)=>{
        if(res["status"]){
          this.auth.userLogin(res.user);
          this.isLoading = false;
          this.router.navigate(['/my-account']);
        }else{
          Swal.fire("Failed",res["message"],"warning");
          this.isLoading = false;
        }
      });
    }
  }

  resetPassword(){
    this.isLoading = true;
    this.baseService.post('/api/auth/forget-password',{email:this.formdata['useremail']},{}).subscribe((res:any)=>{
      if(res["status"]){
        Swal.fire("Success","Please Check your Inbox","success");
      }else{
        Swal.fire("Failed",res["message"],"warning");
        this.isLoading = false;
      }
    });
  }

  validate(){
    // Iterate through form fields and check for missing required fields
    for (const key of Object.keys(this.warning)) {
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
