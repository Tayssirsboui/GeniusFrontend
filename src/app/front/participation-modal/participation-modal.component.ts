import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Participation } from 'src/app/models/participation.model';
import { StatutParticipation } from 'src/app/models/statut-participation.enum';
import { Evenement } from 'src/app/models/evenement.model';
import { ParticipationService } from 'src/app/services/participation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-participation-modal',
  templateUrl: './participation-modal.component.html'
})
export class ParticipationModalComponent {
  @Input() evenement!: Evenement;

  constructor(
    public activeModal: NgbActiveModal,
    private participationService: ParticipationService
  ) {}

  private formatLocalDateTime(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
  confirmerParticipation() {
    const dto = {
      evenementId: this.evenement.id,
      statut: StatutParticipation.EN_ATTENTE
    };
  
    this.participationService.ajouter(dto).subscribe({
      next: (updatedEvent) => {
        Swal.fire({
          title: 'Participation confirmée 🎉',
          text: 'Vous êtes inscrit à cet événement avec succès !',
          icon: 'success',
          confirmButtonText: 'Fermer',
          timer: 2000
        }).then(() => {
          this.activeModal.close(updatedEvent); // renvoie l’événement mis à jour
        });
      },
      error: () => {
        Swal.fire({
          title: 'Erreur ❌',
          text: 'Une erreur est survenue lors de l’inscription.',
          icon: 'error',
          confirmButtonText: 'Fermer'
        });
      }
    });
  }
}
