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
import { ProductsComponent } from './components/products/products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { MembershipComponent } from './components/membership/membership.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { NewsComponent } from './components/news-articles/news.component';
import { ThankYouComponent } from './components/thank-you/thank-you.component';

const routes: Routes = [
  {path:'',component:HomepageComponent,pathMatch:'full',data: {
    title: "Art Studio, Art School and Art Therapy in Navi Mumbai | Moniqart",
    description: "Explore various techniques of learning art by skilled trainers and experience art therapy by certified art therapists at Moniqart studio in Koparkhairane.",
    keywords: 'art school navi mumbai, art studio classes, navi mumbai art classes, moniqart art studio, creative workshops, painting classes, drawing lessons, fine arts education, contemporary art training, skill development courses'
  }},
  {path:'about-us',component:AboutUsComponent,data: {
    title: "Professional Art Studio in Koparkhairane | Moniqart",
    description: "Moniqart is a professional art studio established in 2006 where you get to enhance your art skills, prepare for art examinations, explore arts based therapy and more.",
    keywords: 'professional art classes, art classes, art classes koparkhairane, art classes in navi mumbai, drawing class, drawing class for kids, art classes for adults'
  }},
  {path:'art-therapy',component:ArtTherapyComponent,data: {
    title: "Art Therapy By Certified Therapists in Navi Mumbai | Moniqart",
    description: "Discover the healing power of art therapy with certified art therapists. explore a transformative journey to well-being through creative expression.",
    keywords: 'moniqart art therapy, certified art therapists, art therapy, healing through art, creative expression, therapeutic art, well-being, art and mental health, art therapy benefits'
  }},
  {path:'contact-us',component:ContactUsComponent,data: {
    title: "Contact | Reach Out for Inquiries and Information | Moniqart",
    description: "Have questions about our art programs, admissions, or events? Contact Moniqart through our dedicated contact page.",
    keywords: 'art school contact, inquiries, admissions information, moniqart contact, art education, art programs in navi mumbai'
  }},
  {path:'all-courses',component:CoursesComponent,data: {
    title: "Art Courses and Classes, Art Examinations and More | Moniqart",
    description: "Explore art courses and classes, art examinations, and more at moniqart. discover a world of creative learning opportunities and artistic assessments for enthusiasts of all levels.",
    keywords: 'art courses, art classes, art examinations, creative learning, artistic assessments, moniqart'
  }},
  {path:'all-courses/:id',component:CoursesComponent,data: {
    title: "Art Courses and Classes, Art Examinations and More | Moniqart",
    description: "Explore art courses and classes, art examinations, and more at moniqart. discover a world of creative learning opportunities and artistic assessments for enthusiasts of all levels.",
    keywords: 'art courses, art classes, art examinations, creative learning, artistic assessments, moniqart'
  }},
  {path:'all-blogs',component:BlogsComponent,data: {
    title: "Best Art Blogs to add to your Collection | Moniqart",
    description: "Explore stunning creations, learn techniques, and uncover the stories behind each masterpiece. Immerse yourself in the realm of creativity through our art blogs.",
    keywords: 'art school, art blog, creativity, artistic creations, art education, innovative techniques, diverse artworks, emerging artists, artistic community, inspiring programs'
  }},
  {path:'course/:id',component:CourseDetailComponent},
  {path:'course/view/:id',component:CourseViewComponent,canActivate:[AuthGuard]},
  {path:'blog/:id',component:BlogViewComponent},
  {path:'signup',component:SignupComponent,data: {
    title: "Create Account | Moniqart",
    description: "Explore various techniques of learning art by skilled trainers and experience art therapy by certified art therapists at Moniqart studio in Koparkhairane.",
    keywords: 'art school, art blog, creativity, artistic creations, art education, innovative techniques, diverse artworks, emerging artists, artistic community, inspiring programs'
  }},
  {path:'login',component:LoginComponent,data: {
    title: "Login | Moniqart",
    description: "Explore various techniques of learning art by skilled trainers and experience art therapy by certified art therapists at Moniqart studio in Koparkhairane.",
    keywords: 'art school, art blog, creativity, artistic creations, art education, innovative techniques, diverse artworks, emerging artists, artistic community, inspiring programs'
  }},
  {path:'my-account',component:AccountComponent,canActivate:[AuthGuard],data: {
    title: "My Account | Moniqart",
    description: "Explore various techniques of learning art by skilled trainers and experience art therapy by certified art therapists at Moniqart studio in Koparkhairane.",
    keywords: 'art school, art blog, creativity, artistic creations, art education, innovative techniques, diverse artworks, emerging artists, artistic community, inspiring programs'
  }},
  {path:'checkout',component:CheckoutComponent,canActivate:[AuthGuard],data: {
    title: "Checkout | Moniqart",
    description: "Explore various techniques of learning art by skilled trainers and experience art therapy by certified art therapists at Moniqart studio in Koparkhairane.",
    keywords: 'art school, art blog, creativity, artistic creations, art education, innovative techniques, diverse artworks, emerging artists, artistic community, inspiring programs'
  }},
  {path:'terms-and-condition',component:TermsComponent,data: {
    title: "Terms & Condition | Moniqart",
    description: "Explore various techniques of learning art by skilled trainers and experience art therapy by certified art therapists at Moniqart studio in Koparkhairane.",
    keywords: 'art school, art blog, creativity, artistic creations, art education, innovative techniques, diverse artworks, emerging artists, artistic community, inspiring programs'
  }},
  {path:'privacy-policy',component:PrivacyComponent,data: {
    title: "Privacy Policy | Moniqart",
    description: "Explore various techniques of learning art by skilled trainers and experience art therapy by certified art therapists at Moniqart studio in Koparkhairane.",
    keywords: 'art school, art blog, creativity, artistic creations, art education, innovative techniques, diverse artworks, emerging artists, artistic community, inspiring programs'
  }},
  {path:'refund-cancellation-policy',component:RefundsComponent,data: {
    title: "Refund & Cancellation Policy | Moniqart",
    description: "Explore various techniques of learning art by skilled trainers and experience art therapy by certified art therapists at Moniqart studio in Koparkhairane.",
    keywords: 'art school, art blog, creativity, artistic creations, art education, innovative techniques, diverse artworks, emerging artists, artistic community, inspiring programs'
  }},
  {path:'shop',component:ProductsComponent,data: {
    title: "Buy Art Prints, E-Books, Art Supplies, and More | Moniqart",
    description: "Explore captivating art prints, gain insights with exclusive e-books, and find quality art supplies for every creative endeavor at Moniqart e-store.",
    keywords: 'art shop, art prints, e-books, art supplies, creative expression, artistic inspiration, curated collection, quality art materials, unleash creativity, moniqart'
  }},
  {path:'product/:id',component:ProductDetailComponent,pathMatch:'full'},
  {path:'memberships',component:MembershipComponent,data: {
    title: "Memberships | Moniqart",
    description: "Explore captivating art prints, gain insights with exclusive e-books, and find quality art supplies for every creative endeavor at Moniqart e-store.",
    keywords: 'art shop, art prints, e-books, art supplies, creative expression, artistic inspiration, curated collection, quality art materials, unleash creativity, moniqart'
  }},
  {path:'gallery',component:GalleryComponent,data: {
    title: "Image Gallery | Art Classes in Navi Mumbai | Moniqart ",
    description: "Each image in the Moniqart gallery tells a story of our journey. Explore our captured moments of happiness and creativity.",
    keywords: 'canvas painting, image gallery, art gallery, image gallery templates, art themes, canvas painting images, painting tutorials, easy watercolor art'
  }},
  {path:'news-articles',component:NewsComponent,data: {
    title: "News and Articles in the Art Industry | Moniqart ",
    description: "Stay updated with the latest news and articles in the art industry. explore insightful perspectives and trends at moniqart.",
    keywords: 'moniqart, art industry news, articles, art insights, industry trends'
  }},
  {path:'thank-you',component:ThankYouComponent,canActivate:[AuthGuard],data: {
    title: "Payment Successfull | Moniqart ",
    description: "Stay updated with the latest news and articles in the art industry. explore insightful perspectives and trends at moniqart.",
    keywords: 'moniqart, art industry news, articles, art insights, industry trends'
  }}

]
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
