import { Component } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {
  baseurl:any = environment.baseurl;
  gallery:any;
  p: number = 1;
  isLoading:any = true
  constructor(private baseService:BaseService) { }
  
  ngOnInit() {
    this.isLoading = true;
    this.baseService.get('/api/midoffice/list/collection/' + "tblgalleries",{filter:"status",value:1}).subscribe((res:any)=>{
      if(res['status']){
        this.gallery = res['data'];
        this.isLoading = false
      }
    })
  }
}
