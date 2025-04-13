import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {AuthentificationService} from '../../services/services/authentification.service';
import {RegistrationRequest} from '../../services/models/registration-request';


@Component({
  selector: 'app-register-front',
  templateUrl: './register-front.component.html',
  styleUrls: ['./register-front.component.css']
})
export class RegisterFrontComponent {
  registerRequest: RegistrationRequest = {email: '', nom: '', prenom: '', motDePasse: '',phoneNumber: '',roles: 'Student'};
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthentificationService
  ) {
  }

  login() {
    this.router.navigate(['login']);
  }

  register() {
    this.errorMsg = [];
    this.authService.register({
      body: this.registerRequest
    })
      .subscribe({
        next: () => {
          this.router.navigate(['activate-account']);
        },
        error: (err) => {
          this.errorMsg = err.error.validationErrors;
        }
      });
  }
}
