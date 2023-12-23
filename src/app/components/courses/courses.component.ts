import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent {
  isLoading = true;
  categories:any;
  courses: any;
  baseurl:any = environment.baseurl;
  trainers: any;
  pagenumber: any = 1;
  pagelimit: any = 10;
  sortby: any = "CreationDate";
  sorttype: any = "DESC";
  searchvalue: any;
  p: number = 1;
  currencycode: any;
  constructor(private baseService:BaseService) { }
  ngOnInit() {
    this.initFunction();
  }

  initFunction(){
    const categories = this.baseService.get('/api/midoffice/list/collection/' + "tblcategories",{filter:"status",value:1});
    const trainers = this.baseService.get('/api/midoffice/list/collection/' + "tblusers",{filter:"status",value:1});
    const courses = this.baseService.get('/api/midoffice/list/collection/' + "tblcourses",{filter:"status",value:1});
    forkJoin([categories,trainers,courses]).subscribe((res:any)=>{
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
          console.log('courses:',this.courses)
        }
      }
      this.isLoading = false;
    })
  }

  filterCourse(searchvalue:any){
    this.searchvalue = searchvalue;
    let header = {
      "pagenumber": this.pagenumber,
      "pagelimit": this.pagelimit,
      "sortby": this.sortby,
      "sorttype": this.sorttype,
      "searchby": "category",
      "searchvalue": searchvalue,
      "collection": "tblcourses"
    }
    this.baseService.get('/api/midoffice/list/all-data',header).subscribe((res:any)=>{
      if(res["status"]){
        this.courses = res["data"];
      }
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

}
