import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultLayoutModule } from './core/default-layout/default-layout.module';
import { SharedAppModule } from './core/shared/shared.module';
import { FeatureGuard } from './core/permission/guards/feature.guard';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/shared/interceptors/auth.interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainSidebarModule } from "./core/default-layout/main-sidebar/main-sidebar.module";
import { FooterComponent } from './front/footer/footer.component';
import { HeaderComponent } from './front/header/header.component';
import { CoursesComponent } from './front/courses/courses.component';
import { AboutComponent } from './front/about/about.component';
import { NavbarComponent } from './front/navbar/navbar.component';
import { HomeComponent } from './front/home/home.component';
import { FrontLayoutComponent } from './front/front-layout/front-layout.component';
import { ContactComponent } from './front/contact/contact.component';
import { ElementsComponent } from './front/elements/elements.component';
import { BlogComponent } from './front/blog/blog.component';
import { BlogDetailsComponent } from './front/blog-details/blog-details.component';
import { PreloaderComponent } from './front/preloader/preloader.component';
import { LoginFrontComponent } from './front/login-front/login-front.component';
import { RegisterFrontComponent } from './front/register-front/register-front.component';
import { AddPostComponent } from './front/add-post/add-post.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FooterBackComponent } from './back/footer-back/footer-back.component';
import { SidebarBackComponent } from './back/sidebar-back/sidebar-back.component';
import { HeaderBackComponent } from './back/header-back/header-back.component';
import { BackLayoutComponent } from './back/back-layout/back-layout.component';


@NgModule({
  declarations: [
    AppComponent,
  
    FooterComponent,
    HeaderComponent,
    CoursesComponent,
    AboutComponent,
    NavbarComponent,
    HomeComponent,
    FrontLayoutComponent,
    ContactComponent,
    ElementsComponent,
    BlogComponent,
    BlogDetailsComponent,
    PreloaderComponent,
    LoginFrontComponent,
    RegisterFrontComponent,
    BackLayoutComponent,
    HeaderBackComponent,
    SidebarBackComponent,
    FooterBackComponent,
    AddPostComponent
  // Removed from imports and added to providers
   ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DefaultLayoutModule,
    SharedAppModule,
    BrowserAnimationsModule,
    NgbModule,
    MainSidebarModule,
    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      progressBar:true,
      closeButton:true,
      newestOnTop:true,
      tapToDismiss:true,
      positionClass:'toast-top-right',
      timeOut: 8000,

    }),
  ],

  providers: [
    FeatureGuard,
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy
    // },
    
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    
     ],
  bootstrap: [AppComponent]
  
}
)
export class AppModule { 
  
}
