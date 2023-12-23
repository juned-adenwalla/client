import { Component } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  baseurl:any = environment.baseurl;
  gallery: any;
  p: number = 1;

  constructor(private baseService:BaseService) { }
  
  ngOnInit() {
    this.baseService.get('/api/midoffice/list/collection/' + "tblnews",{filter:"status",value:1}).subscribe((res:any)=>{
      if(res['status']){
        this.gallery = res['data'];
      }
    })
  }
}
