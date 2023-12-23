import { ChangeDetectorRef, Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environments';
// import videojs from 'video.js';
import Swal from 'sweetalert2';

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
  completed: any;
  play: any;
  interval: any;
  time: any = 1;
  usercourses: any;
  constructor(private baseService:BaseService,private cd:ChangeDetectorRef,private route: ActivatedRoute,private sanitizer: DomSanitizer,private auth: AuthService,private router: Router) {
    const param = this.route.params.subscribe((res:any)=>{
      this.paramid = res.id
    });
  }

  ngOnInit() {
    this.initFunction();
  }

  showText() {
    this.isReadMore = !this.isReadMore;
  }

  initFunction(){
    const lessons = this.baseService.get('/api/base/list/collection/tbllessons',{filter:"courseid",value:this.paramid});
    const categories = this.baseService.get('/api/base/list/collection/tblcategories',{filter:"status",value:1});
    const courses = this.baseService.get('/api/base/list/collection/tblcourses',{filter:"_id",value:this.paramid});
    const completed = this.baseService.get('/api/base/list/collection/tblcompleted',{filter:"courseid",value:this.paramid});
    const userdata = this.baseService.get('/api/base/list/collection/tblusercourses', {filter: "userid",value: this.auth.getUser()._id})
    forkJoin([lessons,categories,courses,completed,userdata]).subscribe((res:any)=>{
      if(res[0]["status"]){
        this.lessonlist = res[0]["data"];
      }
      if(res[1]["status"]){
        this.categories = res[1]["data"];
      }
      if(res[2]["status"]){
        this.coursedata = res[2]["data"][0];
      }
      if(res[3]["status"]){
        this.completed = res[3]["data"];
      }
      if(res[3]["status"]){
        this.usercourses = res[4]["data"];
        if(!this.validateUser()){
          this.router.navigate(['/my-account']);
        }
      }
      this.isLoading = false;
    });
  }

  getLessonData(id:any){
    this.lessondata = undefined
    this.baseService.get('/api/base/list/collection/tbllessons',{filter:"_id",value:id}).subscribe((res:any)=>{
      if(res["status"]){
        this.lessondata = res["data"][0];
        this.startTimer();
        this.cd.detectChanges()
      }
    });
  }

  searchCategoryById(idToFind: number): any | undefined {
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
      timeDifference <= 0 || // Time has already passed
      (startDate.toDateString() === now.toDateString() &&
      timeDifference > 0 && // Ensure the time is in the future
      timeDifference <= 15 * 60 * 1000) // 15 minutes in milliseconds
    );
  }

  completeLesson(lessonid:any){
    let userdata:any = localStorage.getItem('userdata');
    userdata = JSON.parse(userdata);
    const input:any =  {
      lessonid: lessonid,
      courseid: this.paramid,
      userid: userdata._id
    }
  
    const columns = [];
    const values = [];
    
    for (const property in input) {
      if (input.hasOwnProperty(property)) {
        columns.push(property);
        values.push(input[property]);
      }
    }
    
    const output = {
      columns: columns,
      values: values
    };
    this.baseService.post('/api/midoffice/item/save/tblcompleted',output,{}).subscribe((res:any)=>{
      if(res["status"]){
        Swal.fire("Success","Data Updated Successfully :)","success");
      }else{
        Swal.fire("Failed","Something Went Wrong","warning");
      }
    });
  }

  doesLessonIdExist(lessonIdToCheck:any) {
    return this.completed.some((item:any) => item.lessonid === lessonIdToCheck);
  }

  showCheckbox(){
    if(this.lessondata?.type == 'recorded' && this.time > 10){
      return false;
    }else{
      return true;
    }
  }

  downloadFile(fileData: string): void {
    // Fetch the file using the provided URL
    fetch(fileData)
    .then((response) => response.blob())
    .then((blob) => {
      // Create an object URL for the Blob
      const url = window.URL.createObjectURL(blob);

      // Create an anchor element
      const link = document.createElement('a');
      link.href = url;

      // Determine the file name based on a timestamp or other identifier
      const timestamp = Date.now();
      link.download = `file_${timestamp}`;

      // Trigger the download
      link.click();

      // Clean up the object URL
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => {
      console.error('Error fetching the file:', error);
    });
  }

  startTimer() {
    this.play = true;
    this.interval = setInterval(() => {
      this.time++;
    },1000)
  }

  validateUser() {
    const user = this.auth.getUser();
    if (user && user._id) {
        for (const element of this.usercourses) {
          if (element.status == 1 && element.courseid == this.paramid) {
            return true;
          }
        }
    }
    return false;
  }
}
