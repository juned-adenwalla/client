import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  sitedata: any;
  contactdetail:any = {
    name:'',
    email:'',
    phone:'',
    message:''
  };
  warning:any = {
    name:false,
    email:false,
    phone:false,
    message:false
  }
  emailPattern: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  isLoading:any = false;
  constructor(private baseService:BaseService,private route: ActivatedRoute) {}
  ngOnInit() {
    this.baseService.get('/api/midoffice/list/collection/tblsiteconfig',{filter:"_id",value:1}).subscribe((res:any)=>{
      if(res["status"]){
        this.sitedata = res["data"][0];
      }
    })
  }

  submitForm(){
    if(this.validate()){
      if(this.isEmailValid()){
        console.log('coming herer1')
        const input = this.contactdetail;
  
        const columns = [];
        const values = [];
        
        for (const property in input) {
          if (input.hasOwnProperty(property)) {
            columns.push(property);
            values.push(input[property]);
          }
        }
        
        const output = {
          columns: columns,
          values: values
        };
        console.log(output)
        if(this.validate()){
        console.log('coming herer2')
          this.baseService.post('/api/midoffice/item/save/tblcontact',output,{}).subscribe((res:any)=>{
        console.log('res',res)
            if(res["status"]){
              Swal.fire("Success","Form Submitted Successfully :)","success");
            }else{
              Swal.fire("Failed","Something Went Wrong","warning");
            }
          });
        }
      }else{
        Swal.fire("Failed","Wrong Email Format","warning");
      }
    }
  }

  isEmailValid() {
    return this.emailPattern.test(this.contactdetail["email"]);
  }

  validate(){
    // Iterate through form fields and check for missing required fields
    for (const key of Object.keys(this.warning)) {
      if (!this.contactdetail[key]) {
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
