import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environments';
import { Meta,Title } from "@angular/platform-browser";

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {
  categories: any;
  blogs: any;
  baseurl:any = environment.baseurl;
  p: number = 1;
  isLoading:any = true;
  constructor(private baseService:BaseService,private meta: Meta,private title: Title) { }
  ngOnInit() {
    this.initFunction();
  }

  initFunction(){
    const categories = this.baseService.get('/api/midoffice/list/collection/' + "tblcategories",{filter:"status",value:1});
    const blogs = this.baseService.get('/api/midoffice/list/collection/' + "tblblogs",{filter:"status",value:1});
    forkJoin([categories,blogs]).subscribe((res:any)=>{
      if(res[0]){
        if(res[0]["status"]){
          this.categories = res[0]["data"];
        }
      }
      if(res[1]){
        if(res[1]["status"]){
          this.blogs = res[1]["data"];
        }
      }
      this.isLoading = false
    });
  }

  searchCategoryById(idToFind: number): any | undefined {
    // console.log('catid:',idToFind)
    return this.categories.filter((item:any) => item._id == idToFind);
  }
}
