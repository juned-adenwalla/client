import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-course-view',
  templateUrl: './course-view.component.html',
  styleUrls: ['./course-view.component.css']
})
export class CourseViewComponent {
  paramid: any;
  lessondata: any;
  categories: any;
  lessonlist: any;
  isReadMore = true;
  baseurl:any = environment.baseurl;
  coursedata: any;
  isLoading:any = true;
  constructor(private baseService:BaseService,private cd:ChangeDetectorRef,private route: ActivatedRoute,private sanitizer: DomSanitizer) {
    const param = this.route.params.subscribe((res:any)=>{
      this.paramid = res.id
    });
  }

  ngOnInit() {
    this.initFunction()
  }

  showText() {
    this.isReadMore = !this.isReadMore;
  }

  initFunction(){
    const lessons = this.baseService.get('/api/base/list/collection/tbllessons',{filter:"courseid",value:this.paramid});
    const categories = this.baseService.get('/api/base/list/collection/tblcategories',{filter:"status",value:1});
    const courses = this.baseService.get('/api/base/list/collection/tblcourses',{filter:"_id",value:this.paramid});
    forkJoin([lessons,categories,courses]).subscribe((res:any)=>{
      console.log('res:',res)
      if(res[0]["status"]){
        this.lessonlist = res[0]["data"];
      }
      if(res[1]["status"]){
        this.categories = res[1]["data"];
      }
      if(res[2]["status"]){
        this.coursedata = res[2]["data"][0];
      }
      this.isLoading = false;
    });
  }

  getLessonData(id:any){
    this.lessondata = undefined
    this.baseService.get('/api/base/list/collection/tbllessons',{filter:"_id",value:id}).subscribe((res:any)=>{
      console.log('lessondata:',res);
      
      if(res["status"]){
        this.lessondata = res["data"][0];
        this.cd.detectChanges()
      }
    });
  }

  searchCategoryById(idToFind: number): any | undefined {
    // console.log('catid:',idToFind)
    if(idToFind){
      return this.categories.filter((item:any) => item._id == idToFind);
    }
  }

  shouldShowLesson(): boolean {
    const now = new Date();
    const startDate = new Date(this.lessondata?.startdate);
    const startTime = new Date(startDate);
    const [hours, minutes] = this.lessondata?.starttime.split(':');
    startTime.setHours(Number(hours), Number(minutes));

    // Calculate the time difference in milliseconds
    const timeDifference = startTime.getTime() - now.getTime();

    // Check if startdate is today and starttime is within 15 minutes
    return (
      startDate.toDateString() === now.toDateString() &&
      timeDifference > 0 && // Ensure the time is in the future
      timeDifference <= 15 * 60 * 1000 // 15 minutes in milliseconds
    );
  }
}
