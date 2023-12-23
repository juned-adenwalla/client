import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BaseService } from 'src/app/services/base.service';
import { CartService } from 'src/app/services/cart.service';
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
  constructor(private baseService:BaseService,private router: Router,private el: ElementRef, private renderer: Renderer2, private cart: CartService,private auth:AuthService, private cd: ChangeDetectorRef) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current route is "home"
        const isHomeRoute = event.url === '/' || event.urlAfterRedirects === '/';
        // Apply the CSS class based on the route
        const header = this.el.nativeElement.querySelector('.header-section');
        this.closeHeader();
        if (isHomeRoute) {
          this.renderer.addClass(header, 'home');
        } else {
          this.renderer.removeClass(header, 'home');
        }
      }
    });
  }

  ngOnInit() {
    if(localStorage.getItem('currency')){
      const selectedCurrency:any = localStorage.getItem('currency');
      this.selectedCurrency = JSON.parse(selectedCurrency);
    }else{
      localStorage.setItem('currency',JSON.stringify({"_id":3,"name":"INR","value":"1","status":"1"}))
    }
    if(this.auth.getUser()){
      const userdata:any = this.auth.getUser();
      this.userdata = userdata;
    }else{
      this.userdata = undefined;
    }
    
    this.baseService.get('/api/midoffice/list/collection/' + "tblcurrencies",{filter:"status",value:1}).subscribe((res:any)=>{
      if(res["status"]){
        this.currencies = res["data"];
      }
    });
  }

  closeHeader(){
    const menu = this.el.nativeElement.querySelector('.menu');

    if (menu) {
      this.renderer.removeClass(menu, 'active');
      this.isMenuOpen = false;
      this.cd.detectChanges();
    }
  }

  setCurrency(object:any){
    localStorage.setItem('currency', JSON.stringify(object));
  }

  toggleHeaderBar() {
    const headerBar = this.el.nativeElement.querySelector('.header-bar');
    const menu = this.el.nativeElement.querySelector('.menu');

    // if (headerBar) {
    //   this.renderer.addClass(headerBar, 'active');
    //   this.cd.detectChanges()
    // }

    if (menu) {
      if (this.isMenuOpen) {
        this.renderer.removeClass(menu, 'active');
        this.cd.detectChanges();
      } else {
        this.renderer.addClass(menu, 'active');
        this.cd.detectChanges();
      }
      this.isMenuOpen = !this.isMenuOpen; // Toggle the menu state
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event) {
    const header = this.el.nativeElement.querySelector('.header-section');

    if (window.pageYOffset > 100) {
      this.renderer.addClass(header, 'sticky');
    } else {
      this.renderer.removeClass(header, 'sticky');
    }
  }

  showItems(){
    return this.cart.getCart();
  }

}

