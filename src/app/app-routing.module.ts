import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ArtTherapyComponent } from './components/art-therapy/art-therapy.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { CoursesComponent } from './components/courses/courses.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AccountComponent } from './components/account/account.component';
import { AuthGuard } from './services/auth.guard';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { RefundsComponent } from './components/refunds/refunds.component';
import { BlogViewComponent } from './components/blog-view/blog-view.component';
import { CourseViewComponent } from './components/course-view/course-view.component';

const routes: Routes = [
  {path:'',component:HomepageComponent,pathMatch:'full'},
  {path:'about-us',component:AboutUsComponent},
  {path:'art-therapy',component:ArtTherapyComponent},
  {path:'contact-us',component:ContactUsComponent},
  {path:'all-courses',component:CoursesComponent},
  {path:'all-blogs',component:BlogsComponent},
  {path:'course/:id',component:CourseDetailComponent},
  {path:'course/view/:id',component:CourseViewComponent},
  {path:'blog/:id',component:BlogViewComponent},
  {path:'signup',component:SignupComponent},
  {path:'login',component:LoginComponent},
  {path:'my-account',component:AccountComponent,canActivate:[AuthGuard]},
  {path:'checkout/:id',component:CheckoutComponent,canActivate:[AuthGuard]},
  {path:'terms-and-condition',component:TermsComponent},
  {path:'privacy-policy',component:PrivacyComponent},
  {path:'refund-cancellation-policy',component:RefundsComponent}
]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
