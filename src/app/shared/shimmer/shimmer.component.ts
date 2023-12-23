import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-shimmer',
  templateUrl: './shimmer.component.html',
  styleUrls: ['./shimmer.component.css']
})
export class ShimmerComponent {
  @Input() module:any;
  ngOnInit() {
  console.log('module:',module)
  }
}
