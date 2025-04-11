import { Component } from '@angular/core';
import { AuthentificationRequest } from '../../services/models/authentification-request';
import { Router } from '@angular/router';
import { AuthentificationService } from 'src/app/services/services';
import { TokenService } from 'src/app/services/token/token.service';

@Component({
  selector: 'app-login-front',
  templateUrl: './login-front.component.html',
  styleUrls: ['./login-front.component.css']
})
export class LoginFrontComponent {
  authRequest: AuthentificationRequest = { email: '', motDePasse: '' };
  errorMsg: Array<string> = [];

  constructor(
    private router: Router,
    private authService: AuthentificationService,
    private tokenService: TokenService
  ) {}

  // Fonction pour décoder le token JWT et récupérer le rôle
  private getUserRole(token: string): string {
    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload)); // Décodage du payload
      const role = decodedPayload.role || ''; // Récupérer le rôle (assurer que 'role' est bien défini dans le token)

      return role; // Retourner le rôle trouvé
    } catch (e) {
      console.error('Erreur lors du décodage du token :', e);
      return ''; // Retourner une chaîne vide si erreur
    }
  }

  // Fonction de connexion
  login() {
    this.errorMsg = []; // Réinitialiser les messages d'erreur
    this.authService.authenticate({
      body: this.authRequest
    }).subscribe({
      next: (res) => {
        if (res.token) {
          // Sauvegarder le token dans le service TokenService
          this.tokenService.token = res.token as string;

          // Récupérer le rôle depuis le token
          const role = this.getUserRole(res.token);

          if (role === 'Admin' || role === 'Entrepreneur') {
            this.router.navigate(['dashboard']);
          } else if (role === 'Student') {
            this.router.navigate(['home']);
          } else {
            // Si le rôle est inconnu, afficher un message générique sans mentionner le rôle
            this.errorMsg.push('Vous n\'avez pas accès à ce service.');
          }
        } else {
          this.errorMsg.push('Token manquant dans la réponse.');
        }
      },
      error: (err) => {
        console.log(err);
        if (err.error && err.error.validationErrors) {
          // Afficher les erreurs de validation
          this.errorMsg = err.error.validationErrors;
        } else {
          // Afficher l'erreur générique
          this.errorMsg.push(err.error ? err.error : 'Une erreur est survenue. Veuillez réessayer.');
        }
      }
    });
  }

  // Fonction pour rediriger vers l'inscription
  register() {
    this.router.navigate(['register']);
  }
}
