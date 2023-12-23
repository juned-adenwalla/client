import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environments';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  pagenumber: any = 1;
  pagelimit: any = 10;
  sortby: any = "CreationDate";
  sorttype: any = "DESC";
  userdata: any | null;
  transactions: any;
  p: number = 1;
  view = 'profile';
  profiledata: any;
  baseurl:any = environment.baseurl;
  @ViewChild('fileInput') fileInput!: ElementRef;
  progress: any;
  courseslist: any;
  allcourses: any;
  isLoading = true;
  constructor(private baseService:BaseService,private cd:ChangeDetectorRef,private router:Router) { }

  ngOnInit() {
    this.initFunction()
  }

  initFunction(){
    if(localStorage.getItem("userdata")){
      this.userdata = localStorage.getItem("userdata");
      this.userdata = JSON.parse(this.userdata);
      console.log(this.userdata)
    }
    let header = {
      "pagenumber": this.pagenumber,
      "pagelimit": this.pagelimit,
      "sortby": this.sortby,
      "sorttype": this.sorttype,
      "searchby": "userid",
      "searchvalue": this.userdata._id,
      "collection": "tbltransactions"
    }
    const transaction = this.baseService.get('/api/midoffice/list/all-data',header);
    const profiledata = this.baseService.get('/api/base/item/' + this.userdata._id,{collection:"tblusers",param:"_id"})
    const courseslist = this.baseService.get('/api/base/item/' + this.userdata._id,{collection:"tblusercourses",param:"userid"})
    const allcourses = this.baseService.get('/api/base/list/collection/tblcourses',{filter:"status",value:1})
    forkJoin([transaction,profiledata,courseslist,allcourses]).subscribe((res:any)=>{
      console.log(res)
      if(res[0]){
        this.transactions = res[0]["data"];
      }
      if(res[1]){
        this.profiledata = res[1]["data"][0];
      }
      if(res[2]){
        this.courseslist = res[2]["data"];
      }
      if(res[3]){
        this.allcourses = res[3]["data"];
      }
      this.isLoading = false;
    });
  }

  courseById(idToFind: number): any | undefined {
    console.log('courses:',this.allcourses)
    return this.allcourses.filter((item:any) => item._id == idToFind);
  }

  saveData(){
    console.log(this.profiledata)
    const input = this.profiledata;
  
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
    this.baseService.post('/api/midoffice/item/save/tblusers',output,{}).subscribe((res:any)=>{
      if(res["status"]){
        Swal.fire("Success","Data Updated Successfully :)","success");
      }else{
        Swal.fire("Failed","Something Went Wrong","warning");
      }
    });
  }

  openFileInput(){
    this.fileInput.nativeElement.click();
  }

  uploadFiles(event:any,input:any){
    const file = event.target.files[0];
    this.baseService.fileUpload('users', file).subscribe((res: HttpEvent<any>) => {
      if (res.type === HttpEventType.UploadProgress && res.total) { // Check 'type' property and 'total' existence
        // Calculate the upload progress percentage
        this.progress = Math.round(res.loaded / res.total * 100);
        console.log(`Upload Progress: ${this.progress}%`);
      } else if (res.type === HttpEventType.Response) { // Check 'type' property
        const responseBody = res.body;

        if (responseBody) {
          // Assuming responseBody is an object, you can access its properties here
          this.profiledata[input] = responseBody.file_path;
          this.cd.detectChanges();
        }else{
          Swal.fire("Failed","Something Went Wrong","warning");
        }
      }
    });
  }

  userLogout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
