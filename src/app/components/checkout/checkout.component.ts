import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { CartService } from 'src/app/services/cart.service';
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
  users: any;
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
  formdata: any = {}
  userdata: any;
  items: any;
  couponCode:any;
  warning: any = {};
  membershipdata: any = {};
  showmemedisc: any;
  address: any;
  country: any;
  shipingmarkup: any;
  stateslist: any;
  selectedCountry:any;
  isLoading:any = false;
  constructor(private baseService:BaseService,private cd:ChangeDetectorRef,private route: ActivatedRoute,private router:Router,private cart:CartService,private auth:AuthService) {}

  ngOnInit() {
    this.items = this.cart.getCart();
    if(this.items.length < 1){
      this.router.navigate(['/my-account']);
    }
    this.initFunction();
  }

  initFunction(){
    if(this.auth.getUser()){
      const userdata:any = this.auth.getUser();
      this.userdata = userdata;
      this.formdata = this.userdata;
      delete this.formdata["userotp"]
      delete this.formdata["userverify"]
      delete this.formdata["userpassword"]
      delete this.formdata["userimage"]
      delete this.formdata["usertype"]
      delete this.formdata["memstatus"]
      delete this.formdata["membership"]
      delete this.formdata["memduration"]
      delete this.formdata["memenddate"]
      delete this.formdata["status"]
      this.formdata["country"] = '';
      this.formdata["town"] = '';
      delete this.formdata["CreationDate"]
      delete this.formdata["CreationDate"]
      delete this.formdata["UpdationDate"]
    }
    if(this.items){
      const markups = this.baseService.get('/api/midoffice/list/collection/tblfees',{filter:"status",value:1})
      const users = this.baseService.get('/api/midoffice/list/collection/tblusers',{filter:"_id",value:this.userdata?._id})
      const address = this.baseService.get('/api/base/list/collection/tbladdress',{filter:"userid",value:this.userdata?._id})
      const country = this.baseService.get('/api/base/list/collection/tblcountry',{filter:"status",value:1});
      forkJoin([markups,users,address,country]).subscribe((res:any)=>{
        if(res[0]){
          this.feedata = res[0]["data"];
        }
        if(res[1]){
          this.users = res[1]["data"][0];
        }
        if(res[2]){
          this.address = res[2]["data"];
        }
        if(res[3]){
          this.country = res[3]["data"];
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
    var arr:any = []
    if(idToFind){
      this.baseService.post(`/api/base/get-coupon/${idToFind}`,{data:this.items},{}).subscribe((res:any)=>{
        if(res['status']){
          this.validcoupon = res['data'];
          if (res['data']['type'] == 'fixed') {
            arr.push(res['data']['value']);
          } else if (res['data']['type'] == 'percentage') {
            let offerPrices:any = [];
            let types = [];
            for (const item of this.items) {
              if (res['data']['service'].includes(item.type) && item.offerprice) {
                  offerPrices.push(parseFloat(item.offerprice));
              }
              if (item.type) {
                  types.push(item.type);
              }
            }
            const total = offerPrices.reduce((accumulator:any, currentValue:any) => accumulator + currentValue, 0);
            const percentageValue = (res['data']['value'] / 100) * total;
            arr.push(percentageValue);
          }
          const value = arr.reduce((accumulator:any, currentValue:any) => accumulator + currentValue, 0);
          this.total = this.total - value;  
        }else{
          Swal.fire("Failed","Invalid Coupon :(","warning");
        }
      })
    }else{
      this.validcoupon = null;
      this.calculateTotal();
    }
  }

  cancelCoupon(){
    this.validcoupon = null;
    this.calculateTotal();
  }

  calculateTotal(){
    const totalOfferPrice = this.items.reduce((total:any, item:any) => total + parseFloat(item.offerprice), 0);
    let arr = []
    arr.push(parseFloat(totalOfferPrice));
    this.feedata.forEach((item:any) => {
      if (item.type === 'fixed') {
        arr.push(parseFloat(item.value));
      } else if (item.type === 'percentage') {
        const percentageValue = (parseFloat(item.value) / 100) * totalOfferPrice;
        arr.push(percentageValue);
      }
    });
    this.total = arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    this.membershipCalculate()
  }

  onSubmit(): void {
    this.isLoading = true;
    var validate:any = [];
    console.log('Formdata:',this.formdata);
    Object.keys(this.formdata).forEach((key:any)=>{
      if(!this.formdata[key] || this.formdata[key] == ''){
        this.warning[key] = true;
        validate.push(false);
        this.cd.detectChanges();
      }else{
        this.warning[key] = false
        validate.push(true);
        this.cd.detectChanges();
      }
    });
    if(!validate.includes(false)){
      const selectedCurrency:any = localStorage.getItem('currency');
      const obj = JSON.parse(selectedCurrency);
      var total = this.total*100;
      total = this.currencyConversion(total)
      this.baseService.get(`/api/base/item/1`,{collection: "tblpgconfig",param: "_id"}).subscribe((res:any) => {
        if(res["data"][0]['status'] && res["data"][0]['offline_status'] != 'active'){
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
                  a.isLoading = false;
                  Swal.fire("Failed","Something Went Wrong","warning");
                }else{
                  Swal.fire("Failed","Something Went Wrong","warning");
                  a.isLoading = false;
                }
              });
            }
          );
        }
        if(res["data"][0]['offline_status'] == 'active'){
          this.purchaseOrder()
        }
          } ,
          err => {
            console.log(err.error.message);
          }
        );
    }else{
      this.isLoading = false;
    }
  }

  membershipCalculate(){
    if(this.users?.memstatus && this.users?.memstatus == 1){
      this.showmemedisc = false;
      this.baseService.get('/api/midoffice/list/collection/tblsubscription',{filter:"_id",value:this.users?.membership}).subscribe((res:any)=>{
        if(res['status']){
          this.membershipdata = res['data'][0];
          let services = JSON.parse(this.membershipdata['services']);
          let discount = this.membershipdata['discount'];
          let discounttype = this.membershipdata['type'];
          const types:any = [];
          const offerPrices:any = [];
          for (const item of this.items) {
            if (services.includes(item.type) && item.offerprice) {
              offerPrices.push(parseFloat(item.offerprice));
              this.showmemedisc = true;
            }
            if (item.type) {
                types.push(item.type);
            }
          }
          let arr = [];
          const total = offerPrices.reduce((accumulator:any, currentValue:any) => accumulator + currentValue, 0);
          if(services.some((item:any) => types.includes(item))){
            if (discounttype == 'flat') {
              arr.push(discount);
            } else {
              const percentageValue = (discount / 100) * total;
              arr.push(percentageValue);
            }
            const value = arr.reduce((accumulator:any, currentValue:any) => accumulator + currentValue, 0);
            this.total = this.total - value;  
          }
        }
      })
    }
  }

  @HostListener('window:payment.success', ['$event']) 
  onPaymentSuccess(event:any): void {
    const selectedCurrency:any = localStorage.getItem('currency');
    const obj = JSON.parse(selectedCurrency);
    const input:any = {
      transid : event.detail.razorpay_payment_id ? event.detail.razorpay_payment_id : event,
      userid : this.userdata?._id,
      amount : this.total,
      currency : obj.name,
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
        let status = [];
        let productids:any = [];
        this.items.forEach((element:any) =>{
          if(element?.type == 'course'){
            const input:any = {
              userid : this.userdata?._id,
              courseid : element?._id,
              coursename : element?.name,
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
                status.push(true);
              }else{
                status.push(false);
              }
            });
          }
          if(element?.type == 'membership'){
            // Get the current date
            const currentDate = new Date();

            // Calculate the date for 1 month from the current date
            const endDate = new Date(currentDate);
            endDate.setMonth(currentDate.getMonth() + 1);
            const formattedEndDate = endDate.toISOString().split('T')[0];
            const input:any = {
              _id : this.userdata?._id,
              memstatus : 1,
              membership : element?._id,
              memduration : element?.duration,
              memenddate : formattedEndDate
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
              console.log('Response:',res)
              if(res["status"]){
                status.push(true);
              }else{
                status.push(false);
              }
            });
          }
          if(element?.type == 'product'){
            productids.push(element?._id);
          }   
        });
        if(productids.length > 0){
          const input:any = {
            username : this.formdata["name"],
            userphone : this.formdata["userphone"],
            useremail : this.formdata["useremail"],
            userid : this.userdata?._id,
            productid : JSON.stringify(productids),
            country : this.formdata["country"]?.name,
            address : this.formdata["address"],
            town : this.formdata["town"]?.name,
            postcode : this.formdata["postcode"],
            message : this.formdata["message"],
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
          this.baseService.post('/api/midoffice/item/save/tblorders',output,{}).subscribe((res:any)=>{
            if(res["status"]){
              status.push(true);
            }else{
              status.push(false);
            }
          });
        }
        this.isLoading = false;
        this.cart.flushAll();
        this.baseService.post('/api/base/sendmail',{name:this.userdata?.name,emailid:this.userdata?.useremail,service:"purchase"},{}).subscribe((res:any)=>{});
        this.router.navigate(['/thank-you'])
      }else{
        Swal.fire("Failed","Something Went Wrong","warning");
        this.isLoading = false;
      }
    });
  }

  removeItem(index:any){
    if(index){
      this.cart.removeFromCart(index);
      this.items = this.cart.getCart();
      this.calculateTotal();
      this.cd.detectChanges();
    }
  }

  selectedAddress(data:any){
    this.formdata['address'] = data?.address;
    this.formdata['postcode'] = data?.postcode;
  }

  getState(selectedCountry: any) {
    if(this.shipingmarkup){
      this.total = this.total - this.shipingmarkup;
      this.shipingmarkup = undefined;
    }
    const newdata = selectedCountry;
    this.cd.detectChanges();
    this.baseService.get('/api/base/list/collection/tblstate', { filter: "country", value: newdata?._id }).subscribe((res: any) => {
      if (newdata?.isstate != 1 && this.items.some((product:any) => product.type === "product" && product.producttype === "physical")) {
        this.shipingmarkup = selectedCountry?.price;
        this.total = this.total + parseFloat(this.shipingmarkup);
      }
      if(res['status']){
        this.stateslist = res['data'];
      }
    });

  }

  getShipping(data:any){
    if(this.shipingmarkup){
      this.total = this.total - this.shipingmarkup;
      this.shipingmarkup = undefined;
    }
    this.cd.detectChanges();
    if (data?.price && this.items.some((product:any) => product.type === "product" && product.producttype === "physical")) {
      this.shipingmarkup = data?.price;
      this.total = this.total + parseFloat(this.shipingmarkup);
    }
  }


  purchaseOrder(){
    const selectedCurrency:any = localStorage.getItem('currency');
    const obj = JSON.parse(selectedCurrency);
    const input:any = {
      transid : this.generateRandomId(6),
      userid : this.userdata?._id,
      amount : this.total,
      currency : obj.name,
      status: 3
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
        this.baseService.post('/api/email/transaction/' + res['_id'],{},{}).subscribe((res:any)=>{});
        let status = [];
        let productids:any = [];
        this.items.forEach((element:any) =>{
          if(element?.type == 'course'){
            const input:any = {
              userid : this.userdata?._id,
              courseid : element?._id,
              coursename : element?.name,
              status: 2
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
                this.baseService.post('/api/email/course/' + res['_id'],{},{}).subscribe((res:any)=>{});
                status.push(true);
              }else{
                status.push(false);
              }
            });
          }
          if(element?.type == 'membership'){
            // Get the current date
            const currentDate = new Date();

            // Calculate the date for 1 month from the current date
            const endDate = new Date(currentDate);
            endDate.setMonth(currentDate.getMonth() + 1);
            const formattedEndDate = endDate.toISOString().split('T')[0];
            const input:any = {
              _id : this.userdata?._id,
              memstatus : 2,
              membership : element?._id,
              memduration : element?.duration,
              memenddate : formattedEndDate
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
                this.baseService.post('/api/email/membership/' + this.userdata?._id,{},{}).subscribe((res:any)=>{});
                status.push(true);
              }else{
                status.push(false);
              }
            });
          }
          if(element?.type == 'product'){
            productids.push(element?._id);
          }   
        });
        if(productids.length > 0){
          const input:any = {
            username : this.formdata["name"],
            userphone : this.formdata["userphone"],
            useremail : this.formdata["useremail"],
            userid : this.userdata?._id,
            productid : JSON.stringify(productids),
            country : this.formdata["country"]?.name,
            address : this.formdata["address"],
            town : this.formdata["town"]?.name,
            postcode : this.formdata["postcode"],
            message : this.formdata["message"],
            status: 2
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
          this.baseService.post('/api/midoffice/item/save/tblorders',output,{}).subscribe((res:any)=>{
            if(res["status"]){
              this.baseService.post('/api/email/purchase/' + res['_id'],{},{}).subscribe((res:any)=>{});
              status.push(true);
            }else{
              status.push(false);
            }
          });
        }
        this.cart.flushAll();
        this.isLoading = false;
        this.router.navigate(['/thank-you'])
      }else{
        Swal.fire("Failed","Something Went Wrong","warning");
        this.isLoading = false;
      }
    });
  }

  generateRandomId(length:any) {
    const charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let randomId = "";
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomId += charset[randomIndex];
    }
  
    return randomId;
  }

}
