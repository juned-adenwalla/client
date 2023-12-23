import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-membership',
  templateUrl: './membership.component.html',
  styleUrls: ['./membership.component.css']
})
export class MembershipComponent {
  isLoading: any;
  membership: any;
  currencycode: any;
  userdata: any;
  users: any;
  constructor(private baseService:BaseService,private cart: CartService,private auth:AuthService) { }
  ngOnInit() {
    this.initFunction();
  }

  initFunction(){
    if(this.auth.getUser()){
      const userdata:any = this.auth.getUser();
      this.userdata = userdata;
      this.baseService.get('/api/midoffice/list/collection/tblusers',{filter:"_id",value:this.userdata?._id}).subscribe((res:any)=>{
        if(res['status']){
          this.users = res["data"][0];
        }
      })
    }else{
      this.userdata = undefined;
    }
    const membership = this.baseService.get('/api/midoffice/list/collection/' + "tblsubscription",{filter:"status",value:1}); 
    forkJoin([membership]).subscribe((res:any)=>{
      if(res[0]){
        if(res[0]["status"]){
          this.membership = res[0]["data"];
        }
      }
      this.isLoading = false;
    })
  }

  currencyConversion(amount:any){
    const selectedCurrency:any = localStorage.getItem('currency');
    const obj = JSON.parse(selectedCurrency);
    this.currencycode = obj.name
    return obj.value * amount;
  }

  addToCart(data:any){
    data['type'] = 'membership';
    if(data){
      this.cart.addToCart(data);
    }
  }

}

