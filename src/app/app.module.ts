import { NgModule, LOCALE_ID} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from  '@angular/common/http';
import {NgxPaginationModule} from 'ngx-pagination';
import localeIn from '@angular/common/locales/en-IN';
import { registerLocaleData } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ArtTherapyComponent } from './components/art-therapy/art-therapy.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { CoursesComponent } from './components/courses/courses.component';
import { BlogsComponent } from './components/blogs/blogs.component';
import { CourseDetailComponent } from './components/course-detail/course-detail.component';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { AccountComponent } from './components/account/account.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { TermsComponent } from './components/terms/terms.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { RefundsComponent } from './components/refunds/refunds.component';
import { BlogViewComponent } from './components/blog-view/blog-view.component';
import { CourseViewComponent } from './components/course-view/course-view.component';
import { SharedModule } from './shared/shared.module';
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { MembershipComponent } from './components/membership/membership.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { NewsComponent } from './components/news-articles/news.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';

registerLocaleData(localeIn);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomepageComponent,
    AboutUsComponent,
    ArtTherapyComponent,
    ContactUsComponent,
    CoursesComponent,
    BlogsComponent,
    CourseDetailComponent,
    SignupComponent,
    LoginComponent,
    AccountComponent,
    CheckoutComponent,
    TermsComponent,
    PrivacyComponent,
    RefundsComponent,
    BlogViewComponent,
    CourseViewComponent,
    ProductsComponent,
    ProductDetailComponent,
    MembershipComponent,
    GalleryComponent,
    NewsComponent,
    ThankYouComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxPaginationModule,
    FormsModule,
    SharedModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-IN' }
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
