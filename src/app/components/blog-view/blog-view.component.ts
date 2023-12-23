import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-blog-view',
  templateUrl: './blog-view.component.html',
  styleUrls: ['./blog-view.component.css']
})
export class BlogViewComponent {
  paramid: any;
  blogdata: any;
  categories: any;
  baseurl:any = environment.baseurl;
  constructor(private baseService:BaseService,private route: ActivatedRoute) {
    const param = this.route.params.subscribe((res:any)=>{
      this.paramid = res.id
    });
  }
  ngOnInit() {
    this.initFunction();
  }

  initFunction(){
    let header = {
      collection: "tblblogs",
      param: "_id"
    }
    const courses = this.baseService.get(`/api/base/item/${this.paramid}`,header);
    const categories = this.baseService.get('/api/midoffice/list/collection/tblcategories',{filter:"status",value:1});
    forkJoin([courses,categories]).subscribe((res:any)=>{
      console.log('res:',res)
      if(res[0]["status"]){
        this.blogdata = res[0]["data"][0];
      }
      if(res[1]["status"]){
        this.categories = res[1]["data"];
      }
    });
  }

  searchCategoryById(idToFind: number): any | undefined {
    // console.log('catid:',idToFind)
    if(idToFind){
      return this.categories.filter((item:any) => item._id == idToFind);
    }
  }
}
