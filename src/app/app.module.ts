import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DefaultLayoutModule } from './core/default-layout/default-layout.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { LoginComponent } from './modules/auth/login/login.component';
import { SharedAppModule } from './core/shared/shared.module';
import { RegisterComponent } from './modules/auth/register/register.component';
import { ResetPasswordComponent } from './modules/auth/reset-password/reset-password.component';
import { FeatureGuard } from './core/permission/guards/feature.guard';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './core/shared/interceptors/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { RouterModule } from '@angular/router';
import { AjoutRessourcesComponent } from './front/ajout-ressources/ajout-ressources.component';
import { RessourcesComponent } from './front/ressources/ressources.component';
import { AddCategorieComponent } from './front/add-categorie/add-categorie.component';
import { EditCategorieComponent } from './front/edit-categorie/edit-categorie.component';
import { AffichageCategorieComponent } from './front/affichage-categorie/affichage-categorie.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@NgModule({
  
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ResetPasswordComponent,
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
    AffichageCategorieComponent,
    EditCategorieComponent,
    AddCategorieComponent,
    RessourcesComponent,
    AjoutRessourcesComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DefaultLayoutModule,
    DashboardModule,
    SharedAppModule,
    BrowserAnimationsModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule,
    MainSidebarModule,
    MatDialogModule, 
    MatFormFieldModule, 
    MatInputModule,
    MatButtonModule,
    MatSelectModule   
],
  providers: [
    FeatureGuard,
    MatDatepickerModule,
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },],
  bootstrap: [AppComponent]
})
export class AppModule { }
