import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './core/default-layout/default-layout.component';
import { FrontLayoutComponent } from './front/front-layout/front-layout.component';
import { AboutComponent } from './front/about/about.component';
import { CoursesComponent } from './front/courses/courses.component';
import { HomeComponent } from './front/home/home.component';
import { ElementsComponent } from './front/elements/elements.component';
import { BlogDetailsComponent } from './front/blog-details/blog-details.component';
import { BlogComponent } from './front/blog/blog.component';
import { ContactComponent } from './front/contact/contact.component';
import { RegisterFrontComponent } from './front/register-front/register-front.component';
import { LoginFrontComponent } from './front/login-front/login-front.component';
import { AddPostComponent } from './front/add-post/add-post.component';
import { BackLayoutComponent } from './back/back-layout/back-layout.component';
import { DashboardComponent } from './back/dashboard/dashboard.component';

const routes: Routes = [

  {
    path: '',
    component: FrontLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'courses', component: CoursesComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'blog', component: BlogComponent },
      { path: 'blog-details/:id', component: BlogDetailsComponent },
      { path: 'elements', component: ElementsComponent },
      { path: 'add-post', component: AddPostComponent },
      { path: 'add-post/:id', component: AddPostComponent },
      
    ]
  },
  
  {
    path: 'back',
    component: BackLayoutComponent,
    children: [
      { path: '', component: DashboardComponent },
    ]
  },
  {
    path: 'register',
    component: RegisterFrontComponent,
    data: {
      title: 'Register Page'
    }
  },
  
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
