import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';
declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  paramid: any;
  baseurl:any = environment.baseurl;
  coursedata: any;
  currencycode: any;
  feedata: any;
  coupons: any;
  validcoupon: any = false;
  total: any;

  options = {
      "key": "",
      "amount": "", 
      "currency":"",
      "order_id":"",
      "handler": function (response:any){
          var event = new CustomEvent("payment.success", 
              {
                  detail: response,
                  bubbles: true,
                  cancelable: true
              }
          );    
          window.dispatchEvent(event);
      }
      ,
      "prefill": {
      "name": "",
      "email": "",
      "contact": ""
      },
      "notes": {
      "address": ""
      },
      "theme": {
      "color": "#3399cc"
      }
  };
  formdata: any = {
    name:'',
    email:'',
    phone:''
  };
  userdata: any;

  constructor(private baseService:BaseService,private cd:ChangeDetectorRef,private route: ActivatedRoute) {
    const param = this.route.params.subscribe((res:any)=>{
      this.paramid = res.id
    });
  }

  ngOnInit() {
    this.initFunction();
  }

  initFunction(){
    if(localStorage.getItem('userdata')){
      const userdata:any = localStorage.getItem('userdata');
      this.userdata = JSON.parse(userdata);
    }
    if(this.paramid){
      let header = {
        collection: "tblcourses",
        param: "_id"
      }
      const courses = this.baseService.get(`/api/base/item/${this.paramid}`,header);
      const markups = this.baseService.get('/api/midoffice/list/collection/tblfees',{filter:"status",value:1})
      const coupons = this.baseService.get('/api/midoffice/list/collection/tblcoupons',{filter:"status",value:1})
      forkJoin([courses,markups,coupons]).subscribe((res:any)=>{
        if(res[0]){
          this.coursedata = res[0]["data"][0];
        }
        if(res[1]){
          this.feedata = res[1]["data"];
        }
        if(res[2]){
          this.coupons = res[2]["data"];
        }
        this.calculateTotal()
      });
    }
  }

  currencyConversion(amount:any){
    const selectedCurrency:any = localStorage.getItem('currency');
    const obj = JSON.parse(selectedCurrency);
    this.currencycode = obj.name
    return obj.value * amount;
  }

  couponApply(idToFind: any): any | undefined {
    this.validcoupon = undefined;
    const value = idToFind.value
    if(this.coupons.filter((item:any) => item.name == value).length == 1){
      this.validcoupon =  this.coupons.filter((item:any) => item.name == value);
      Swal.fire("Success","Coupon Applied Successfully :)","success");
      var arr:any = []
      this.validcoupon.forEach((item:any) => {
        if (item.type === 'fixed') {
          arr.push(parseFloat(item.value));
        } else if (item.type === 'percentage') {
          const percentageValue = (parseFloat(item.value) / 100) * this.coursedata?.offerprice;
          arr.push(percentageValue);
        }
        const value = arr.reduce((accumulator:any, currentValue:any) => accumulator + currentValue, 0);
        this.total = this.total - value;
      });
    }else{
      this.calculateTotal();
    }
  }

  calculateTotal(){
    let arr = []
    arr.push(parseFloat(this.coursedata?.offerprice));
    this.feedata.forEach((item:any) => {
      if (item.type === 'fixed') {
        arr.push(parseFloat(item.value));
      } else if (item.type === 'percentage') {
        const percentageValue = (parseFloat(item.value) / 100) * this.coursedata?.offerprice;
        arr.push(percentageValue);
      }
    });
    this.total = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

  }

  onSubmit(): void {
    const selectedCurrency:any = localStorage.getItem('currency');
    const obj = JSON.parse(selectedCurrency);
    var total = this.total*100;
    total = this.currencyConversion(total)
    this.baseService.get(`/api/base/item/1`,{collection: "tblpgconfig",param: "_id"}).subscribe((res:any) => {
        this.options.key = res["data"][0].apikey;
        this.options.amount = `${total}`; //paise
        this.options.currency = obj.name;
        this.options.prefill.name = this.formdata?.name;
        this.options.prefill.email = this.formdata?.email;
        this.options.prefill.contact = this.formdata?.phone;
        var rzp1 = new Razorpay(this.options);
        rzp1.open();
        const a = this;          
        rzp1.on('payment.failed', function (response:any){    
            // Todo - store this information in the server
            const input:any = {
              transid : response.error.metadata.payment_id,
              userid : a.userdata?._id,
              amount : a.total,
              currency : obj.name,
              productid : a.paramid,
              producttype : 'course',
              status: 0
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
            a.baseService.post('/api/midoffice/item/save/tbltransactions',output,{}).subscribe((res:any)=>{
              if(res["status"]){
                Swal.fire("Failed","Something Went Wrong","warning");
              }else{
                Swal.fire("Failed","Something Went Wrong","warning");
              }
            });
          }
        );
        } ,
        err => {
            // this.error = err.error.message;
        }
      );
    }

    @HostListener('window:payment.success', ['$event']) 
    onPaymentSuccess(event:any): void {
      const selectedCurrency:any = localStorage.getItem('currency');
      const obj = JSON.parse(selectedCurrency);
      const input:any = {
        transid : event.detail.razorpay_payment_id,
        userid : this.userdata?._id,
        amount : this.total,
        currency : obj.name,
        productid : this.paramid,
        producttype : 'course',
        status: 1
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
      this.baseService.post('/api/midoffice/item/save/tbltransactions',output,{}).subscribe((res:any)=>{
        if(res["status"]){
          const input:any = {
            userid : this.userdata?._id,
            courseid : this.paramid,
            coursename : this.coursedata?.name,
            status: 1
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
          this.baseService.post('/api/midoffice/item/save/tblusercourses',output,{}).subscribe((res:any)=>{
            if(res["status"]){
              this.baseService.post('/api/base/sendmail',{name:this.userdata?.name,emailid:this.userdata?.useremail,service:"purchase"},{}).subscribe((res:any)=>{});
              Swal.fire("Success","Payment Successfull :)","success");
            }else{
              Swal.fire("Failed","Something Went Wrong","warning");
            }
          });
        }else{
          Swal.fire("Failed","Something Went Wrong","warning");
        }
      });
    }


}
