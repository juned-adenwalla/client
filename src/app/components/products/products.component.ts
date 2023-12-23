import { ChangeDetectorRef, Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BaseService } from 'src/app/services/base.service';
import { CartService } from 'src/app/services/cart.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {
  isLoading = true;
  categories:any;
  courses: any;
  baseurl:any = environment.baseurl;
  trainers: any;
  sortby: any = "_id";
  sorttype: any = "DESC";
  searchvalue: any;
  p: number = 1;
  c: number = 1;
  currencycode: any;
  products: any;
  banners: any;
  best_products: any = [];
  new_products: any = [];
  search:any = false;
  selectedRange:any;
  lowestPrice: any;
  highestPrice: any;
  constructor(private baseService:BaseService,private cart: CartService,private cd: ChangeDetectorRef) { }
  ngOnInit() {
    this.initFunction();
  }

  initFunction(){
    const categories = this.baseService.get('/api/midoffice/list/collection/' + "tblcategories",{filter:"status",value:1});
    const products = this.baseService.get('/api/midoffice/list/collection/' + "tblproducts",{filter:"status",value:1});
    const banners = this.baseService.get('/api/midoffice/list/collection/' + "tblbanners",{filter:"status",value:1});
    forkJoin([categories,products,banners]).subscribe((res:any)=>{
      console.log(res)
      if(res[0]){
        if(res[0]["status"]){
          this.categories = res[0]["data"];
        }
      }
      if(res[1]){
        if(res[1]["status"]){
          this.products = res[1]["data"];
          const result:any = this.findHighestAndLowestOfferPrice(this.products);
          this.lowestPrice = result.lowestOfferPrice;
          this.highestPrice = result.highestOfferPrice;
          this.products.forEach((element:any) => {
            if(element.best_selling == 1){
              this.best_products.push(element);
            }else{
              this.new_products.push(element);
            }
          });
        }
      }
      if(res[2]){
        if(res[2]["status"]){
          this.banners = res[2]["data"];
        }
      }
      this.isLoading = false;
    })
  }

  filterCourse(searchvalue:any = undefined,searchby:any = undefined,offerprice:any = undefined){
    console.log(offerprice)
    let header = {};
    if(searchvalue){
      header = {
        "sortby": this.sortby,
        "sorttype": this.sorttype,
        "searchby": searchby,
        "searchvalue": searchvalue,
        "collection": "tblproducts"
      }
    }
    if(offerprice){
      header = {
        "sortby": this.sortby,
        "sorttype": this.sorttype,
        "offerprice": offerprice,
        "collection": "tblproducts"
      }
    }else{
      header = {
        "collection": "tblproducts",
        "sortby": this.sortby,
        "sorttype": this.sorttype,
      };
    }
    console.log(header)
    this.baseService.get('/api/base/list/all-data',header).subscribe((res:any)=>{
      console.log(res)
      if(res["status"]){
        this.search = true;
        this.products = res["data"];
      }
    });
  }

  orderByOffer(){

  }

  onSortChange(event: any) {
    let selectedValue = '';
    if(event.target){
      selectedValue = event.target.value
    }
    if (selectedValue === 'latest') {
      // Sort by latest
      this.sortby = "_id";
      this.sorttype = "DESC";
      this.filterCourse();
    } else if (selectedValue == 'lowToHigh') {
      // Sort by price: low to high
      this.sortby = "offerprice";
      this.sorttype = "ASC";
      this.filterCourse();
    } else if (selectedValue == 'highToLow') {
      // Sort by price: high to low
      this.sortby = "offerprice";
      this.sorttype = "DESC";
      this.filterCourse();
    } else {
      // Sort by price: high to low
      this.sortby = "_id";
      this.sorttype = "DESC";
      this.filterCourse(event,'category');
    }
  }

  searchCategoryById(idToFind: number): any | undefined {
    // console.log('catid:',idToFind)
    return this.categories.filter((item:any) => item._id == idToFind);
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

  addToBookmark(data:any){
    data['type'] = 'product';
    this.cart.addbookMark(data);
  }

  findHighestAndLowestOfferPrice(products:any) {
    if (!products || products.length === 0) {
        return null;
    }

    let highestOfferPrice = Number.MIN_VALUE;
    let lowestOfferPrice = Number.MAX_VALUE;

    for (const product of products) {
        if (product.offerprice > highestOfferPrice) {
            highestOfferPrice = product.offerprice;
        }

        if (product.offerprice < lowestOfferPrice) {
            lowestOfferPrice = product.offerprice;
        }
    }

    return {
        highestOfferPrice,
        lowestOfferPrice,
    };
}
}
