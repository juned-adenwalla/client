import { Component } from '@angular/core';
import { BaseService } from './services/base.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  sitedata: any;
  currency: any | null;
  constructor(private baseService:BaseService,private router: Router) { }

  ngOnInit() {
    // console.log(this.userdata)
    this.initFunction();
  }

  initFunction(){
    this.baseService.get('/api/midoffice/list/collection/' + "tblsiteconfig",{filter:"_id",value:1}).subscribe((res:any)=>{
      if(res["status"]){
        this.sitedata = res["data"][0];
        console.log(this.sitedata)
      }
    });
  }
}
