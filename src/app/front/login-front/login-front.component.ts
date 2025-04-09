import { Component } from '@angular/core';
import { AuthentificationRequest } from '../../services/models/authentification-request';



@Component({
  selector: 'app-login-front',
  templateUrl: './login-front.component.html',
  styleUrls: ['./login-front.component.css']
})
export class LoginFrontComponent {
  

  authRequest: AuthentificationRequest = {email: '', motDePasse: ''};
  errorMsg: Array<string> = [];

  
  /*login() {
    this.errorMsg = [];
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        this.tokenService.token = res.token as string;
        this.router.navigate(['books']);
      },
      error: (err) => {
        console.log(err);
        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.errorMsg);
        }
      }
    });
  }

  register() {
    this.router.navigate(['register']);
  }*/
}
