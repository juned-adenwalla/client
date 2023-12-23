import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';

@Component({
  selector: 'app-thank-you',
  templateUrl: './thank-you.component.html',
  styleUrls: ['./thank-you.component.css']
})
export class ThankYouComponent {
  isLoading: any;
  message: any;
  constructor(private baseService:BaseService,private router:Router) { }
  
  ngOnInit() {
    this.isLoading = true;
    this.baseService.get('/api/midoffice/list/collection/tblpgconfig',{filter:"_id",value:1}).subscribe((res:any)=>{
      if(res['status']){
        this.message = res['data'][0]['success_msg'];
        this.isLoading = false
      }
    })
  }

  btnClick(){
    this.router.navigate(['/my-account'])
  }
}
