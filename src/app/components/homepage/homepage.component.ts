import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent {
  courses: any;
  categories: any;
  baseurl:any = environment.baseurl;
  trainers: any;
  isLoading:any = true;
  blogs: any;
  currencycode: any;
  constructor(private baseService:BaseService,private router: Router,private cart: CartService) { }

  ngOnInit() {
    this.initFunction();
  }

  initFunction(){
    const categories = this.baseService.get('/api/midoffice/list/collection/' + "tblcategories",{filter:"status",value:1});
    const trainers = this.baseService.get('/api/midoffice/list/collection/' + "tblusers",{filter:"status",value:1});
    const courses = this.baseService.get('/api/midoffice/list/collection/' + "tblcourses",{filter:"status",value:1});
    const blogs = this.baseService.get('/api/midoffice/list/collection/' + "tblblogs",{filter:"status",value:1});
    forkJoin([categories,trainers,courses,blogs]).subscribe((res:any)=>{
      if(res[0]){
        if(res[0]["status"]){
          this.categories = res[0]["data"];
        }
      }
      if(res[1]){
        if(res[1]["status"]){
          this.trainers = res[1]["data"];
        }
      }
      if(res[2]){
        if(res[2]["status"]){
          this.courses = res[2]["data"];
        }
      }
      if(res[3]){
        if(res[3]["status"]){
          this.blogs = res[3]["data"];
        }
      }
      this.isLoading = false
    });
  }

  searchCategoryById(idToFind: number): any | undefined {
    // console.log('catid:',idToFind)
    return this.categories.filter((item:any) => item._id == idToFind);
  }
  
  searchTraineryById(idToFind: number): any | undefined {
    return this.trainers.filter((item:any) => item._id == idToFind);
  }

  currencyConversion(amount:any){
    const selectedCurrency:any = localStorage.getItem('currency');
    const obj = JSON.parse(selectedCurrency);
    this.currencycode = obj.name
    return obj.value * amount;
  }

  addToBookmark(data:any){
    data['type'] = 'course';
    this.cart.addbookMark(data);
  }
}
