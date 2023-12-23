import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environments';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {
  pagenumber: any = 1;
  pagelimit: any = 10000000;
  sortby: any = "_id";
  sorttype: any = "DESC";
  userdata: any | null;
  transactions: any;
  p: number = 1;
  pt: number = 1;
  po: number = 1;
  pl: number = 1;
  bk: number = 1;
  view = 'profile';
  profiledata: any;
  baseurl:any = environment.baseurl;
  @ViewChild('fileInput') fileInput!: ElementRef;
  progress: any;
  courseslist: any;
  allcourses: any;
  isLoading = true;
  btnLoading = false;
  lessons: any = {};
  orders: any;
  memname: any;
  orderdetail: any = {};
  products: any;
  orderderditem: any;
  currencycode: any;
  address:any;
  formdata:any = {
    name:'',
    address:'',
    postcode:''
  };
  otpcode:any = {}
  warning:any = {};
  bookmarks: any;
  constructor(private baseService:BaseService,private cd:ChangeDetectorRef,private router:Router,private auth:AuthService,private cartService: CartService) { }

  ngOnInit() {
    this.initFunction()
  }

  initFunction(){
    if(this.auth.getUser()){
      this.userdata = this.auth.getUser();
      // this.userdata = JSON.parse(this.userdata);
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
    const alllessons = this.baseService.get('/api/base/getlessons/' + this.userdata._id,{})
    const orderlist = this.baseService.get('/api/base/item/' + this.userdata._id,{collection:"tblorders",param:"userid"})
    const products = this.baseService.get('/api/base/list/collection/tblproducts',{filter:"status",value:1})
    const address = this.baseService.get('/api/base/list/collection/tbladdress',{filter:"userid",value:this.userdata._id})
    forkJoin([transaction,profiledata,courseslist,allcourses,alllessons,orderlist,products,address]).subscribe((res:any)=>{
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
      if(res[4] && res[4]["data"].length > 0){
        this.lessons = res[4]["data"][0]["activeLessons"];
      }
      if(res[5]){
        this.orders = res[5]["data"];
      }
      if(res[6] && res[6]["data"].length > 0){
        this.products = res[6]["data"];
      }
      if(res[7]){
        this.address = res[7]["data"];
      }
      this.isLoading = false;
      this.membershipData();
    });
    this.getBookmark();
  }

  courseById(idToFind: number): any | undefined {
    return this.allcourses.filter((item:any) => item._id == idToFind);
  }

  productById(idToFind: number): any | undefined {
    return this.products.filter((item:any) => item._id == idToFind);
  }

  currencyConversion(amount:any){
    const selectedCurrency:any = localStorage.getItem('currency');
    const obj = JSON.parse(selectedCurrency);
    this.currencycode = obj.name
    return obj.value * amount;
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
      this.btnLoading = false;
      if(res["status"]){
        this.baseService.get('/api/base/item/' + this.userdata._id,{collection:'tblusers',param: '_id'}).subscribe((res:any)=>{
          if(res["status"]){
            this.auth.updateUser(res["data"][0]);
            Swal.fire("Success","Data Updated Successfully :)","success");
          }
        });
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

  membershipData(){
    if(this.profiledata?.memstatus && this.profiledata?.memstatus != 0){
      this.baseService.get('/api/midoffice/list/collection/tblsubscription',{filter:"_id",value:this.profiledata?.membership}).subscribe((res:any)=>{
        if(res['status']){
         this.memname = res['data'][0].name;
        }
      })
    }
  }

  cancelMembership(){
    const input:any = {
      _id : this.userdata?._id,
      memstatus : 0,
      membership : null,
      memduration : null,
      memenddate : null
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
    this.baseService.post('/api/midoffice/item/save/tblusers',output,{}).subscribe((res:any)=>{
      if(res["status"]){
        Swal.fire("Success","Membership Cancelled Successfully :)","success");
        this.userLogout();
      }else{
        Swal.fire("Failed","Something Went Wrong","warning");
      }
    });
  }

  getOrderData(id:any){
    if(id){
      this.baseService.get('/api/base/list/collection/tblorders',{filter:"_id",value:id}).subscribe((res:any)=>{
        if(res['status']){
          this.orderdetail = res['data'][0];
          this.orderderditem = this.orderdetail?.productid;
          this.orderderditem = JSON.parse(this.orderderditem);
        }
      })
    }
  }

  getAddressData(id:any){
    if(id){
      this.baseService.get('/api/base/list/collection/tbladdress',{filter:"_id",value:id}).subscribe((res:any)=>{
        if(res['status']){
          this.formdata = res['data'][0];
          this.formdata = this.formdata;
          this.formdata = JSON.parse(this.formdata);
        }
      });
    }
  }

  saveAddress(){
    this.formdata['userid'] = this.userdata?._id;
    const input = this.formdata;
  
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
    this.baseService.post('/api/midoffice/item/save/tbladdress',output,{}).subscribe((res:any)=>{
      if(res["status"]){
        Swal.fire("Success","Data Updated Successfully :)","success");
        this.initFunction();
      }else{
        Swal.fire("Failed","Something Went Wrong","warning");
      }
    });
  }

  userLogout(){
    this.auth.userLogout();
  }

  isObjectEmpty(obj: any): boolean {
    return Object.keys(obj).length === 0;
  }

  sendSMS(){
    let data = {
      phonenumber: this.profiledata['userphone']
    }
    this.baseService.post('/api/auth/sendSMS',data,{}).subscribe((res:any)=>{
      if(res["status"]){
        Swal.fire("Success","OTP Sent Success :)","success");
      }else{
        Swal.fire("Failed","Something Went Wrong","warning");
      }
    });
  }

  veryClient(){
    let data = {
      otp: this.otpcode,
      userphone: this.profiledata['userphone']
    }
    if(this.otpcode){
      this.baseService.post('/api/auth/verify',data,{}).subscribe((res:any)=>{
        if(res["status"]){
          Swal.fire("Success","Verification Successfull :)","success");
          this.userLogout();
        }else{
          Swal.fire("Failed","Wrong OTP","warning");
        }
        this.isLoading = false;
      });
    }
  }

  getBookmark(){
    if(this.cartService.getBookmark()){
      const data = this.cartService.getBookmark();
      this.bookmarks = data;
    }
  }

  removeBookmark(index:any){
    this.cartService.removeFromBookmark(index);
    if(this.cartService.getBookmark()){
      const data = this.cartService.getBookmark();
      this.bookmarks = data;
    }
  }

}
