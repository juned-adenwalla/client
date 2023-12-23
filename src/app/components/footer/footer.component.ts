import { Component, Input } from '@angular/core';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  baseurl:any = environment.baseurl;
  @Input() sitedata:any;
}
