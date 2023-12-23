import { Component } from '@angular/core';
import { BaseService } from './services/base.service';
import { ActivatedRoute, Data, NavigationEnd, Router } from '@angular/router';
import { CartService } from './services/cart.service';
import { MetaService } from './services/meta.service';
import { filter, map, mergeMap, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  sitedata: any;
  currency: any | null;
  constructor(private baseService:BaseService,private router: Router,private activatedRoute: ActivatedRoute,private metaService: MetaService) { }

  ngOnInit() {
    // console.log(this.userdata)
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
          return;
      }
      window.scrollTo(0, 0)
    });
    this.initFunction();
  }

  initFunction(){
    this.baseService.get('/api/midoffice/list/collection/' + "tblsiteconfig",{filter:"_id",value:1}).subscribe((res:any)=>{
      if(res["status"]){
        this.sitedata = res["data"][0];
      }
    });
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data),
        tap(({title,description}: Data) => {
           this.metaService.updateTitle(title);
           this.metaService.updateDescription(description);
         })
      ).subscribe();
  }

}
