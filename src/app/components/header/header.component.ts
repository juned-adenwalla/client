import { Component, ElementRef, Input, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { BaseService } from 'src/app/services/base.service';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() sitedata:any;
  baseurl:any = environment.baseurl;
  currencies: any;
  selectedCurrency:any = {}
  userdata: any;
  isMenuOpen = false;
  constructor(private baseService:BaseService,private router: Router,private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    if(localStorage.getItem('currency')){
      const selectedCurrency:any = localStorage.getItem('currency');
      this.selectedCurrency = JSON.parse(selectedCurrency);
    }else{
      localStorage.setItem('currency','{"_id":3,"name":"INR","value":"1","status":"1"}')
    }
    if(localStorage.getItem('userdata')){
      const userdata:any = localStorage.getItem('userdata');
      this.userdata = JSON.parse(userdata);
    }else{
      this.userdata = undefined;
    }
    
    this.baseService.get('/api/midoffice/list/collection/' + "tblcurrencies",{filter:"status",value:1}).subscribe((res:any)=>{
      if(res["status"]){
        this.currencies = res["data"];
        console.log(this.currencies)
      }
    });
  }

  setCurrency(object:any){
    console.log(object)
    localStorage.setItem('currency', JSON.stringify(object));
  }

  toggleHeaderBar() {
    const headerBar = this.el.nativeElement.querySelector('.header-bar');
    const menu = this.el.nativeElement.querySelector('.menu');

    if (headerBar) {
      this.renderer.addClass(headerBar, 'active');
    }

    if (menu) {
      if (this.isMenuOpen) {
        this.renderer.removeClass(menu, 'active');
      } else {
        this.renderer.addClass(menu, 'active');
      }
      this.isMenuOpen = !this.isMenuOpen; // Toggle the menu state
    }
  }
}
