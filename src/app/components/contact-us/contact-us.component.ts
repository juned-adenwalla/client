import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent {
  sitedata: any;
  constructor(private baseService:BaseService,private route: ActivatedRoute) {}
  ngOnInit() {
    this.baseService.get('/api/midoffice/list/collection/tblsiteconfig',{filter:"_id",value:1}).subscribe((res:any)=>{
      if(res["status"]){
        this.sitedata = res["data"][0];
      }
    })
  }
}
