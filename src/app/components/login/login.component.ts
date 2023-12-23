import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  formdata: any = {};
  warning:any = {
    useremail:false,
    password:false
  }
  constructor(private baseService:BaseService,private router:Router) {}

  ngOnInit(){
    if(localStorage.getItem("userdata")){
      this.router.navigate(["/my-account"])
    }
  }

  signinUser(){
    if(this.validate()){
      this.baseService.post('/api/auth/login',this.formdata,{}).subscribe((res:any)=>{
        console.log(res)
        if(res["status"]){
          localStorage.setItem('access_token', res.token);
          localStorage.setItem('userdata', JSON.stringify(res.user));
          this.router.navigate(['/my-account']);
        }else{
          Swal.fire("Failed",res["message"],"warning");
        }
      });
    }
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
