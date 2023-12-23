import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environments';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  isLoading:any = true;
  paramid: any;
  baseurl:any = environment.baseurl;
  categories: any;
  trainers: any;
  sitedata: any;
  lessons: any;
  currencycode: any;
  productdata: any;
  reviews: any = [];
  formdata:any = {
    review:'#'
  };
  p: number = 1;
  products: any;
  constructor(private baseService:BaseService,private route: ActivatedRoute,private cart: CartService) {
    const param = this.route.params.subscribe((res:any)=>{
      this.paramid = res.id
    });
  }
  ngOnInit() {
    this.initFunction();
  }

  initFunction(){
    let header = {
      collection: "tblproducts",
      param: "_id"
    }
    const product = this.baseService.get(`/api/base/item/${this.paramid}`,header);
    const categories = this.baseService.get('/api/midoffice/list/collection/tblcategories',{filter:"status",value:1});
    const siteconfig = this.baseService.get('/api/midoffice/list/collection/tblsiteconfig',{filter:"_id",value:1});
    const userreviews = this.baseService.get('/api/midoffice/list/collection/tblreviews',{filter:"product_id",value:this.paramid});
    forkJoin([product,categories,siteconfig,userreviews]).subscribe((res:any)=>{
      console.log('res:',res)
      if(res[0]["status"]){
        this.productdata = res[0]["data"][0];
        if(this.productdata){
          this.baseService.get('/api/midoffice/list/collection/tblproducts',{filter:"category",value:this.productdata?.category}).subscribe((res:any)=>{
            if(res["status"]){
              this.products = res["data"];
            }
          });
        }
      }
      if(res[1]["status"]){
        this.categories = res[1]["data"];
      }
      if(res[2]["status"]){
        this.sitedata = res[2]["data"][0];
      }
      if(res[3]["status"]){
        let reviews = res[3]["data"];
        reviews.forEach((element:any) => {
          if(element.status == 1){
            this.reviews.push(element);
          }
        });
      }
      this.isLoading = false;
    });
  }

  searchCategoryById(idToFind: number): any | undefined {
    // console.log('catid:',idToFind)
    if(idToFind){
      return this.categories.filter((item:any) => item._id == idToFind);
    }
  }

  currencyConversion(amount:any){
    const selectedCurrency:any = localStorage.getItem('currency');
    const obj = JSON.parse(selectedCurrency);
    this.currencycode = obj.name
    return obj.value * amount;
  }

  addToCart(data:any){
    data['type'] = 'product';
    if(data){
      this.cart.addToCart(data);
    }
  }

  submitReview(){
    this.formdata["status"] = 2;
    this.formdata["product_id"] = this.paramid;
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
    this.baseService.post('/api/midoffice/item/save/tblreviews',output,{}).subscribe((res:any)=>{
      if(res["status"]){
        Swal.fire("Success","Review Submited Successfully :)","success");
        this.initFunction();
      }else{
        Swal.fire("Failed","Something Went Wrong","warning");
      }
    });
  }

}
